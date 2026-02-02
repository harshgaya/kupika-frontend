import { use } from "react";

const API_URL = "https://kupika-api.softplix.com/api/";
export default API_URL;

export async function getProducts() {
  const res = await fetch(`${API_URL}get-homepage-products`, {
    cache: "no-store",
  });

  console.log("Fetched products:", res);

  if (!res.ok) {
    console.error(await res.text());
    return null;
  }

  return res.json();
}
export async function getProductBySlug(slug) {
  const res = await fetch(`${API_URL}product-slug`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data[0] || null;
}
export async function addGuestAddress(address) {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const res = await fetch(`${API_URL}/add-guest-address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: address.name,
      street_address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      guest_id: address.guest_id,
      user_id: userId || null,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Add address failed:", err);
    return null;
  }

  const json = await res.json();
  return json.data[0];
}
export async function getAddresses(data) {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const res = await fetch(`${API_URL}get-guest-address`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId || null,
      guest_id: data.guest_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Get guest addresses failed:", json);
    return [];
  }

  return json.data;
}
export async function selectGuestAddress({ address_id, guest_id }) {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  console.log("Selecting address:", { address_id, guest_id, userId });
  const res = await fetch(`${API_URL}update-guest-address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guest_id,
      address_id,
      user_id: userId || null,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Select address failed:", err);
    return null;
  }

  const json = await res.json();
  console.log("Selected address response:", json);
  return json;
}
export async function addToCheckout(item) {
  console.log("Adding to checkout:", item);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const payload = {
    quantity: Number(item.quantity),
    productId: item.productId,
    user_id: userId || null,
  };

  if (!userId) {
    payload.guest_id = item.guest_id;
  }

  const res = await fetch(`${API_URL}add-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  console.log("Add to checkout response:", res);

  if (!res.ok) {
    const err = await res.json();
    console.error("Add checkout failed:", err);
    return null;
  }
  console.log("Added to checkout successfully", res.data);

  const json = await res.json();
  return json.data;
}

export async function order() {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  if (!userId) {
    alert("Please log in to place the order.");
    return null;
  }

  const res = await fetch(`${API_URL}place-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    return null;
  }

  const json = await res.json();
  return json;
}
export async function getChechout(item) {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const payload = {
    user_id: userId || null,
  };

  if (!userId) {
    payload.guest_id = item.guest_id;
  }

  const res = await fetch(`${API_URL}get-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    return null;
  }

  const json = await res.json();
  console.log("Fetched checkout data:", json);
  return json.data;
}
export async function getOrders() {
  const userId = localStorage.getItem("user_id");

  console.log("Getting checkout for user ID:", userId);

  if (!userId) {
    return null;
  }

  const res = await fetch(`${API_URL}get-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    return null;
  }

  const json = await res.json();
  console.log("Fetched checkout data:", json);
  return json.data;
}
