"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);

    // Returned from Razorpay payment page -> verify
    if (q.get("razorpay_payment_id")) {
      setBusy(true);
      setMsg("Verifying payment…");
      fetch("/api/admin/billing/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(q.entries())),
      })
        .then(async (r) => {
          const j = await r.json();
          if (r.ok) window.location.href = "/admin";
          else {
            setMsg(j.message || "Payment verification failed.");
            setBusy(false);
            window.history.replaceState(null, "", "/admin/billing");
            loadStatus();
          }
        })
        .catch(() => {
          setMsg("Payment verification failed.");
          setBusy(false);
        });
      return;
    }
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadStatus() {
    fetch("/api/admin/billing", { cache: "no-store" })
      .then((r) => {
        if (r.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((j) => {
        if (!j) return;
        const d = j.data || j;
        if (d.paid) router.replace("/admin");
        else setInfo(d);
      })
      .catch(() => setMsg("Could not load billing status."));
  }

  async function pay() {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/billing/order", { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Could not create payment link.");
      window.location.href = (j.data || j).url; // go to Razorpay hosted page
    } catch (e) {
      setMsg(e.message);
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 28,
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,.3)",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Monthly bill due
        </h2>
        <p style={{ color: "#555", marginBottom: 20 }}>
          Admin panel is locked until this month&apos;s bill is paid.
        </p>
        <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 20 }}>
          {info ? `₹${info.amount}` : "…"}
        </div>
        <button
          onClick={pay}
          disabled={!info || busy}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            background: "#111827",
            color: "#fff",
            fontWeight: 600,
            opacity: !info || busy ? 0.6 : 1,
          }}
        >
          {busy ? "Please wait…" : "Pay with Razorpay"}
        </button>
        {msg && (
          <p
            style={{
              color: msg.startsWith("Verifying") ? "#555" : "#dc2626",
              marginTop: 12,
              fontSize: 14,
            }}
          >
            {msg}
          </p>
        )}
        <button
          onClick={logout}
          style={{
            marginTop: 14,
            fontSize: 13,
            color: "#666",
            textDecoration: "underline",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
