
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const requiredEnv = ['STRIPE_SECRET', 'SUCCESS_URL', 'CANCEL_URL'];
requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing ${name} environment variable`);
    process.exit(1);
  }
});

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res, next) => {
  const { priceId } = req.body;

  if (typeof priceId !== 'string' || priceId.trim() === '') {
    return res.status(400).json({ error: 'priceId is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
