
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_your_secret_key');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'zar',
        product_data: {
          name: 'Euphoria Event Ticket',
        },
        unit_amount: 50000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://yourdomain.com/success',
    cancel_url: 'https://yourdomain.com/cancel',
  });

  res.json({ id: session.id });
});

app.listen(3000, () => console.log('Server running on port 3000'));
