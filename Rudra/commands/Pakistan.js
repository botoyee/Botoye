const fs = require("fs");

module.exports.config = {
  name: "gazal",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Sends a patriotic Azadi ghazal on 🇵🇰 emoji",
  commandCategory: "auto-response",
  usages: "Just send 🇵🇰",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body || !body.includes("🇵🇰")) return;

  const message = `🇵🇰✨ *𝐏𝐀𝐊𝐈𝐒𝐓𝐀𝐍 𝐙𝐈𝐍𝐃𝐀𝐁𝐀𝐃* ✨🇵🇰

🌟 *𝗔𝘇𝗮𝗱𝗶 𝗠𝘂𝗯𝗮𝗿𝗮𝗸 𝗛𝗼 𝗗𝗶𝗹 𝗦𝗲!* 🌟

*𝙔𝙚 𝙬𝙖𝙩𝙖𝙣 𝙝𝙖𝙞 𝙢𝙖𝙧𝙞 𝙟𝙖𝙖𝙣... 🇵🇰  
𝘿𝙪𝙖𝙤𝙣 𝙢𝙚𝙞𝙣 𝙧𝙖𝙝𝙚 𝙮𝙚 𝙣𝙖𝙖𝙢...✨  
𝙈𝙖𝙩𝙞 𝙠𝙖 𝙝𝙖𝙧 𝙩𝙞𝙣𝙠𝙖 𝙜𝙖𝙝𝙞 𝙝𝙖𝙞...  
𝙒𝙖𝙩𝙖𝙣 𝙠𝙞 𝙞𝙨𝙞 𝙨𝙝𝙖𝙖𝙣 𝙢𝙚𝙞𝙣 𝙟𝙖𝙣!* 💚

𝑷𝒂𝒌𝒊𝒔𝒕𝒂𝒏 𝒁𝒊𝒏𝒅𝒂𝒃𝒂𝒅 💥  
𝑨𝒛𝒂𝒅𝒊 𝑴𝒖𝒃𝒂𝒓𝒂𝒌 𝒉𝒐! 🎉🇵🇰`;

  const audioPath = __dirname + `/noprefix/baja.mp3`;
  if (!fs.existsSync(audioPath)) return api.sendMessage("⚠️ Audio file baja.mp3 not found.", threadID, messageID);

  return api.sendMessage({
    body: message,
    attachment: fs.createReadStream(audioPath)
  }, threadID, messageID);
};

module.exports.run = () => {};
