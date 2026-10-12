const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({ status: "online", message: "API is running" });
});

app.get("/discord-updates", async (req, res) => {
  try {
    const r = await fetch("https://discord.com/blog");
    if (!r.ok) throw new Error("Discord returned " + r.status);

    const html = await r.text();
    const match = html.match(
      /https:\/\/discord\.com\/blog\/([a-zA-Z0-9-]+)/
    );

    if (!match) throw new Error("No blog post found");

    const slug = match[1];
    const title = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    res.json({
      status: "ok",
      title,
      link: "https://discord.com/blog/" + slug
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: e.message
    });
  }
});

app.listen(PORT, () => console.log("API running on " + PORT));
