const axios = require("axios");

module.exports.config = {
  name: "pics",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Technical Solution",
  description: "Search aur send pics",
  commandCategory: "media",
  usages: "/pics <query>",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const query = args.join(" ");
  if (!query) return api.sendMessage("Bhai, koi search keyword likho.\nMisal: /pics boys dpz", event.threadID, event.messageID);

  const apiKey = "Skv9vbtjhGy5p9QQWvsweep"; // Apni API Key lagao
  const url = `https://api.serply.io/v1/search/images?q=${encodeURIComponent(query)}&num=20`;

  try {
    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey
      }
    });

    const images = res.data.images;
    if (!images || images.length === 0) {
      return api.sendMessage("Koi pics nahi mili bhai.", event.threadID, event.messageID);
    }

    const attachments = [];
    for (const img of images) {
      const imgRes = await axios.get(img.url, { responseType: "stream" });
      attachments.push(imgRes.data);
    }

    api.sendMessage({
      body: `Yeh lo bhai, ${images.length} pics mil gayi hain "${query}" ke liye.`,
      attachment: attachments
    }, event.threadID, event.messageID);
  } catch (e) {
    console.error(e);
    api.sendMessage("Error aa gaya bhai, thora baad try karna.", event.threadID, event.messageID);
  }
};
