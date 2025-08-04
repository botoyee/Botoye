const axios = require("axios");

module.exports.config = {
  name: "tokr",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Download TikTok video by search",
  commandCategory: "media",
  usages: "masti <search query>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ").trim();
  const { threadID, messageID } = event;

  if (!query) {
    return api.sendMessage("❌ Please provide a search term.\nExample: poetry or sad status", threadID, messageID);
  }

  try {
    const res = await axios.get("https://api.princetechn.com/api/search/tiktoksearch", {
      params: {
        apikey: "prince",
        query
      }
    });

    const result = res.data.results;
    if (!result || !result.no_watermark) {
      return api.sendMessage("😕 Couldn't find a valid video.", threadID, messageID);
    }

    const videoBuffer = await axios.get(result.no_watermark, {
      responseType: "arraybuffer"
    });

    return api.sendMessage({
      body: `🎬 TikTok Video: ${result.title || "Untitled"}`,
      attachment: Buffer.from(videoBuffer.data, "utf-8")
    }, threadID, messageID);

  } catch (err) {
    console.error("❌ Error:", err.message);
    return api.sendMessage("⚠️ Failed to fetch TikTok video.", threadID, messageID);
  }
};
