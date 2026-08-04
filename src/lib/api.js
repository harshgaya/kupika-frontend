/**
 * Frontend API client.
 *
 * All calls now hit this app's own Next.js route handlers (/api/*) which
 * talk to MongoDB — no more direct calls to the external backend from the
 * browser. `credentials: "include"` sends the httpOnly session cookie so
 * the server knows who the logged-in user is; the guest_id (for anonymous
 * carts/addresses) still lives in localStorage.
 */

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok || (json && json.success === false)) {
    const message = json?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json?.data ?? null;
}

/** Guest id for anonymous carts/addresses. Created once per browser. */
export function getGuestId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }
  return id;
}

/* ---------------------------------------------------------------- auth --- */

export async function getSession() {
  return request("/api/auth/me");
}

export async function sendOtp(phone) {
  return request("/api/auth/send-otp", { method: "POST", body: { phone } });
}

export async function verifyOtp(phone, code) {
  return request("/api/auth/verify-otp", {
    method: "POST",
    body: { phone, code, guest_id: getGuestId() },
  });
}

export async function logout() {
  return request("/api/auth/logout", { method: "POST" });
}

/* ------------------------------------------------------------ products --- */

export async function getProducts() {
  return request("/api/products");
}

export async function getProductBySlug(slug) {
  try {
    return await request(`/api/products/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ address ---- */

export async function getAddresses() {
  const guestId = getGuestId();
  return request(`/api/address?guest_id=${encodeURIComponent(guestId ?? "")}`);
}

export async function addGuestAddress(address) {
  return request("/api/address", {
    method: "POST",
    body: {
      name: address.name,
      street_address: address.address ?? address.street_address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      guest_id: getGuestId(),
    },
  });
}

export async function updateAddress(address) {
  return request("/api/address", { method: "PATCH", body: { ...address, guest_id: getGuestId() } });
}

export async function deleteAddress(address_id) {
  return request("/api/address", { method: "DELETE", body: { address_id, guest_id: getGuestId() } });
}

export async function selectGuestAddress({ address_id }) {
  return request("/api/address/select", {
    method: "POST",
    body: { address_id, guest_id: getGuestId() },
  });
}

/* -------------------------------------------------------------- cart ----- */

export async function getCart() {
  const guestId = getGuestId();
  return request(`/api/cart?guest_id=${encodeURIComponent(guestId ?? "")}`);
}

export async function addToCart({ productId, quantity = 1, op = "add" }) {
  return request("/api/cart", {
    method: "POST",
    body: { productId, quantity, op, guest_id: getGuestId() },
  });
}

export async function setCartQuantity({ productId, quantity }) {
  return request("/api/cart", {
    method: "POST",
    body: { productId, quantity, op: "set", guest_id: getGuestId() },
  });
}

export async function removeFromCart({ productId }) {
  return request("/api/cart", {
    method: "POST",
    body: { productId, op: "remove", guest_id: getGuestId() },
  });
}

/* --- backwards-compatible aliases for existing components ---------------- */
export const addToCheckout = (item) =>
  addToCart({ productId: item.productId, quantity: item.quantity });
export const getChechout = async () => {
  const cart = await getCart();
  return cart?.items ?? [];
};


export async function createCheckout({ productId, quantity = 1 }) {
  return request("/api/checkouts", { method: "POST", body: { productId, quantity, guest_id: getGuestId() } });
}
export async function getCheckout(checkoutId) {
  return request(`/api/checkouts?id=${encodeURIComponent(checkoutId)}`);
}

/* ------------------------------------------------------------- orders ---- */

export async function order(payload = {}) {
  return request("/api/orders", { method: "POST", body: payload });
}

export async function getOrders() {
  return request("/api/orders");
}

/* ------------------------------------------------------------- track ----- */

/**
 * Fire-and-forget analytics event (e.g. { type: "website_visit" }).
 * Never throws — tracking must not break the UI.
 */
export function websiteTrack({ type }) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
