// components/FAQ.jsx

"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    id: 1,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange. The item must be unused and in its original packaging.",
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer:
      "Shipping typically takes 3–7 business days depending on your location.",
  },
  {
    id: 3,
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. Delivery times may vary based on country.",
  },
  {
    id: 4,
    question: "How can I track my order?",
    answer:
      "You will receive a tracking link via email or SMS once your order is shipped.",
  },
  {
    id: 5,
    question: "Is the product warranty included?",
    answer:
      "Yes, all products come with a standard warranty. Terms vary by product.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(1); // first open by default

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-[#f5f7f6] py-14 px-4 md:px-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d2b] leading-tight font-serif">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          Find answers to common questions about our products, shipping, and
          return policies.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              {/* Question */}
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-gray-800">
                  {faq.question}
                </span>

                <FiChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`px-5 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-40 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
