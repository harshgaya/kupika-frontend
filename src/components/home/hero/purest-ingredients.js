import Image from "next/image";

export default function PurestIngredients() {
  const ingredients = [
    {
      name: "Makar Dhwaj",
      desc: "Helps reduce weakness, fatigue, and lack of energy in the body.",
      image: "/home/ingredients/makar.jpeg",
    },
    {
      name: "Shilajit",
      desc: "Helps improve physical power and endurance,Reduces weakness, fatigue, and tiredness",
      image: "/home/ingredients/shilajit.webp",
    },
    {
      name: "Abhrakh Bhasms",
      desc: "Strengthens Shukra Dhatu and supports fertility in both men and women",
      image: "/home/ingredients/abhrak.webp",
    },
  ];

  return (
    <section id="ingredients" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-secondary sm:text-4xl">
            Purest Ingredients
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            We source the finest herbs to create potent formulations that work.
          </p>
        </div>

        {/* INGREDIENTS GRID */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((item) => (
            <div key={item.name} className="text-left">
              {/* IMAGE */}
              <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* TEXT */}
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {item.name}
              </h3>
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
