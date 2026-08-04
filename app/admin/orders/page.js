"use client";
import { useState } from "react";
import DataPage from "@/src/components/admin/DataPage";
import OrderCreateModal from "@/src/components/admin/OrderCreateModal";
import OrderEditDrawer from "@/src/components/admin/OrderEditDrawer";
export default function Page() {
  const [open, setOpen] = useState(false),
    [edit, setEdit] = useState(null);
  return (
    <>
      <DataPage
        title="Orders"
        subtitle="Website, checkout, WhatsApp, AI and manually created orders."
        endpoint="/api/admin/orders"
        statuses={[
          "placed",
          "confirmed",
          "shipped",
          "in_transit",
          "out_for_delivery",
          "delivered",
          "cancelled",
        ]}
        sources={["website", "checkout", "whatsapp", "ai", "admin"]}
        action={(reload) => (
          <button className="admin-btn" onClick={() => setOpen(true)}>
            + Create order
          </button>
        )}
        columns={[
          {
            key: "orderNumber",
            label: "Order",
            render: (r) => <strong>{r.orderNumber || "—"}</strong>,
          },
          { key: "customerName", label: "Customer" },
          { key: "mobileNumber", label: "Mobile" },
          {
            key: "fullAddress",
            label: "Full address",
            render: (r) => (
              <span
                title={r.fullAddress}
                style={{
                  display: "inline-block",
                  maxWidth: 300,
                  whiteSpace: "normal",
                  lineHeight: 1.4,
                }}
              >
                {r.fullAddress || "—"}
              </span>
            ),
          },
          {
            key: "total",
            label: "Amount",
            render: (r) =>
              `₹${new Intl.NumberFormat("en-IN").format(r.total || 0)}`,
          },
          { key: "source", label: "Source", badge: true },
          {
            key: "payment_plan",
            label: "Payment",
            render: (r) =>
              (
                r.payment_plan ||
                r.paymentPlan ||
                r.payment_mode ||
                "COD"
              ).replaceAll("_", " "),
          },
          {
            key: "shippingProvider",
            label: "Delivery",
          },

          {
            key: "tracking",
            label: "Tracking",
            render: (r) => {
              const provider = (
                r.shippingProvider ||
                r.shipping_provider ||
                ""
              ).toLowerCase();

              const tracking =
                r.trackingNumber || r.tracking_number || r.tracking_id || "";

              const shippingStatus =
                r.shippingStatusText ||
                r.shipping_status_text ||
                r.shippingStatus ||
                r.shipping_status ||
                "";

              if (!tracking) {
                return (
                  <span className="text-xs text-gray-500">No tracking</span>
                );
              }

              const trackingUrl =
                provider === "shiprocket"
                  ? `https://shiprocket.co/tracking/${encodeURIComponent(tracking)}`
                  : `https://shipprime.live/track-order?awb=${encodeURIComponent(tracking)}`;

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    alignItems: "flex-start",
                  }}
                >
                  {/* Current shipping status */}
                  {shippingStatus && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {String(shippingStatus).replaceAll("_", " ")}
                    </span>
                  )}

                  {/* AWB */}
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    AWB: {tracking}
                  </span>

                  {/* Tracking link */}
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn secondary"
                    style={{
                      padding: "5px 9px",
                      fontSize: 11,
                    }}
                  >
                    Track Order
                  </a>
                </div>
              );
            },
          },
          {
            key: "status",
            label: "Status",
            badge: true,
            tone: (r) =>
              r.status === "delivered"
                ? "success"
                : r.status === "cancelled"
                  ? "danger"
                  : "warning",
          },
        ]}
        renderActions={(r, reload) => (
          <>
            <button
              className="admin-btn secondary"
              onClick={() => setEdit({ ...r, _reload: reload })}
            >
              Edit
            </button>
            {edit?._id === r._id && (
              <OrderEditDrawer
                order={edit}
                onClose={() => setEdit(null)}
                onSaved={() => {
                  reload();
                  setEdit(null);
                }}
              />
            )}
          </>
        )}
      />
      <OrderCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => location.reload()}
      />
    </>
  );
}
