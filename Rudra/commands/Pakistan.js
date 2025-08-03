const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "gazal",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif x Ayan",
  description: "Sends a patriotic ghazal with audio",
  commandCategory: "no prefix",
  usages: "🇵🇰",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ event, api }) {
  const { body, threadID } = event;
  if (!body || !body.includes("🇵🇰")) return;

  const ghazal = `🇵🇰✨ *𝑨𝒛𝒂𝒂𝒅 𝒘𝒂𝒕𝒂𝒏 𝒌𝒂 𝒎𝒂𝒔𝒂𝒇𝒂 𝒉𝒂𝒚...*  
*𝑪𝒉𝒂𝒏𝒅 𝒕𝒂𝒓𝒐𝒏 𝒔𝒆 𝒓𝒐𝒔𝒉𝒂𝒏 𝑷𝒂𝒌𝒊𝒔𝒕𝒂𝒏 𝒉𝒂𝒚!* 🇵🇰  
🌙 *𝑨𝒛𝒂𝒅𝒊 𝑴𝒖𝒃𝒂𝒓𝒂𝒌 𝒉𝒐!* 🌙  
*𝑷𝒂𝒌𝒊𝒔𝒕𝒂𝒏 𝒁𝒊𝒏𝒅𝒂𝒃𝒂𝒅!* 💚✨`;

  const audioPath = path.join(__dirname, "noprefix", "baja.mp3");

  if (!fs.existsSync(audioPath)) {
    return api.sendMessage("⚠️ Audio file not found: baja.mp3", threadID);
  }

  return api.sendMessage(
    {
      body: ghazal,
      attachment: fs.createReadStream(audioPath),
    },
    threadID
  );
};

module.exports.run = () => {};
