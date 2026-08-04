# Kupika production app

## Important production setup

1. Copy environment variables into `.env.local` / your deployment environment.
2. Install and build: `npm install && npm run build`.
3. Kaam Creator is now ₹1,699 in application defaults. To update the existing MongoDB product (`697ee05898ccbd69e46c5f7b`) run once:
   `node --env-file=.env.local scripts/update-kaam-price.mjs`
4. `seed.mjs` was removed. It was only a development helper for inserting demo products and is not required for production.

## Customer identity

The normalized 10-digit Indian mobile number is the customer identity. OTP login, website orders, admin/WhatsApp orders and AI orders all resolve or create the same user and attach `user_id` to the order. Order delivery addresses are also saved into the user's `addresses` collection.

## Checkout persistence

A checkout is inserted as soon as Buy Now starts. It is not deleted when a visitor leaves. After OTP/address entry, the active checkout is enriched with the user and address. Admin can later review and convert it.

## Payment recording

Admin-assisted orders support:
- Full COD (`cod`)
- ₹500 prepaid + remaining COD (`prepaid_500`)
- Full prepaid (`prepaid_full`)

The customer website keeps online prepaid choices disabled until a real payment gateway is connected. This prevents a customer from being marked paid without a verified payment transaction.

## Shipping

Shiprocket webhook: `POST /api/webhooks/shiprocket`. Configure `SHIPROCKET_WEBHOOK_KEY` and send the same value in `x-api-key` from the webhook configuration/proxy. The webhook matches AWB/tracking ID and updates shipping/order status.

India Post is intentionally manual in admin because this app does not have an authenticated official India Post tracking API integration. Admin can update the tracking ID and status from the Orders drawer.

## AI agent routes

Protected by `x-agent-api-key: AGENT_API_KEY`:
- `POST /api/agent/orders` — creates user + address + order through the shared order service.
- `POST /api/agent/order-status` — searches primarily by mobile, and also supports order `_id`, customer name or address.
- `POST /api/agent/queries` — creates an open customer query.
- `POST /api/agent/calls` — creates/updates AI call metadata.
- Plivo recording/hangup callbacks update `ai_calls` with recording URL, duration and telephony details.
