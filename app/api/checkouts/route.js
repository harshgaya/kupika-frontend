import { collections } from "@/src/lib/db/mongodb";
import { ok, fail, toObjectId } from "@/src/lib/server-utils";
import { getSessionUserId } from "@/src/lib/auth/session";
import { requireProductPrice } from "@/src/lib/product-map";

const serialize = c => ({...c,_id:String(c._id),userId:c.userId?String(c.userId):null,items:(c.items||[]).map(i=>({...i,productId:String(i.productId)}))});

export async function POST(req){
 try{
  const {productId,quantity=1,guest_id}=await req.json(); const pid=toObjectId(productId); if(!pid)return fail("Invalid product.");
  const p=await (await collections.products()).findOne({_id:pid}); if(!p)return fail("Product unavailable.",404);
  let pv; try{pv=requireProductPrice(p)}catch{return fail("Product price is unavailable. Please contact support.",422)}
  if(pv.inStock===false || (pv.stockQuantity>0 && pv.stockQuantity<1)) return fail("Product is currently out of stock.",409);
  const qty=Math.max(1,Math.min(20,Number(quantity)||1)); const uid=await getSessionUserId(); const now=new Date();
  const doc={userId:uid?toObjectId(uid):null,user_id:uid?String(uid):null,guestId:guest_id||null,guest_id:guest_id||null,status:"active",source:"website",checkoutType:"website",items:[{productId:pid,product_id:String(pid),slug:pv.slug,name:pv.name,product:pv.name,image:pv.image,price:pv.price,quantity:qty}],itemsTotal:pv.price*qty,total:pv.price*qty,createdAt:now,created_at:now,updatedAt:now,updated_at:now};
  const r=await (await collections.checkouts()).insertOne(doc); return ok({checkoutId:String(r.insertedId)});
 }catch(e){console.error(e);return fail("Could not start checkout.",500)}
}
export async function GET(req){try{const id=toObjectId(req.nextUrl.searchParams.get("id"));if(!id)return fail("Invalid checkout.");const c=await (await collections.checkouts()).findOne({_id:id});if(!c)return fail("Checkout not found.",404);return ok(serialize(c));}catch(e){return fail("Could not load checkout.",500)}}
export async function PATCH(req){try{const b=await req.json(),id=toObjectId(b.id);if(!id)return fail("Invalid checkout.");const uid=await getSessionUserId();const set={updatedAt:new Date(),updated_at:new Date()};if(uid){set.userId=toObjectId(uid);set.user_id=String(uid)}if(b.address){set.address={name:String(b.address.name||""),phone:String(b.address.phone||""),street_address:String(b.address.street_address||""),city:String(b.address.city||""),state:String(b.address.state||""),pincode:String(b.address.pincode||"")};set.customerName=set.address.name;set.customer_name=set.address.name;set.phone=set.address.phone;set.mobile_number=set.address.phone}await(await collections.checkouts()).updateOne({_id:id,status:"active"},{$set:set});return ok({updated:true})}catch(e){console.error(e);return fail("Could not update checkout.",400)}}
