import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <section className="bg-[#F8F6F2] py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* BACK LINK */}
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-white/60 hover:text-white"
        >
          ← Back to Home
        </Link>

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-secondary">
          Refund & Returns Policy
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Last updated: October 24, 2024
        </p>

        {/* CONTENT CARD */}
        <div className="mt-8 rounded-2xl bg-white p-6 sm:p-10">
          {/* AT A GLANCE */}
          <div className="mb-8 border-l-4 border-secondary bg-[#FBF7EE] p-4">
            <h3 className="text-sm font-semibold text-secondary">
              At a Glance
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              At Kupika Ayurveda, customer satisfaction is our priority. If you
              are not fully satisfied with your purchase, we offer a transparent
              and fair refund and returns process, subject to the terms below.
            </p>
          </div>

          {/* POLICY CONTENT */}
          <div className="space-y-8 text-sm leading-relaxed text-gray-700">
            {/* 1 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                1. Eligibility for Returns
              </h2>
              <p className="mt-2">
                Products are eligible for return only if they are damaged,
                defective, or incorrect at the time of delivery. Requests must
                be raised within <strong>7 days</strong> of receiving the order.
              </p>
              <p className="mt-2">
                To be eligible, items must be unused, unopened, and in their
                original packaging.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                2. Non-Returnable Items
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Opened or used products</li>
                <li>Products damaged due to misuse or negligence</li>
                <li>Items purchased during promotional sales</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                3. Refund Process
              </h2>
              <p className="mt-2">
                Once your return request is approved and the product is
                inspected, refunds will be processed within
                <strong> 5–7 business days</strong>.
              </p>
              <p className="mt-2">
                Refunds will be credited to the original payment method used at
                checkout.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                4. Replacement Policy
              </h2>
              <p className="mt-2">
                In case of damaged or incorrect products, we may offer a free
                replacement instead of a refund, depending on product
                availability.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                5. Shipping Costs
              </h2>
              <p className="mt-2">
                Shipping charges are non-refundable unless the return is due to
                an error on our part (damaged or incorrect item).
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                6. How to Request a Refund or Return
              </h2>
              <p className="mt-2">
                To initiate a return or refund request, please contact our
                support team with your order ID and relevant details.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                7. Changes to This Policy
              </h2>
              <p className="mt-2">
                We reserve the right to modify this Refund & Returns Policy at
                any time. Changes will be effective immediately upon posting on
                this page.
              </p>
            </div>
          </div>
        </div>

        {/* FOOT NOTE */}
        <p className="mt-8 text-center text-sm text-white/60">
          For refund-related queries, contact us at{" "}
          <span className="text-white">support@kupika.com</span>
        </p>
      </div>
    </section>
  );
}
