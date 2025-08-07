// This is your new backend server for Render.
import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';

// Initialize the Express app
const app = express();
// Render sets the PORT environment variable. For local dev, we'll use 3001.
const PORT = process.env.PORT || 3001; 

// This allows your frontend to make requests to this backend.
app.use(cors());

// Define the API endpoint for fetching events
app.get('/api/events', async (req, res) => {
  // --- IMPORTANT ---
  // Replace this placeholder URL with the actual URL of your RSS feed.
  const RSS_FEED_URL = 'https://www.billboard.com/feed/c/music-news';
  
  const parser = new Parser();

  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    
    // Transform the feed into the clean JSON your frontend needs
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
    
    // Send the successful JSON response
    res.json(events);

  } catch (error) {
    console.error('Failed to fetch or parse RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
