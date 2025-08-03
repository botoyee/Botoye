const axios = require("axios");

module.exports = {
  config: {
    name: "ddvideo",
    version: "1.0",
    author: "Technical Solution",
    description: "Search and send videos using Pixabay",
    usage: "/ddvideo [search term]",
    commandCategory: "media",
    cooldowns: 3
  },

  onStart: async function ({ api, event, args }) {
    const search = args.join(" ");
    if (!search) return api.sendMessage("🔍 *Kya dhoondhna hai?* Example: /ddvideo flowers", event.threadID);

    const apiKey = "51609285-e2658ec185028d1e56777bd26";
    const url = `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(search)}&per_page=5`;

    try {
      const res = await axios.get(url);
      const results = res.data.hits;

      if (!results.length) return api.sendMessage("😔 *Kuch bhi nahi mila!* Dusra lafz try karo.", event.threadID);

      let msg = "🎥 *Videos Found:*\n\n";
      global.ddvideoData = {};

      results.forEach((video, index) => {
        msg += `#${index + 1}: ${video.tags}\n👀 Views: ${video.views}\n❤️ Likes: ${video.likes}\n\n`;
        global.ddvideoData[index + 1] = {
          url: video.videos.medium.url,
          title: video.tags,
          thumbnail: video.videos.medium.thumbnail
        };
      });

      msg += "📥 *Reply karo number pe jise bhejna hai.* (e.g., 1)";
      api.sendMessage(msg, event.threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "video_reply"
        });
      });
    } catch (e) {
      console.error(e);
      api.sendMessage("⚠️ *Kuch error aaya. Dobara try karo*", event.threadID);
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;

    const num = parseInt(event.body.trim());
    if (!global.ddvideoData || !global.ddvideoData[num])
      return api.sendMessage("❌ *Galat number hai. Reply sirf listed number pe karo.*", event.threadID);

    const selected = global.ddvideoData[num];

    const msgData = {
      body: `🎬 *${selected.title}*\n📽️ Here's your video:`,
      attachment: await global.utils.getStreamFromURL(selected.url)
    };

    return api.sendMessage(msgData, event.threadID);
  }
};
