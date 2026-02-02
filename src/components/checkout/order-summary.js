"use client";

import { getChechout } from "@/src/lib/api";
import { useEffect, useState } from "react";

export default function OrderSummary({ onPlaceOrder, placing }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const getGuestId = () => {
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guest_id", id);
    }
    return id;
  };

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        setLoading(true);

        const res = await getChechout({ guest_id: getGuestId() });
        console.log("Checkout response:", res[0]);

        setItem(res[0]);
      } catch (e) {
        console.error("Failed to fetch checkout", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, []);

  if (loading) {
    return (
      <aside className="sticky top-6 h-fit rounded-xl bg-white p-6">
        <p className="text-sm text-gray-500">Loading order summary...</p>
      </aside>
    );
  }

  if (!item) {
    return (
      <aside className="sticky top-6 h-fit rounded-xl bg-white p-6">
        <p className="text-sm text-gray-500">No items in checkout</p>
      </aside>
    );
  }

  const itemsTotal = item.price * item.quantity;
  const deliveryFee = 0;
  const total = itemsTotal + deliveryFee;

  return (
    <aside className="sticky top-6 h-fit rounded-xl bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Order Summary
      </h2>

      {/* Product */}
      <div className="mb-4 flex items-center gap-4">
        <img
          src={item.image}
          alt={item.product}
          className="h-14 w-14 rounded-md object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{item.product}</p>
          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
        </div>
        <p className="text-sm font-medium text-gray-800">₹{itemsTotal}</p>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Items Total</span>
          <span>₹{itemsTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-green-600 font-medium">FREE</span>
        </div>

        <div className="flex justify-between border-t pt-3 font-semibold text-gray-900">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={placing}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white
          ${
            placing
              ? "cursor-not-allowed bg-gray-400"
              : "bg-primary hover:opacity-90"
          }
        `}
      >
        {placing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </button>
    </aside>
  );
}
