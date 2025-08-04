const axios = require("axios");

module.exports.config = {
  name: "waifu",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Ayan Ali",
  description: "Send a random anime waifu image",
  commandCategory: "anime",
  usages: "waifu",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    const res = await axios.get("https://api.princetechn.com/api/anime/waifu?apikey=prince");
    const imageUrl = res.data.url;

    const imageStream = (await axios.get(imageUrl, { responseType: "stream" })).data;

    return api.sendMessage({
      body: "✨ Here's your waifu!",
      attachment: imageStream
    }, threadID, messageID);

  } catch (error) {
    console.error("❌ API error:", error.message);
    return api.sendMessage("⚠️ Failed to fetch waifu. Try again later.", threadID, messageID);
  }
};
