const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gazal",
    version: "1.1",
    author: "Kashif Raza",
    description: "Azadi Ghazal for Pakistan 🇵🇰",
    usePrefix: false,
    triggerEmoji: "🇵🇰"
  },

  handleEvent: async function ({ event, api }) {
    const content = event.body;
    if (content !== "🇵🇰") return;

    const audio = fs.createReadStream(path.join(__dirname, "./noprefix/baja.mp3"));
    const gazal = `🇵🇰 *𝐀𝐳𝐚𝐝𝐢 𝐌𝐮𝐛𝐚𝐫𝐚𝐤 𝐇𝐨! 𝐏𝐚𝐤𝐢𝐬𝐭𝐚𝐧 𝐙𝐢𝐧𝐝𝐚𝐛𝐚𝐝!* 🇵🇰

*✨ 𝘼𝙖𝙨𝙢𝙖𝙖𝙣 𝙗𝙝𝙞 𝙜𝙪𝙣𝙜𝙪𝙣𝙖 𝙧𝙖𝙝𝙖 𝙝𝙖𝙞...💚*
*𝙅𝙗 𝙖𝙖𝙗𝙖𝙙 𝙝𝙤𝙖 𝙮𝙚 𝙥𝙖𝙖𝙠 𝙘𝙝𝙖𝙢𝙖𝙣...🤍*

*🌟 𝙍𝙖𝙝𝙖𝙩𝙤𝙣 𝙨𝙚 𝙘𝙝𝙖𝙢𝙠𝙖 𝙝𝙖𝙞 𝙝𝙖𝙧 𝙙𝙖𝙢𝙖𝙣...🌷*
*𝘼𝙯𝙖𝙖𝙙𝙞 𝙠𝙖 𝙖𝙖𝙜𝙖𝙯 𝙝𝙖𝙞 𝙝𝙖𝙧 𝙗𝙖𝙖𝙜𝙝𝙖𝙖𝙣...🌿*

*🔥 𝘼𝙖𝙟 𝙝𝙖𝙧 𝙙𝙞𝙡 𝙢𝙖𝙞𝙣 𝙝𝙖𝙞 𝙞𝙠 𝙩𝙖𝙧𝙖𝙣𝙖...🎶*
*𝘼𝙯𝙖𝙙𝙞 𝙈𝙪𝙗𝙖𝙧𝙖𝙠 𝙝𝙤, 𝙥𝙮𝙖𝙧𝙖 𝙃𝙖𝙞 𝙔𝙚𝙝 𝙒𝙖𝙩𝙖𝙣! 🇵🇰*

*💚 𝙋𝘼𝙆𝙄𝙎𝙏𝘼𝙉 𝙕𝙄𝙉𝘿𝘼𝘽𝘼𝘿 🤍*\n🇵🇰 *𝘼𝙯𝙖𝙖𝙙𝙞 𝙈𝙪𝙗𝙖𝙧𝙖𝙠 𝙃𝙤!* 🇵🇰`;

    return api.sendMessage({ body: gazal, attachment: audio }, event.threadID, event.messageID);
  }
};
