export default function AddressSection({
  addresses = [],
  selectedAddressId,
  setSelectedAddressId,
  onAddAddress,
}) {
  return (
    <section className="rounded-xl bg-white p-4 md:p-6">
      <h2 className="mb-4 text-base md:text-lg font-semibold text-gray-800">
        Delivery Address
      </h2>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">No address found</p>
          <button
            onClick={onAddAddress}
            className="text-sm font-medium text-primary"
          >
            + Add New Address
          </button>
        </div>
      ) : (
        <>
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => setSelectedAddressId(address._id)}
              className={`mb-4 cursor-pointer rounded-lg border p-4 transition ${
                selectedAddressId === address._id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={selectedAddressId === address._id}
                  readOnly
                  className="mt-1 accent-primary"
                />

                <div>
                  <p className="font-medium text-gray-800 text-sm md:text-base">
                    {address.name} · {address.phone}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-gray-600 leading-relaxed">
                    {address.street_address}, {address.city}, {address.state} –{" "}
                    {address.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={onAddAddress}
            className="mt-2 text-sm font-medium text-primary"
          >
            + Add New Address
          </button>
        </>
      )}
    </section>
  );
}
