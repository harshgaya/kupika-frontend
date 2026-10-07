"use client";

import { useState } from "react";
import DataPage from "@/src/components/admin/DataPage";
import CheckoutConvertDrawer from "@/src/components/admin/CheckoutConvertDrawer";

export default function Page() {
  const [selected, setSelected] = useState(null);

  return (
    <DataPage
      title="Checkouts"
      subtitle="Every Buy Now checkout is saved. Convert assisted or abandoned checkouts after customer confirmation."
      endpoint="/api/admin/checkouts"
      statuses={["active", "converted", "abandoned"]}
      columns={[
        {
          key: "customerName",
          label: "Customer",
          render: (r) => r.customerName || "Guest",
        },

        { key: "phone", label: "Mobile" },

        { key: "productName", label: "Product" },

        {
          key: "total",
          label: "Amount",
          render: (r) =>
            `₹${new Intl.NumberFormat("en-IN").format(r.total || 0)}`,
        },

        { key: "source", label: "Type", badge: true },

        { key: "status", label: "Status", badge: true },

        {
          key: "created_at",
          label: "Time",
          render: (r) => {
            const date = r.created_at || r.createdAt;

            if (!date) return "—";

            return new Date(date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          },
        },
      ]}
      renderActions={(r, reload) => (
        <>
          {r.status !== "converted" ? (
            <button
              className="admin-btn"
              onClick={() =>
                setSelected({
                  ...r,
                  _reload: reload,
                })
              }
            >
              Review & convert
            </button>
          ) : (
            <span>Converted</span>
          )}

          {selected?._id === r._id && (
            <CheckoutConvertDrawer
              checkout={selected}
              onClose={() => setSelected(null)}
              onConverted={() => {
                reload();
                setSelected(null);
              }}
            />
          )}
        </>
      )}
    />
  );
}
