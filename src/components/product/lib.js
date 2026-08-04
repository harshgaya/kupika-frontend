import {
  FALLBACK_REVIEWS,
  FALLBACK_FAQS,
  FALLBACK_FEATURES,
  FALLBACK_INGREDIENTS,
  FALLBACK_USAGE_STEPS,
  FALLBACK_INGREDIENT_TAGS,
  FALLBACK_TRUST_BADGES,
  DEFAULT_RATING_BREAKDOWN,
} from "./data";

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
// Every section reads from this single resolved object.
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

  return {
    ...product,
    discount,
    descriptionPoints,
    brandName: product.brand_name || product.title || "",
    badges: hasItems(product.badges)
      ? product.badges
      : ["Best Seller", "Ayurvedic"],
    rating: product.rating ?? 4.8,
    reviewCount: product.review_count ?? 164,
    unitsSold: product.units_sold || "64K+",
    supportEmail: product.support_email || "support@kupika.in",
    ratingBreakdown: product.rating_breakdown || DEFAULT_RATING_BREAKDOWN,
    reviews: hasItems(product.reviews) ? product.reviews : FALLBACK_REVIEWS,
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
    trustBadges: hasItems(product.trust_badges)
      ? product.trust_badges
      : FALLBACK_TRUST_BADGES,
  };
}
