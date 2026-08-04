// components/NightRulesSection.jsx

import Image from "next/image";

const cards = [
  { id: 1, img: "/home/your-night/your-night-1.jpg" },
  { id: 2, img: "/home/your-night/your-night-2.jpg" },
  { id: 3, img: "/home/your-night/your-night-3.jpg" },
];

export default function NightRulesSection() {
  return (
    <section className="bg-[#f5f7f6] py-12 px-4 md:px-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d2b] leading-tight font-serif">
          Your Night Your Rules
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          Feel stronger, last longer, and enjoy every moment.
        </p>
      </div>

      {/* Cards */}
      <div
        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
        snap-x snap-mandatory items-center md:justify-center"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="
              min-w-[220px] 
              md:min-w-[280px]
              flex-shrink-0 snap-start
            "
          >
            <Card img={card.img} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Card({ img }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white">
      <Image
        src={img}
        alt="banner"
        width={500}
        height={300}
        className="
          w-full
          h-[160px]          /* 👈 mobile height */
          md:h-[220px]       /* 👈 desktop height */
          object-contain     /* 👈 mobile: no crop */
          md:object-cover    /* 👈 desktop: normal look */
        "
      />
    </div>
  );
}
