"use client";

import { getOrders } from "@/src/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders();
        setOrders(orders || []);
      } catch (e) {
        console.error("Failed to fetch orders", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] px-4 py-10">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-7 w-32 rounded-lg bg-gray-200 animate-pulse mb-8" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-6 w-24 rounded-full bg-gray-200" />
              </div>
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-32 rounded bg-gray-200" />
                </div>
              </div>
              <div className="h-12 w-full rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex flex-col items-center justify-center px-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');
          .orders-font { font-family: 'DM Sans', sans-serif; }
          .orders-display { font-family: 'Fraunces', serif; }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .float { animation: float 3s ease-in-out infinite; }
        `}</style>
        <div className="orders-font text-center max-w-sm">
          <div className="float mb-6 inline-block">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-white shadow-lg flex items-center justify-center mx-auto">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <rect
                    x="8"
                    y="14"
                    width="36"
                    height="30"
                    rx="4"
                    fill="#f0ede8"
                    stroke="#c9b99a"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M18 14v-2a8 8 0 0116 0v2"
                    stroke="#c9b99a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="26" cy="29" r="5" fill="#c9b99a" />
                  <path
                    d="M24 29l1.5 1.5L28 27"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-100 rounded-full border-2 border-white" />
              <div className="absolute -bottom-1 -left-2 w-4 h-4 bg-stone-200 rounded-full border-2 border-white" />
            </div>
          </div>
          <h2 className="orders-display text-3xl font-semibold text-gray-800 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {
              "            Looks like you haven't placed any orders. Start shopping and your orders will appear here."
            }
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M4 8h8M6 12h4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        .orders-font { font-family: 'DM Sans', sans-serif; }
        .orders-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="mx-auto max-w-2xl orders-font">
        <h1 className="orders-display text-3xl font-semibold text-gray-900 mb-8">
          My Orders
          <span className="ml-3 text-base font-normal text-gray-400 font-sans">
            ({orders.length})
          </span>
        </h1>

        <div className="space-y-4">
          {orders.map((order, i) => (
            <OrderCard key={order._id} order={order} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, index }) {
  const total = order.price * order.quantity;
  const placedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPlaced = !order.order_status || !order.tracking_id;

  const statusConfig = isPlaced
    ? {
        label: "Order Placed",
        color: "bg-blue-50 text-blue-600",
        dot: "bg-blue-400",
      }
    : order.order_status.toLowerCase().includes("delivered")
      ? {
          label: order.order_status,
          color: "bg-green-50 text-green-700",
          dot: "bg-green-500",
        }
      : order.order_status.toLowerCase().includes("cancel")
        ? {
            label: order.order_status,
            color: "bg-red-50 text-red-600",
            dot: "bg-red-400",
          }
        : {
            label: order.order_status,
            color: "bg-amber-50 text-amber-700",
            dot: "bg-amber-400",
          };

  return (
    <div
      className="fade-up rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50/60">
        <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {placedDate}
        </span>
        <span
          className={
            "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full " +
            statusConfig.color
          }
        >
          <span className={"w-1.5 h-1.5 rounded-full " + statusConfig.dot} />
          {statusConfig.label}
        </span>
      </div>

      {/* Product row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="relative flex-shrink-0">
          <img
            src={order.image}
            alt={order.product}
            className="h-20 w-20 rounded-xl object-cover bg-gray-100"
          />
          {order.quantity > 1 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {order.quantity}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {order.product}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">Qty: {order.quantity}</p>
          <p className="text-base font-semibold text-gray-900 mt-1">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Tracking row */}
      <div className="px-5 pb-5">
        {isPlaced ? (
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="flex-shrink-0"
            >
              <circle cx="8" cy="8" r="7" stroke="#3b82f6" strokeWidth="1.5" />
              <path
                d="M8 5v3.5l2 2"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-xs text-blue-600 font-medium">
              Your order has been placed. Tracking details will appear soon.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                Tracking ID
              </p>
              <p className="text-sm font-semibold text-gray-800 font-mono">
                {order.tracking_id}
              </p>
            </div>
            <a
              href={"https://shiprocket.co/tracking/" + order.tracking_id}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M7.5 3L11 6.5 7.5 10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Track Order
            </a>
          </div>
        )}
      </div>

      {/* Order ID footer */}
      <div className="px-5 pb-3">
        <p className="text-[11px] text-gray-300 font-mono">
          Order #{order._id.slice(-8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
