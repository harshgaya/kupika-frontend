export default function WhyChooseKupika() {
  return (
    <section className="bg-[#123F32] py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* HEADER */}
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Why Choose Kupika?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
          Rooted in tradition, backed by science, and trusted by thousands.
        </p>

        {/* STATS */}
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {/* ITEM 1 */}
          <div>
            <div className="text-4xl font-semibold text-[#E2B86C] sm:text-5xl">
              50k+
            </div>
            <p className="mt-2 text-sm text-white/90">Happy Customers</p>
          </div>

          {/* ITEM 2 */}
          <div>
            <div className="text-4xl font-semibold text-[#E2B86C] sm:text-5xl">
              100%
            </div>
            <p className="mt-2 text-sm text-white/90">Natural Ingredients</p>
          </div>

          {/* ITEM 3 */}
          <div>
            <div className="text-4xl font-semibold text-[#E2B86C] sm:text-5xl">
              4.8
            </div>
            <p className="mt-2 text-sm text-white/90">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
