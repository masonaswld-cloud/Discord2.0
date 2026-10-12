
const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Discord Blog API is running"
  });
});

app.get("/discord-updates", async (req, res) => {
  try {
    const response = await fetch("https://discord.com/blog");
    if (!response.ok) {
      throw new Error("Discord blog request failed");
    }

    const html = await response.text();

    const matches = [
      ...html.matchAll(
        /<a[^>]+href="(\/blog\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
      )
    ];

    const seen = new Set();
    const items = [];

    for (const match of matches) {
      const link = "https://discord.com" + match[1];
      const title = match[2].replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();

      if (title && !seen.has(link)) {
        seen.add(link);
        items.push({ title, link });
      }
    }

    if (!items.length) {
      throw new Error("No blog posts found");
    }

    res.json({
      status: "ok",
      count: items.length,
      title: items[0].title,
      link: items[0].link,
      items
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Discord Blog API running on port ${PORT}`);
});
