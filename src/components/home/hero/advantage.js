import Image from "next/image";

export default function AyurvedicAdvantage() {
  const advantages = [
    {
      title: "Natural Formulation",
      desc: "Made with pure herbs, roots, and extracts. No synthetic fillers.",
      icon: "/home/advantage/natural.png",
    },
    {
      title: "Daily Wellness",
      desc: "Supports long-term health and vitality without dependency.",
      icon: "/home/advantage/daily.png",
    },
    {
      title: "Chemical Free",
      desc: "Free from parabens, sulfates, and harmful additives.",
      icon: "/home/advantage/chemical.png",
    },
    {
      title: "Made in India",
      desc: "Sourced locally and manufactured in GMP certified facilities.",
      icon: "/home/advantage/location.png",
    },
  ];

  return (
    <section id="benefits" className="bg-[#F2EFE9] py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-secondary sm:text-4xl">
            The Ayurvedic Advantage
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Why modern men are switching to Kupika for their daily wellness.
          </p>
        </div>

        {/* ADVANTAGES GRID */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              {/* ICON */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              {/* TITLE */}
              <h3 className="mt-6 text-base font-semibold text-gray-800">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
