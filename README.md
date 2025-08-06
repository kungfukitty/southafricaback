# southafricaback

Backend service for the South Africa storefront. It exposes an endpoint to
create Stripe checkout sessions.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following variables:

   ```env
   STRIPE_SECRET=sk_test_your_key
   SUCCESS_URL=https://example.com/success
   CANCEL_URL=https://example.com/cancel
   PORT=3000 # optional
   ```

## Running

Start the server:

```bash
npm start
```

## API

### `POST /create-checkout-session`

Creates a Stripe checkout session for a given price ID.

**Request body**

```json
{
  "priceId": "price_123"
}
```

**Response**

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

## Environment Variables

- `STRIPE_SECRET` – Stripe secret key used to authenticate API requests.
- `SUCCESS_URL` – URL to redirect to after a successful payment.
- `CANCEL_URL` – URL to redirect to if the user cancels checkout.
- `PORT` – Port for the server to listen on (defaults to `3000`).

Ensure these are set in your deployment environment for production use.
