export function productView(p) {
  if (!p) return null;
  const price = Number(p.selling_price ?? p.price);
  return {
    _id: p._id,
    slug: p.slug,
    name: p.title ?? p.name ?? p.product ?? "Product",
    price: Number.isFinite(price) ? price : null,
    marketPrice: Number(p.market_price ?? p.marketPrice ?? 0),
    image: p.cover_image ?? p.thumbnail ?? p.image ?? p.gallery_images?.[0] ?? p.images?.[0] ?? "",
    inStock: p.in_stock ?? p.inStock ?? p.isActive ?? true,
    stockQuantity: Number(p.stock_quantity ?? p.stock ?? 0),
  };
}
export function requireProductPrice(p) {
  const v = productView(p);
  if (!v || !Number.isFinite(v.price) || v.price <= 0) throw new Error("PRODUCT_PRICE_UNAVAILABLE");
  return v;
}
