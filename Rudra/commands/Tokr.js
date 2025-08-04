const axios = require("axios");

module.exports.config = {
  name: "tokr",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Search and download random TikTok video",
  commandCategory: "media",
  usages: "masti <query>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ").trim();
  const { threadID, messageID } = event;

  if (!query) {
    return api.sendMessage("❌ Please provide a search term.\nExample: masti cat dance", threadID, messageID);
  }

  try {
    // Randomizer to fetch different results each time
    const random = Math.random().toString(36).substring(7);
    const finalQuery = `${query} ${random}`;

    const res = await axios.get("https://api.princetechn.com/api/search/tiktoksearch", {
      params: {
        apikey: "prince",
        query: finalQuery
      }
    });

    const result = res.data.results;

    if (!result || !result.no_watermark) {
      console.log("❌ API returned no valid video:", res.data);
      return api.sendMessage("😕 No video found. Try a different keyword.", threadID, messageID);
    }

    // Download video file (no watermark)
    const video = await axios.get(result.no_watermark, {
      responseType: "arraybuffer"
    });

    return api.sendMessage({
      body: `🎥 TikTok: ${result.title || "Untitled Video"}`,
      attachment: Buffer.from(video.data, "utf-8")
    }, threadID, messageID);

  } catch (err) {
    console.error("❌ Error fetching TikTok video:", err.message);
    return api.sendMessage("⚠️ Failed to search videos. Try again later.", threadID, messageID);
  }
};
