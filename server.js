const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({ status: "online" });
});

app.get("/discord-updates", async (req, res) => {
  try {
    const r = await fetch("https://discord.com/blog");
    const html = await r.text();

    const match = html.match(
      /https:\/\/discord\.com\/blog\/([a-zA-Z0-9-]+)/
    );

    if (!match) {
      return res.status(500).json({
        status: "error",
        message: "No blog post found"
      });
    }

    const slug = match[1];

    res.json({
      status: "ok",
      title: slug.replace(/-/g, " "),
      link: "https://discord.com/blog/" + slug
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("API running on port " + PORT);
});
