// ── Fallbacks (used only when a product has no value for the field) ───────────

export const FALLBACK_REVIEWS = [
  {
    name: "Rajesh K.",
    location: "Mumbai",
    rating: 5,
    date: "2 weeks ago",
    title: "Life changing product!",
    body: "Been using for 3 months and the difference is incredible. My stamina has improved significantly and I feel more energetic throughout the day.",
    verified: true,
    avatar: "R",
    avatarColor: "bg-emerald-600",
  },
  {
    name: "Amit S.",
    location: "Delhi",
    rating: 5,
    date: "1 month ago",
    title: "100% genuine Ayurvedic",
    body: "Tried many supplements before but this one is different. No side effects, purely natural and results are visible after consistent use.",
    verified: true,
    avatar: "A",
    avatarColor: "bg-amber-600",
  },
  {
    name: "Suresh M.",
    location: "Bangalore",
    rating: 4,
    date: "3 weeks ago",
    title: "Good results, takes time",
    body: "Takes about 6-8 weeks to show results but worth the patience. Quality packaging and fast delivery. Will definitely reorder.",
    verified: true,
    avatar: "S",
    avatarColor: "bg-blue-600",
  },
  {
    name: "Vikram T.",
    location: "Pune",
    rating: 5,
    date: "5 days ago",
    title: "Best purchase this year",
    body: "Doctor recommended this and I'm glad I tried it. Completely natural formula with no harsh chemicals. Feeling much better.",
    verified: true,
    avatar: "V",
    avatarColor: "bg-purple-600",
  },
];

export const FALLBACK_FAQS = [
  {
    q: "How long does it take to see results?",
    a: "Most customers notice improvements within 3-4 weeks of consistent daily use. For optimal results, we recommend continuing for at least 3 months.",
  },
  {
    q: "Are there any side effects?",
    a: "This product is made with 100% natural Ayurvedic ingredients and has no known side effects. However, consult your doctor if you have pre-existing conditions.",
  },
  {
    q: "Can I take it with other medications?",
    a: "We recommend consulting with your healthcare provider before combining with prescription medications. The formula is natural, but individual responses vary.",
  },
  {
    q: "What is the recommended dosage?",
    a: "Take 1 tablet daily, preferably before bedtime with warm milk or water. Do not exceed the recommended dose.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes! We offer a 7-day return policy. If you're not satisfied with the product for any reason, contact our support team for a full refund.",
  },
  {
    q: "Is this product vegetarian?",
    a: "Yes, this product is 100% vegetarian. It contains no animal-derived ingredients, steroids, or parabens.",
  },
];

export const FALLBACK_FEATURES = [
  {
    title: "Ayurvedic Formulation",
    desc: "Based on ancient texts, perfected for modern lifestyle.",
    icon: "/product-details/ayurvedic.png",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    title: "Natural Ingredients",
    desc: "100% pure herbal extracts with no fillers.",
    icon: "/product-details/natural.png",
    color: "bg-amber-50 border-amber-100",
  },
  {
    title: "Daily Wellness",
    desc: "Supports stamina with consistent usage.",
    icon: "/product-details/daily.png",
    color: "bg-sky-50 border-sky-100",
  },
  {
    title: "Safe & Certified",
    desc: "GMP certified & quality tested.",
    icon: "/product-details/safe.png",
    color: "bg-rose-50 border-rose-100",
  },
];

export const FALLBACK_INGREDIENTS = [
  {
    name: "Makar Dhwaj",
    desc: "Helps reduce weakness, fatigue, and lack of energy in the body.",
    img: "/home/ingredients/makar.jpeg",
  },
  {
    name: "Shilajit",
    desc: "Improves physical power and endurance. Reduces weakness, fatigue, and tiredness.",
    img: "/home/ingredients/shilajit.webp",
  },
  {
    name: "Abhrakh Bhasma",
    desc: "Strengthens Shukra Dhatu and supports fertility in both men and women.",
    img: "/home/ingredients/abhrak.webp",
  },
];

export const FALLBACK_USAGE_STEPS = [
  {
    num: 1,
    title: "Take 1 Tablet",
    desc: "Consume one tablet daily, preferably before bedtime.",
  },
  {
    num: 2,
    title: "With Warm Milk",
    desc: "For best results, take it with warm milk or water.",
  },
  {
    num: 3,
    title: "Be Consistent",
    desc: "Continue for at least 3 months to see optimal benefits.",
  },
];

export const FALLBACK_INGREDIENT_TAGS = [
  "No Steroids",
  "No Parabens",
  "Non-Addictive",
  "100% Vegetarian",
];

// ── Store-wide constants (same across all products, not stored per product) ──

// Bottom trust strip icons.
export const TRUST_BADGES = [
  { icon: "🇮🇳", label: "Made in India" },
  { icon: "🧪", label: "Lab Tested" },
  { icon: "💬", label: "24/7 Support" },
  { icon: "✅", label: "Quality Assured" },
];

// Hero trust pills (desktop).
export const HERO_TRUST_PILLS = [
  "🔒 Secure Payment",
  "🚚 Free Shipping",
  "↩ 7-Day Returns",
  "✅ GMP Certified",
];

// Support contact shown in the FAQ footer.
export const SUPPORT_EMAIL = "support@kupika.in";

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getGuestId = () => {
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }
  return id;
};

const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

// Merge a raw product with fallbacks and derive computed values.
// Every component reads from this single resolved object.
export function resolveProduct(product) {
  const discount = Math.round(
    ((product.market_price - product.selling_price) / product.market_price) *
      100,
  );

  const descriptionPoints = product.description
    ? product.description
        .split(/[.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10)
    : [];

  // Reviews come straight from the DB; fall back only when none exist.
  const reviews = hasItems(product.reviews)
    ? product.reviews
    : FALLBACK_REVIEWS;

  // Ratings are derived from the reviews array, not stored in the DB.
  const { rating, reviewCount, ratingBreakdown } = computeRatings(reviews);

  return {
    ...product,
    discount,
    descriptionPoints,
    badges: hasItems(product.badges)
      ? product.badges
      : ["Best Seller", "Ayurvedic"],
    reviews,
    rating,
    reviewCount,
    ratingBreakdown,
    faqs: hasItems(product.faqs) ? product.faqs : FALLBACK_FAQS,
    features: hasItems(product.features) ? product.features : FALLBACK_FEATURES,
    ingredients: hasItems(product.ingredients)
      ? product.ingredients
      : FALLBACK_INGREDIENTS,
    usageSteps: hasItems(product.usage_steps)
      ? product.usage_steps
      : FALLBACK_USAGE_STEPS,
    usageImage: product.usage_image || "/product-details/man.png",
    ingredientTags: hasItems(product.ingredient_tags)
      ? product.ingredient_tags
      : FALLBACK_INGREDIENT_TAGS,
  };
}

// Derive average rating, count, and the 5/4/3/2/1 percentage breakdown
// from the reviews array.
function computeRatings(reviews) {
  const reviewCount = reviews.length;
  if (reviewCount === 0) {
    return {
      rating: 0,
      reviewCount: 0,
      ratingBreakdown: { five: 0, four: 0, three: 0, two: 0, one: 0 },
    };
  }

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  for (const r of reviews) {
    const score = Math.min(5, Math.max(1, Math.round(r.rating || 0)));
    counts[score] += 1;
    sum += score;
  }

  const pct = (n) => Math.round((n / reviewCount) * 100);

  return {
    rating: Math.round((sum / reviewCount) * 10) / 10, // one decimal, e.g. 4.5
    reviewCount,
    ratingBreakdown: {
      five: pct(counts[5]),
      four: pct(counts[4]),
      three: pct(counts[3]),
      two: pct(counts[2]),
      one: pct(counts[1]),
    },
  };
}
