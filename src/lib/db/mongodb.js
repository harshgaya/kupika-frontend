import { MongoClient } from "mongodb";

/**
 * Central MongoDB connection using the native driver (no Mongoose).
 *
 * The database name is taken from the connection string itself
 * (e.g. mongodb+srv://user:pass@cluster/kupika?...), so we call
 * `client.db()` with no argument and the driver uses that DB.
 *
 * We cache a single MongoClient on the Node global so Next.js hot reloads
 * and serverless invocations reuse one connection pool instead of opening
 * a new one every request.
 */

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI. Copy .env.example to .env.local and fill it in " +
      "(include the database name in the URI).",
  );
}

let cached = global._mongo;
if (!cached) {
  cached = global._mongo = { client: null, promise: null };
}

export async function getDb() {
  if (cached.client) return cached.client.db();

  if (!cached.promise) {
    const client = new MongoClient(uri, { maxPoolSize: 10 });
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  try {
    await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.client.db();
}

/**
 * Convenience accessors so routes read like:
 *   const users = await collections.users();
 */
export const collections = {
  users: async () => (await getDb()).collection("users"),
  products: async () => (await getDb()).collection("products"),
  addresses: async () => (await getDb()).collection("addresses"),
  carts: async () => (await getDb()).collection("carts"),
  orders: async () => (await getDb()).collection("orders"),
  otpSessions: async () => (await getDb()).collection("otp_sessions"),
  checkouts: async () => (await getDb()).collection("checkouts"),
  aiCalls: async () => (await getDb()).collection("ai_calls"),
  customerQueries: async () => (await getDb()).collection("customer_queries"),
  events: async () => (await getDb()).collection("events"),
  websiteTrack: async () => (await getDb()).collection("website_track"),
};

export default getDb;
