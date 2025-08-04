const axios = require("axios");

module.exports.config = {
  name: "tokr",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Search TikTok videos and download by number",
  commandCategory: "media",
  usages: "masti <search query>",
  cooldowns: 5,
  listenEvents: true
};

const cache = {};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ").trim();
  const { threadID, messageID, senderID } = event;

  if (!query) {
    return api.sendMessage("❌ Please provide a search term.\nExample: masti princetechnexus", threadID, messageID);
  }

  try {
    const res = await axios.get("https://api.princetechn.com/api/search/tiktoksearch", {
      params: {
        apikey: "prince",
        query
      }
    });

    const results = res.data.result.slice(0, 6); // Limit results to 6
    if (!results.length) {
      return api.sendMessage("😕 No TikTok videos found for that query.", threadID, messageID);
    }

    let msg = `🔍 Results for: "${query}"\n\n`;
    results.forEach((video, i) => {
      msg += `${i + 1}. ${video.title || "Untitled Video"}\n`;
    });
    msg += `\n🔢 Reply with a number (1-${results.length}) to download the video.`;

    // Save to cache
    cache[senderID] = results;

    return api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    console.error("❌ Search Error:", err.message);
    return api.sendMessage("⚠️ Failed to search videos. Try again later.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body || !cache[senderID]) return;

  const index = parseInt(body.trim());
  if (isNaN(index) || index < 1 || index > cache[senderID].length) return;

  const videoData = cache[senderID][index - 1];
  const videoUrl = videoData.url;

  try {
    const res = await axios.get("https://api.princetechn.com/api/download/tiktok", {
      params: {
        apikey: "prince",
        url: videoUrl
      }
    });

    const { video, title } = res.data.result;

    const videoStream = await axios.get(video, { responseType: "arraybuffer" });
    const buffer = Buffer.from(videoStream.data, "utf-8");

    api.sendMessage({
      body: `🎬 ${title || "TikTok Video"}`,
      attachment: buffer
    }, threadID, messageID);

    delete cache[senderID]; // clear cache after successful send

  } catch (err) {
    console.error("❌ Download Error:", err.message);
    return api.sendMessage("⚠️ Failed to download video.", threadID, messageID);
  }
};
