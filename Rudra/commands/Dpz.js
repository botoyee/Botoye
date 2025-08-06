const axios = require("axios");

module.exports = {
  config: {
    name: "dpz",
    version: "1.0",
    author: "ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Send random DP images",
    longDescription: "Get 20 random stylish DP images based on your search",
    category: "image",
    guide: {
      en: "{p}dpz [search term]\nExample: {p}dpz boys stylish dpz"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const query = args.join(" ") || "boys stylish dpz";
      const apiKey = "prince";
      const apiUrl = `https://api.princetechn.com/api/search/googleimage?apikey=${apiKey}&query=${encodeURIComponent(query)}`;

      const res = await axios.get(apiUrl);
      const images = res.data;

      if (!Array.isArray(images) || images.length === 0) {
        return api.sendMessage("😢 Sorry, no images found!", event.threadID, event.messageID);
      }

      // Random 20 images
      const shuffled = images.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 20);

      // Send images one by one
      for (let i = 0; i < selected.length; i++) {
        api.sendMessage({ attachment: await global.utils.getStreamFromURL(selected[i]) }, event.threadID);
      }

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching images. Try again later.", event.threadID, event.messageID);
    }
  }
};
