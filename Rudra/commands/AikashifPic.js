const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "kashif",
    version: "1.0",
    author: "Kashif x Ayan",
    description: "Generate AI image using prompt",
    usage: "/kashif <prompt>",
    commandCategory: "ai",
    cooldowns: 3,
    hasPrefix: true,
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      return api.sendMessage("👋 Prompt likho jaise:\n/kashif a beautiful girl", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    const url = `https://api.princetechn.com/api/ai/sd?apikey=prince&prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'cache', `gen_${event.senderID}.jpg`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      api.sendMessage({
        body: `🧠 Prompt: ${prompt}\n📷 Here's your generated image`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("⚠️ Image generate nahi hui. Thora baad try karo.", event.threadID, event.messageID);
    }
  }
};
