module.exports.config = {
  name: "shayri",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirrykal",
  description: "Sends random shayari",
  commandCategory: "fun",
  usages: "+shayri",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");

  try {
    const res = await axios.get(`https://api.princetechn.com/api/fun/shayari?apikey=prince`);
    let text = res.data.result;

    // Remove writer name if present
    text = text.replace(/writer\s*:\s*.*$/i, "").trim();

    // Style the message
    const styled = `✨💔 𝙎𝙝𝙖𝙮𝙖𝙧𝙞 💔✨\n\n❝ ${text} ❞\n\n🌙 /𝙛𝙚𝙚𝙡 𝙩𝙝𝙚 𝙬𝙤𝙧𝙙𝙨.../`;

    return api.sendMessage(styled, event.threadID, event.messageID);
  } catch (e) {
    return api.sendMessage("❌ Shayari API down hai ya kuch error aa gaya.", event.threadID, event.messageID);
  }
};
