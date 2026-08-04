import Image from "next/image";

export default function CustomerStories() {
  const reviews = [
    {
      name: "Aditya R.",
      text: "I've been using the Kaam Creator tablets for a month now. My energy levels throughout the day have significantly improved. Highly recommend.",
      rating: 5,
      avatar: "/customers/aditya.jpg",
    },
    {
      name: "Karan M.",
      text: "I’ve been taking Kaam Creator tablets for about a month now, and I can genuinely feel the difference. My daily energy levels are much better, and I don’t feel as tired as before. Overall, a good experience.",
      rating: 5,
      avatar: "/customers/karan.jpg",
    },
    {
      name: "Suresh P.",
      text: "Great packaging and delivery was discreet. The products feel very premium and authentic compared to other brands I've tried.",
      rating: 4,
      avatar: "/customers/suresh.jpg",
    },
  ];

  return (
    <section id="reviews" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-secondary sm:text-4xl">
            Customer Stories
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Real feedback from people who have experienced the Kupika
            difference.
          </p>
        </div>

        {/* REVIEWS */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              {/* STARS */}
              <div className="mb-4 text-[#E2B86C]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-lg">
                    {i < review.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>

              {/* TEXT */}
              <p className="flex-1 text-sm leading-relaxed text-gray-700">
                “{review.text}”
              </p>

              {/* USER */}
              <div className="mt-6 flex items-center gap-3">
                {/* <Image
                  src={review.avatar}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                /> */}
                <div>
                  <div className="text-sm font-semibold text-secondary">
                    {review.name}
                  </div>
                  <div className="text-xs text-gray-500">Verified Buyer</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
