const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "masti",
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

    // Search for TikTok videos
    const res = await axios.get("https://api.princetechn.com/api/search/tiktoksearch", {
      params: {
        apikey: "prince",
        query: finalQuery
      },
      timeout: 10000 // Add timeout for API calls
    });

    const result = res.data.results;

    if (!result || !result.no_watermark) {
      console.log("❌ API returned no valid video:", res.data);
      return api.sendMessage("😕 No video found. Try a different keyword.", threadID, messageID);
    }

    // Download video using streaming
    const writer = fs.createWriteStream(`temp-${Date.now()}.mp4`);
    const response = await axios({
      method: 'GET',
      url: result.no_watermark,
      responseType: 'stream'
    });

    // Handle stream events
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      response.data.on('error', (err) => {
        console.error("❌ Error downloading video:", err.message);
        reject(err);
      });

      writer.on('finish', () => {
        resolve();
      });

      writer.on('close', () => {
        // Send the downloaded video
        api.sendMessage({
          body: `🎥 TikTok: ${result.title || "Untitled Video"}`,
          attachment: fs.readFileSync(writer.path)
        }, threadID, messageID).then(() => {
          // Clean up temporary file
          fs.unlinkSync(writer.path);
        });
      });
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    return api.sendMessage(
      err.code === 'ECONNABORTED' 
        ? "⚠️ Request timed out. Try again later."
        : "⚠️ Failed to process video. Try again later.",
      threadID, messageID
    );
  }
};
