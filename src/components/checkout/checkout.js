"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AddressSection from "./address-section";
import PaymentSection from "./payment-section";
import OrderSummary from "./order-summary";

import ModalHeadlessUi from "../modal/headless-ui-modal";
import AddressForm from "../modal/address-form";
import GoogleLoginModal from "../auth/google-login";

import {
  getAddresses,
  addGuestAddress,
  selectGuestAddress,
  order,
} from "@/src/lib/api";

const getGuestId = () => {
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }
  return id;
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const step = searchParams.get("step") || "address";

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("user_id");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function loadAddresses() {
      const data = await getAddresses({ guest_id: getGuestId() });

      const selected =
        data.find((a) => a.is_selected)?._id || data[0]?._id || null;

      setAddresses(
        data.map((a) => ({
          ...a,
          is_selected: a._id === selected,
        })),
      );

      setSelectedAddressId(selected);
    }

    loadAddresses();
  }, []);

  const goToStep = (nextStep) => {
    router.push(`/checkout?step=${nextStep}`);
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert("Please select an address to continue");
      return;
    }

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    goToStep("payment");
  };

  const handleGoogleSuccess = async ({ email, name }) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          guest_id: getGuestId(),
        }),
      });

      const data = await res.json();
      console.log("Google login response:", data);

      if (!res.ok) {
        alert(data.error || "Google login failed");
        return;
      }
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("jwt", data.jwt);
      localStorage.removeItem("guest_id");
      setShowLoginModal(false);
      goToStep("payment");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Login failed. Please try again.");
    }
  };
  const placeOrder = async () => {
    try {
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }
      setLoading(true);
      const data = await order();
      console.log("Order placed:", data);
      window.location.replace(`/order-success?order_id=${data.order_id}`);
    } catch (e) {
      console.log("Order placement error:", e);
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  const handleSelectAddress = async (id) => {
    try {
      await selectGuestAddress({
        address_id: id,
        guest_id: getGuestId(),
      });

      setSelectedAddressId(id);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          is_selected: addr._id === id,
        })),
      );
    } catch (err) {
      console.error("Failed to select address", err);
      alert("Failed to select address");
    }
  };

  const handleSaveAddress = async (newAddress) => {
    try {
      const saved = await addGuestAddress({
        ...newAddress,
        guest_id: getGuestId(),
      });
      console.log("Saved address:", saved);

      setAddresses((prev) => [
        ...prev.map((a) => ({ ...a, is_selected: false })),
        { ...saved, is_selected: true },
      ]);

      setSelectedAddressId(saved._id);
      setShowAddressModal(false);
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Failed to save address");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        {isMobile ? (
          <>
            {step === "address" && (
              <>
                <AddressSection
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={handleSelectAddress}
                  onAddAddress={() => setShowAddressModal(true)}
                />
                <BottomBar label="Continue" onClick={handleContinue} />
              </>
            )}

            {step === "payment" && (
              <>
                <PaymentSection />
                <BottomBar
                  loading={loading}
                  onClick={placeOrder}
                  label="Place Order"
                />
              </>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <AddressSection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={handleSelectAddress}
                onAddAddress={() => setShowAddressModal(true)}
              />
              <PaymentSection />
            </div>

            <OrderSummary onPlaceOrder={placeOrder} placing={loading} />
          </div>
        )}
      </div>

      <GoogleLoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleGoogleSuccess}
      />

      <ModalHeadlessUi
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Add New Address"
      >
        <AddressForm
          onClose={() => setShowAddressModal(false)}
          handleSaveAddress={handleSaveAddress}
        />
      </ModalHeadlessUi>
    </main>
  );
}

function BottomBar({ label, onClick, loading }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white p-4 shadow-md">
      <button
        onClick={onClick}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white
          ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-primary hover:opacity-90"
          }
        `}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
