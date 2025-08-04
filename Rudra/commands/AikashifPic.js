const axios = require("axios");
let krMode = {};

module.exports = {
  config: {
    name: "krpic",
    aliases: [],
    version: "1.0",
    author: "Kashif",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Kashif's AI picture generator"
    },
    longDescription: {
      en: "Activate Kashif's AI and generate images using 'Kr <prompt>'"
    },
    category: "ai",
    guide: {
      en: "{pn} mod on"
    }
  },

  onStart: async function ({ message, event, args }) {
    const uid = event.senderID;
    const command = args.join(" ").toLowerCase();

    if (command === "mod on") {
      krMode[uid] = true;
      message.reply("✅ *Kashif's AI Activated!* Now send a prompt like:\n➤ `Kr A beautiful girl`");
    } else {
      message.reply("❌ Usage: .krpic mod on");
    }
  },

  onChat: async function ({ event, message }) {
    const uid = event.senderID;
    const body = event.body;

    if (!krMode[uid]) return;

    if (body && body.toLowerCase().startsWith("kr")) {
      const prompt = body.slice(2).trim();
      if (!prompt) return message.reply("🔍 Prompt likho jaise: `Kr A girl smiling`");

      try {
        const res = await axios.get(`https://api.princetechn.com/api/ai/sd?apikey=prince&prompt=${encodeURIComponent(prompt)}`);
        const imgURL = res.data?.image;

        if (!imgURL) return message.reply("❌ Image generate nahi hui, try again.");

        message.send({
          body: "",
          attachment: await global.utils.getStreamFromURL(imgURL)
        });
      } catch (e) {
        message.reply("⚠️ Error: " + e.message);
      }
    }
  }
};
