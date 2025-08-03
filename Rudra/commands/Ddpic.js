const axios = require("axios");

module.exports.config = {
  name: "ddpic",
  version: "2.0",
  hasPermssion: 0,
  credits: "Technical Solution",
  description: "Search and send 20 images from Pixabay",
  commandCategory: "media",
  usages: "/ddpic <search term>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ");
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!input) return api.sendMessage("📸 *Tasveer dhoondhne ke liye koi lafz likho!*\nMisal: /ddpic flowers", threadID, messageID);

  const apiKey = "51609285-e2658ec185028d1e56777bd26";

  try {
    const res = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(input)}&per_page=20`);
    const result = res.data.hits;

    if (!result.length) return api.sendMessage("❌ Koi tasveer nahi mili!", threadID, messageID);

    const attachments = await Promise.all(
      result.map(img => global.utils.getStreamFromURL(img.webformatURL))
    );

    let msg = `📸 *${input.toUpperCase()}* ke liye 20 tasveerain mil gayi hain:\n\n`;
    msg += result.map((img, i) =>
      `📍 *${i + 1}.* ${img.tags}\n👍 Likes: ${img.likes} | 👤 ${img.user}`
    ).join("\n\n");

    return api.sendMessage({
      body: msg,
      attachment: attachments
    }, threadID, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Error: Tasveer hasil karne mein masla hua!", threadID, messageID);
  }
};
