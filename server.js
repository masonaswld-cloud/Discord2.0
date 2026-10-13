const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Discord Updates API"
  });
});

app.get("/discord-updates", async (req, res) => {
  try {
    const response = await fetch("https://discord.com/blog", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      throw new Error("Discord blog returned HTTP " + response.status);
    }

    const html = await response.text();

    const matches = [
      ...html.matchAll(
        /https:\/\/discord\.com\/blog\/([a-zA-Z0-9-]+)/g
      )
    ];

    const slug = matches
      .map(match => match[1])
      .find(value =>
        value !== "category" &&
        value !== "tag" &&
        value !== "author"
      );

    if (!slug) {
      return res.status(200).json({
        status: "error",
        title: "No blog post found",
        link: "https://discord.com/blog"
      });
    }

    const title = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());

    res.json({
      status: "ok",
      title: title,
      link: "https://discord.com/blog/" + slug,
      message: "New Discord blog post released!"
    });
  } catch (error) {
    res.status(200).json({
      status: "error",
      title: "Discord Blog",
      link: "https://discord.com/blog",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("API running on port " + PORT);
});
