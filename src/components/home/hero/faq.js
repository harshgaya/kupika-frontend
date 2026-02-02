"use client";

import { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I use the Horse Fire Tablets?",
      answer:
        "Take 1–2 tablets daily with warm milk or water, preferably before bedtime. Consistent use for 3 months is recommended for best results.",
    },
    {
      question: "Is the Herbal Hair Oil suitable for all hair types?",
      answer:
        "Yes, the Herbal Hair Oil is suitable for all hair types and is formulated to nourish the scalp without causing irritation.",
    },
    {
      question: "Are there any side effects?",
      answer:
        "Our products are made with natural ingredients and are generally safe. However, if you have a medical condition, consult your physician before use.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery typically takes 3–5 business days depending on your location.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#F7F3ED] py-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* HEADER */}
        <h2 className="text-center text-3xl font-semibold text-secondary sm:text-4xl">
          Frequently Asked Questions
        </h2>

        {/* FAQ LIST */}
        <div className="mt-12 divide-y divide-black/10">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className="cursor-pointer py-6"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {/* QUESTION ROW */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-secondary sm:text-lg">
                    {item.question}
                  </h3>
                  <span className="text-2xl font-light text-secondary">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>

                {/* ANSWER */}
                {isOpen && (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
