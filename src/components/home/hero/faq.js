"use client";

import { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      question: "How should I take Kaam Creator Capsules?",
      answer:
        "Take 1–2 capsules daily with warm water or milk, preferably after meals or as directed by a healthcare professional. Regular use is recommended for best results.",
    },
    {
      question: "What are the main benefits of Kaam Creator Capsules?",
      answer:
        "Kaam Creator Capsules help boost energy, improve stamina, enhance physical and mental performance, and reduce fatigue using a 100% Ayurvedic formulation.",
    },
    {
      question: "Is this supplement suitable for daily use?",
      answer:
        "Yes, the capsules are made from natural Ayurvedic ingredients and are suitable for daily use when taken in the recommended dosage.",
    },
    {
      question: "Are there any side effects?",
      answer:
        "Kaam Creator Capsules are generally safe and free from harmful chemicals. However, individuals with medical conditions or those on medication should consult a doctor before use.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Results may vary from person to person, but noticeable improvements in energy and stamina are commonly experienced within a few weeks of consistent use.",
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
