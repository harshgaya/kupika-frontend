// components/ShopByCategory.jsx

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

const categories = [
  {
    id: 1,
    title: "Best Sellers",
    img: "/home/best-seller/best_seller_1.png",
  },
  {
    id: 2,
    title: "Bold Supplements",
    img: "/home/best-seller/best_seller_2.png",
  },
  {
    id: 3,
    title: "Extend Range",
    img: "/home/best-seller/best_seller_3.png",
  },
  {
    id: 4,
    title: "100% Pure Shilajit",
    img: "/home/best-seller/best_seller_4.png",
  },
];

export default function ShopByCategory() {
  return (
    <section className="bg-[#f5f7f6] py-12 px-4 md:px-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d2b] leading-tight font-serif">
          Shop By Category
        </h2>
        <p className="text-gray-500 text-base md:text-lg">THE BOLD LINEUP</p>
      </div>

      {/* Cards */}
      <div
        className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]"
      >
        {categories.map((item) => (
          <div key={item.id} className="min-w-[220px] md:min-w-0 flex-shrink-0">
            <CategoryCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ title, img }) {
  return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
      {/* Image */}
      <Image
        src={img}
        alt={title}
        width={400}
        height={500}
        className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <h3 className="text-white text-lg font-serif md:text-xl font-semibold leading-tight">
          {title}
        </h3>

        <div className="w-9 h-9 rounded-full bg-white/90 font-serif flex items-center justify-center shadow">
          <FiArrowRight className="text-black text-lg" />
        </div>
      </div>
    </div>
  );
}
