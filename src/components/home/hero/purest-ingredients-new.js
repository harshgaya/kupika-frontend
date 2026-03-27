// components/PureIngredients.jsx

import Image from "next/image";

const items = [
  {
    id: 1,
    tag: "Pure Energy",
    title: "Ashwagandha",
    img: "/home/ing/ashwagandha.jpg",
  },
  {
    id: 2,
    tag: "Long Lasting",
    title: "Shilajit",
    img: "/home/ing/shilajit.jpg",
  },
  {
    id: 3,
    tag: "High Stamina",
    title: "Abhrakh Bhasma",
    img: "/home/ing/abhrakh.jpg",
  },
  {
    id: 4,
    tag: "Reduces weakness",
    title: "Makardhwaj",
    img: "/home/ing/makar.jpg",
  },
];

export default function PureIngredients() {
  return (
    <section className="bg-[#f5f7f6] py-12 px-4 md:px-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d2b] leading-tight font-serif">
          Purest Ingredients
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          WE SOURCE THE FINEST HERBS TO CREATE POTENT FORMULATIONS THAT WORK.
        </p>
      </div>

      {/* Cards */}
      <div
        className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]"
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-[220px] md:min-w-0 flex-shrink-0">
            <IngredientCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function IngredientCard({ tag, title, img }) {
  return (
    <div className="relative rounded-2xl overflow-hidden group">
      {/* Image */}
      <Image
        src={img}
        alt={title}
        width={400}
        height={500}
        className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-300"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white/80 text-sm">{tag}</p>
        <h3 className="text-white text-xl md:text-2xl font-serif font-semibold leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
}
