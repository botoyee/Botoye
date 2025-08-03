const axios = require('axios');

module.exports.config = {
  name: "ddmedia",
  version: "1.0",
  hasPermssion: 0,
  credits: "Technical Solution",
  description: "Search videos or pictures using Pixabay",
  commandCategory: "media",
  usages: "/ddvideo <keyword>\n/ddpic <keyword>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, body } = event;
  const input = args.join(" ");
  const command = event.body.split(" ")[0].toLowerCase();
  const apiKey = "51609285-e2658ec185028d1e56777bd26";

  if (!input) {
    return api.sendMessage("⛔ براہ کرم تلاش کرنے کے لیے کوئی لفظ لکھیں۔\nمثال: /ddvideo flowers یا /ddpic cat", threadID, messageID);
  }

  try {
    if (command === "/ddvideo") {
      const res = await axios.get(`https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(input)}&per_page=1`);
      const hits = res.data.hits;
      if (!hits.length) return api.sendMessage(`❌ کوئی ویڈیو نہیں ملی: "${input}"`, threadID, messageID);

      const vid = hits[0];
      const msg = `📽️ *Video Found:*\n\n📌 Tags: ${vid.tags}\n⏱️ Duration: ${vid.duration} sec\n📥 Download: ${vid.videos.medium.url}\n👤 User: ${vid.user}`;
      return api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(vid.videos.medium.thumbnail)
      }, threadID, messageID);
    }

    if (command === "/ddpic") {
      const res = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(input)}&per_page=1`);
      const hits = res.data.hits;
      if (!hits.length) return api.sendMessage(`❌ کوئی تصویر نہیں ملی: "${input}"`, threadID, messageID);

      const pic = hits[0];
      const msg = `🖼️ *Picture Found:*\n\n📌 Tags: ${pic.tags}\n👍 Likes: ${pic.likes}\n👤 User: ${pic.user}`;
      return api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(pic.webformatURL)
      }, threadID, messageID);
    }

    return api.sendMessage("❗ نامعلوم کمانڈ! صرف /ddvideo یا /ddpic استعمال کریں", threadID, messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ تلاش کرنے میں مسئلہ ہوا، دوبارہ کوشش کریں!", threadID, messageID);
  }
};
