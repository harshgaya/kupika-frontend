// components/Testimonials.jsx

import Image from "next/image";

const testimonials = [
  { id: 1, img: "/home/testimonials/testimonial-1.jpg" },
  { id: 2, img: "/home/testimonials/testimonial-2.jpg" },
  { id: 3, img: "/home/testimonials/testimonial-3.jpg" },
  { id: 4, img: "/home/testimonials/testimonial-4.jpg" },
];

export default function Testimonials() {
  return (
    <section className="bg-[#f5f7f6] py-12 px-4 md:px-10">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d2b] font-serif">
          Testimonials
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          BOLD MEN BOLD STORIES
        </p>
      </div>

      {/* Cards */}
      <div
        className="
        flex gap-4 overflow-x-auto pb-2
        md:grid md:grid-cols-4 md:gap-6 md:overflow-visible
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
      >
        {testimonials.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[140px] md:w-full">
            <TestimonialCard img={item.img} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ img }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm bg-white">
      {/* Smaller 9:16 Image */}
      <div className="relative w-full aspect-[9/16] ">
        <Image src={img} alt="testimonial" fill className="object-cover" />
      </div>
    </div>
  );
}
