"use client";

import { MapPin, Edit, Trash2 } from "lucide-react";

export default function AddressItem({
  address,
  onEdit,
  onDelete,
  selected,
  onSelect,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="flex items-start gap-3">
        {/* Radio Button */}
        <input
          type="radio"
          name="selectedAddress"
          checked={selected}
          onChange={() => onSelect(address)}
          className="mt-2 w-4 h-4 text-green-500"
        />

        <MapPin className="w-6 h-6 text-green-500 mt-1" />

        <div>
          <p className="font-semibold text-gray-800">{address.name}</p>
          <p className="text-gray-600 text-sm">{address.address}</p>
          <p className="text-gray-600 text-sm">
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="text-gray-600 text-sm font-bold">{address.phone}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-2 sm:mt-0">
        <button
          onClick={onEdit}
          className="text-black flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-100 transition"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={onDelete}
          className=" text-black flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-100 transition"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}
