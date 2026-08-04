import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
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
              At Kupika Ayurveda, we value your trust. We are committed to
              protecting your personal data and ensuring transparency in how we
              handle your information. We never sell your personal data to third
              parties.
            </p>
          </div>

          {/* SECTIONS */}
          <div className="space-y-8 text-sm leading-relaxed text-gray-700">
            {/* 1 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                1. Introduction
              </h2>
              <p className="mt-2">
                Welcome to Kupika Ayurveda. This Privacy Policy outlines how we
                collect, use, disclose, and safeguard your information when you
                visit our website or purchase our products.
              </p>
              <p className="mt-2">
                We are dedicated to respecting your privacy and protecting your
                personal information in accordance with applicable data
                protection laws in India.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                2. Information We Collect
              </h2>
              <p className="mt-2">
                We may collect information about you in a variety of ways,
                including:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Personal Data:</strong> Name, shipping address, email
                  address, and phone number.
                </li>
                <li>
                  <strong>Derivative Data:</strong> IP address, browser type,
                  operating system, access times, and pages viewed.
                </li>
                <li>
                  <strong>Financial Data:</strong> Payment method details during
                  purchases (processed securely via payment providers).
                </li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                3. How We Use Your Information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Create and manage your account.</li>
                <li>Process orders and deliver products.</li>
                <li>Email you regarding order status or updates.</li>
                <li>Send newsletters (you may opt-out anytime).</li>
                <li>Request feedback and improve our services.</li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                4. Cookies & Tracking Technologies
              </h2>
              <p className="mt-2">
                We use cookies and similar technologies to improve your
                experience. Most browsers accept cookies by default, but you may
                remove or reject them.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                5. Data Security
              </h2>
              <p className="mt-2">
                We use administrative, technical, and physical security measures
                to protect your personal information. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                6. Third-Party Services
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Service Providers:</strong> Payment processing,
                  analytics, delivery, and customer support.
                </li>
                <li>
                  <strong>Legal Obligations:</strong> If required by law or to
                  protect rights and safety.
                </li>
              </ul>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                7. User Rights
              </h2>
              <p className="mt-2">
                You have the right to access, correct, or request deletion of
                your personal data, subject to applicable laws.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-base font-semibold text-secondary">
                8. Changes to This Policy
              </h2>
              <p className="mt-2">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated date.
              </p>
            </div>
          </div>
        </div>

        {/* FOOT NOTE */}
        <p className="mt-8 text-center text-sm text-white/60">
          If you have questions about this Privacy Policy, contact us at{" "}
          <span className="text-white">privacy@kupika.com</span>
        </p>
      </div>
    </section>
  );
}
