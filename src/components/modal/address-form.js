"use client";
import { INDIAN_STATES } from "@/src/lib/utils/constants";
import { useState } from "react";
import AddressPopup from "../address/address-popup";

export default function AddressForm({
  handleSaveAddress,
  editingAddress,
  onClose,
}) {
  const [status, setStatus] = useState({ loading: false });
  const [showPopup, setShowPopup] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const phone = form.phone.value.trim();
    const pincode = form.pincode.value.trim();

    if (!/^\d{10}$/.test(phone)) {
      alert("📞 Phone number must be 10 digits.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("📮 Pincode must be 6 digits.");
      return;
    }

    const addressData = {
      name: form.name.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value,
      pincode,
      phone,
    };

    setStatus({ loading: true });

    await handleSaveAddress(addressData);

    setStatus({ loading: false });

    if (onClose) onClose();
  }

  return (
    <section className="w-full bg-white rounded-xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Enter your shipping address details below.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={editingAddress?.name || ""}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-gray-400"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              defaultValue={editingAddress?.address || ""}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-gray-400"
              placeholder="Flat / Street / Locality"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                defaultValue={editingAddress?.city || ""}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-gray-400"
                placeholder="City"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                required
                defaultValue={editingAddress?.state || ""}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-gray-400"
              >
                <option value="" disabled>
                  Select State
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                id="pincode"
                name="pincode"
                type="number"
                required
                defaultValue={editingAddress?.pincode || ""}
                onWheel={(e) => e.target.blur()}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-gray-400"
                placeholder="6-digit Pincode"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="number"
                required
                defaultValue={editingAddress?.phone || ""}
                onWheel={(e) => e.target.blur()}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-gray-400"
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("cancel clicked");
                window.dispatchEvent(new Event("showAddressPopup"));
                setShowPopup(true);
              }}
              className="inline-flex justify-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex justify-center rounded-full bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {status.loading
                ? "Saving..."
                : editingAddress
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      </div>
      <AddressPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </section>
  );
}
