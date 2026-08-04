import { collections } from "@/src/lib/db/mongodb";
import { ok } from "@/src/lib/server-utils";
import { requireAdmin, serialize } from "@/src/lib/admin/api";

function orderView(o) {
  const qty = Number(o.quantity || o.items?.[0]?.quantity || 1);
  const unit = Number(o.price || o.items?.[0]?.price || 0);
  const total = Number(o.total ?? o.amount ?? (unit * qty));
  return {
    ...o,
    orderNumber: `#${String(o._id).slice(-8).toUpperCase()}`,
    customerName: o.customerName || o.customer_name || o.address?.name || o.shippingAddress?.name || "—",
    mobileNumber: o.mobileNumber || o.mobile_number || o.address?.phone || o.shippingAddress?.phone || "",
    total,
    source: String(o.source || o.order_source || "website").toLowerCase(),
    status: String(o.status || o.order_status || "placed").toLowerCase(),
  };
}

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  const [users, orders, calls, queries, checkouts, websiteTrack] = await Promise.all([
    collections.users(), collections.orders(), collections.aiCalls(), collections.customerQueries(), collections.checkouts(), collections.websiteTrack()
  ]);
  const [totalUsers,totalOrders,totalCalls,openQueries,totalCheckouts,convertedCheckouts,revenueRows,callMinutesRows,sourceRows,recentOrders,track] = await Promise.all([
    users.countDocuments(), orders.countDocuments(), calls.countDocuments(), queries.countDocuments({status:{$ne:"resolved"}}),
    checkouts.countDocuments(), checkouts.countDocuments({status:"converted"}),
    orders.aggregate([
      {$match:{$and:[{status:{$ne:"cancelled"}},{order_status:{$ne:"CANCELLED"}}]}},
      {$project:{value:{$ifNull:["$total",{$ifNull:["$amount",{$multiply:[{$ifNull:["$price",0]},{$ifNull:["$quantity",1]}]}]}]}}},
      {$group:{_id:null,total:{$sum:"$value"}}}
    ]).toArray(),
    calls.aggregate([{$project:{seconds:{$convert:{input:{$ifNull:["$durationSeconds",{$ifNull:["$duration_seconds",{$ifNull:["$duration",0]}]}]},to:"double",onError:0,onNull:0}}}},{$group:{_id:null,seconds:{$sum:"$seconds"}}}]).toArray(),
    orders.aggregate([{$project:{src:{$toLower:{$ifNull:["$source",{$ifNull:["$order_source","website"]}]}}}},{$group:{_id:"$src",count:{$sum:1}}}]).toArray(),
    orders.find().sort({created_at:-1,createdAt:-1}).limit(8).toArray(),
    websiteTrack.findOne({}, {sort:{updated_at:-1}})
  ]);
  const bySource=Object.fromEntries(sourceRows.map(x=>[x._id,x.count]));
  return ok({
    totalUsers,totalOrders,totalCalls,openQueries,totalCheckouts,convertedCheckouts,
    revenue:revenueRows[0]?.total||0,
    totalCallMinutes:Math.round(((callMinutesRows[0]?.seconds||0)/60)*10)/10,
    aiOrders:bySource.ai||0, whatsappOrders:bySource.whatsapp||0, websiteOrders:bySource.website||0,
    adminOrders:bySource.admin||0, checkoutOrders:bySource.checkout||0,
    checkoutConversionRate:totalCheckouts?Math.round((convertedCheckouts/totalCheckouts)*1000)/10:0,
    websiteVisits:Number(track?.website_visit||0), whatsappClicks:Number(track?.whatsapp_click||0), callClicks:Number(track?.call_click||0),
    recentOrders:serialize(recentOrders.map(orderView))
  });
}
