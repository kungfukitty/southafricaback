import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';
import Stripe from 'stripe';

// --- Initialization ---
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Enable CORS to allow requests from your frontend
app.use(cors());
// Enable the server to read JSON from request bodies
app.use(express.json());

// --- API Endpoints ---

// Endpoint 1: RSS Feed for Events
app.get('/api/events', async (req, res) => {
  // IMPORTANT: Replace with your actual RSS feed URL
  const RSS_FEED_URL = 'https://www.billboard.com/feed/c/music-news';
  const parser = new Parser();

  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const events = feed.items.map(item => ({
      title: item.title,
      date: new Date(item.isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      description: item.contentSnippet || 'No description available.',
      link: item.link
    }));
    res.json(events);
  } catch (error) {
    console.error('RSS Feed Error:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// Endpoint 2: Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://southafricafront.vercel.app/success',
      cancel_url: 'https://southafricafront.vercel.app/cancel',
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
