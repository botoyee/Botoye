const fs = require("fs");
module.exports.config = {
  name: "ownerinfo",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝗞𝗮𝘀𝗵𝗶𝗳 𝗥𝗮𝘇𝗮 (𝗔𝘆𝗮𝗻 𝗔𝗹𝗶)",
  description: "Sends stylish owner info when someone says 'owner'",
  commandCategory: "auto-response",
  usages: "auto owner info",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body) return;

  const text = body.toLowerCase();
  if (text.includes("o")) {
    
     = `📘✨ *OWNER INFO* ✨📘

(◕‿◕)➤ ★彡Shah彡★ (💀 Masoom 😎)
👑 𝑨𝒈𝒆 : 22
💘 𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑 : 𝑵𝒐𝒏𝒆,  😌
🏡 𝑭𝒓𝒐𝒎 : Multan✨
🎓 𝑺𝒕𝒖𝒅𝒚 : BS Psychology👨‍💻
📘 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 :https://www.facebook.com/Shah.356

📞 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑:
𝒕𝒂𝒎𝒊𝒛 𝒔𝒆 𝒃𝒂𝒂𝒕 𝒌𝒓, 𝒄𝒉𝒂𝒍 𝒏𝒆𝒌𝒂𝒍 ⚠️

 😈💔🔥`;

    return api.sendMessage(
      {
        body: message,
        attachment: fs.createReadStream(__ + `g`)
      },
      threadID,
      messageID
    );
  }
};

module.exports.run = () => {};
