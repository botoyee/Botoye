const axios = require("axios");

module.exports.config = {
  name: "ddvideo",
  version: "1.0",
  hasPermssion: 0,
  credits: "Technical Solution",
  description: "Search videos from Pixabay (multiple results)",
  commandCategory: "media",
  usages: "/ddvideo <search term>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ");
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!input) return api.sendMessage("🎬 *Video dhoondhne ke liye kuch likho!*\nMisal: /ddvideo rain", threadID, messageID);

  const apiKey = "51609285-e2658ec185028d1e56777bd26";

  try {
    const res = await axios.get(`https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(input)}&per_page=3`);
    const results = res.data.hits;

    if (!results.length) return api.sendMessage("❌ Koi video nahi mili!", threadID, messageID);

    for (const vid of results) {
      const msg = `📽️ *Video:*\n\n🔍 Tags: ${vid.tags}\n⏱️ Duration: ${vid.duration} sec\n📥 Video: ${vid.videos.medium.url}\n👤 User: ${vid.user}`;
      await api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(vid.videos.medium.thumbnail)
      }, threadID);
    }

  } catch (e) {
    console.log(e);
    return api.sendMessage("⚠️ Error: Video hasil karne mein masla hua!", threadID, messageID);
  }
};
