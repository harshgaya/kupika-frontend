"use client";

import { getOrders } from "@/src/lib/api";
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
    return <p className="p-6 text-gray-500">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="p-6 text-gray-500">No orders found</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
function OrderCard({ order }) {
  const total = order.price * order.quantity;
  const placedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-800">
            Order #{order._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">Placed on {placedDate}</p>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          ✓ {order.order_status}
        </span>
      </div>

      {/* Product */}
      <div className="mt-6 flex items-center gap-4">
        <img
          src={order.image}
          alt={order.product}
          className="h-16 w-16 rounded-md object-cover bg-gray-100"
        />

        <div className="flex-1">
          <p className="font-medium text-gray-800">{order.product}</p>
          <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900">₹{total}</p>

        {/* <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            ⬇ Invoice
          </button>

          <button className="rounded-lg border px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition">
            Reorder
          </button>
        </div> */}
      </div>
    </div>
  );
}
