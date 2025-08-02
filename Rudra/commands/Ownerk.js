const fs = require("fs");
module.exports.config = {
  name: "ownerinfo",
  version: "1.0.2",
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
  if (text.includes("owner")) {
    const message = `🖤✨
"نرمی سے بات کرنا ہماری فطرت ہے،
مگر لوگ بھول جاتے ہیں
کہ ہم جواب دینا بھی خوب جانتے ہیں!"
━━━━━━━━━━━━━━━━━━━━━━━
𝗡𝗮𝗺𝗲: 𝗞𝗮𝘀𝗵𝗶𝗳 𝗥𝗮𝘇𝗮 (𝗔𝘆𝗮𝗻 𝗔𝗹𝗶)
🌐 Facebook: facebook.com/100001854531633
📧 Email: kashifrazamallah22@gmail.com
📲 WhatsApp: https://wa.me/447354208303
━━━━━━━━━━━━━━━━━━━━━━━`;

    return api.sendMessage(
      {
        body: message,
        attachment: fs.createReadStream(__dirname + `/noprefix/kashif.jpg`)
      },
      threadID,
      messageID
    );
  }
};

module.exports.run = () => {};
