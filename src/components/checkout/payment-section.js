export default function PaymentSection() {
  return (
    <section className="rounded-xl bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Payment Method
      </h2>

      {/* UPI – Disabled */}
      <label className="mb-3 flex cursor-not-allowed items-center gap-3 rounded-lg border border-gray-200 p-4 opacity-50">
        <input
          type="radio"
          name="payment"
          disabled
          className="accent-primary"
        />
        <span className="text-gray-700">UPI (Coming Soon)</span>
      </label>

      {/* Card – Disabled */}
      <label className="mb-3 flex cursor-not-allowed items-center gap-3 rounded-lg border border-gray-200 p-4 opacity-50">
        <input
          type="radio"
          name="payment"
          disabled
          className="accent-primary"
        />
        <span className="text-gray-700">Card (Coming Soon)</span>
      </label>

      {/* COD – Enabled & Selected */}
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-green-500 bg-green-50 p-4">
        <input
          type="radio"
          name="payment"
          defaultChecked
          className="accent-primary"
        />
        <span className="font-medium text-gray-800">Cash on Delivery</span>
      </label>
    </section>
  );
}
