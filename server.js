
const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "Discord Updates API"
  });
});

app.get("/discord-updates", async (req, res) => {
  try {
    const response = await fetch("https://discord.com/blog", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`Discord returned HTTP ${response.status}`);
    }

    const html = await response.text();

    const links = [
      ...html.matchAll(
        /https:\/\/discord\.com\/blog\/([a-zA-Z0-9-]+)/g
      )
    ];

    const slug = links
      .map(match => match[1])
      .find(value =>
        !["category", "tag", "author"].includes(value)
      );

    if (!slug) {
      return res.status(200).json({
        status: "error",
        title: "Discord Blog",
        link: "https://discord.com/blog",
        message: "No blog post link found"
      });
    }

    const title = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());

    return res.status(200).json({
      status: "ok",
      title,
      link: `https://discord.com/blog/${slug}`,
      message: "New Discord blog post released!"
    });

  } catch (error) {
    return res.status(200).json({
      status: "error",
      title: "Discord Blog",
      link: "https://discord.com/blog",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Discord Updates API running on port ${PORT}`);
});
