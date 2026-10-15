
const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

const RSS_URL = "https://discord.com/blog/rss.xml";

function clean(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function getTag(xml, tag) {
  const match = xml.match(
    new RegExp(
      `<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,
      "i"
    )
  );

  return match ? clean(match[1]) : "";
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "Discord Updates API",
    endpoint: "/discord-updates"
  });
});

app.get("/discord-updates", async (req, res) => {
  try {
    const response = await fetch(RSS_URL, {
      headers: {
        "User-Agent": "DiscordUpdatesAPI/1.0"
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`Discord RSS returned HTTP ${response.status}`);
    }

    const xml = await response.text();
    const itemMatch = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/i);

    if (!itemMatch) {
      throw new Error("No blog posts found in the RSS feed");
    }

    const item = itemMatch[0];
    const title = getTag(item, "title");
    const link = getTag(item, "link");
    const pubDate = getTag(item, "pubDate");
    const description = getTag(item, "description");

    if (!title || !link) {
      throw new Error("The latest post is missing its title or link");
    }

    return res.status(200).json({
      status: "ok",
      title,
      link,
      pubDate,
      description,
      message: "New Discord blog post released!"
    });
  } catch (error) {
    console.error("Discord updates error:", error.message);

    return res.status(502).json({
      status: "error",
      message: "Could not retrieve the latest Discord blog post."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Discord Updates API running on port ${PORT}`);
});
