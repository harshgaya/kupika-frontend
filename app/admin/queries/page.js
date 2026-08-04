"use client";
import DataPage from "@/src/components/admin/DataPage";
export default function Page() {
  async function resolve(r, reload) {
    if (!window.confirm("Mark this customer query as resolved?")) return;
    const res = await fetch("/api/admin/queries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r._id, status: "resolved" }),
    });
    if (res.ok) {
      reload();
      window.dispatchEvent(new Event("admin-query-count-changed"));
    }
  }
  return (
    <DataPage
      title="Customer Queries"
      subtitle="AI-escalated issues that need human attention. Resolving a query reduces the open-query highlight."
      endpoint="/api/admin/queries"
      statuses={["open", "in_progress", "resolved"]}
      columns={[
        { key: "customerName", label: "Customer" },
        { key: "mobileNumber", label: "Mobile" },
        { key: "type", label: "Type" },
        { key: "subject", label: "Subject" },
        { key: "priority", label: "Priority", badge: true },
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
      renderActions={(r, reload) =>
        r.status !== "resolved" ? (
          <button className="admin-btn" onClick={() => resolve(r, reload)}>
            Resolve
          </button>
        ) : (
          <span className="resolved-label">Resolved</span>
        )
      }
    />
  );
}
