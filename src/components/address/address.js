"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddressItem from "./address-item";
import { useRouter } from "next/navigation";

import ModalHeadlessUi from "../modal/headless-ui-modal";
import AddressForm from "../modal/address-form";
import { addGuestAddress } from "@/src/lib/api";

const getGuestId = () => {
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }
  return id;
};

export default function AddressesPage({ addresses }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const router = useRouter();

  // ✅ SAVE ADDRESS
  const handleSaveAddress = async (newAddress) => {
    try {
      if (editingAddress) {
        // existing logic (unchanged)
        await updateAddress({
          update_type: "address",
          address_id: editingAddress.address_id,
          ...newAddress,
        });
      } else {
        // ✅ GUEST CREATE (FIXED)
        const guestId = getGuestId();

        await addGuestAddress({
          ...newAddress,
          guest_id: guestId,
        });
      }

      // router.refresh();

      setEditingAddress(null);
      setModalOpen(false);
    } catch (error) {
      console.error("❌ Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  // ✅ Edit
  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  // ✅ Delete (unchanged)
  const handleDelete = async (addr) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await updateAddress({
        update_type: "delete",
        address_id: addr.address_id,
      });

      router.refresh();
    }
  };

  // ✅ Select (unchanged)
  const handleSelect = async (addr) => {
    await updateAddress({
      update_type: "selection",
      address_id: addr.address_id,
    });
    Cookies.set("fromCheckoutAllowed", "true", { path: "/" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Addresses</h1>
        <button
          onClick={() => {
            setEditingAddress(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-5 h-5" /> Add New Address
        </button>
      </div>

      {/* Address List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressItem
              key={addr.address_id}
              address={addr}
              selected={addr.is_selected || false}
              onEdit={() => handleEdit(addr)}
              onDelete={() => handleDelete(addr)}
              onSelect={() => handleSelect(addr)}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center">No addresses found.</p>
        )}
      </div>

      {/* Modal */}
      <ModalHeadlessUi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <AddressForm
          onClose={() => setModalOpen(false)}
          handleSaveAddress={handleSaveAddress}
          editingAddress={editingAddress}
        />
      </ModalHeadlessUi>
    </main>
  );
}
