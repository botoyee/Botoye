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
  if (text.includes("owner")) {
    const message = `✨✨✨✨✨✨✨✨✨✨

𝙉𝙖𝙧𝙢𝙞 𝙨𝙚 𝙗𝙖𝙖𝙩 𝙠𝙖𝙧𝙣𝙖 𝙝𝙖𝙢𝙖𝙧𝙞 𝙛𝙞𝙩𝙧𝙖𝙩 𝙝𝙖𝙞,  
𝙈𝙖𝙜𝙖𝙧 𝙡𝙤𝙜 𝙗𝙝𝙤𝙤𝙡 𝙟𝙖𝙖𝙩𝙚 𝙝𝙖𝙞𝙣 💔  
𝙆𝙚 𝙝𝙪𝙢 𝙟𝙬𝙖𝙗 𝙙𝙚𝙣𝙖 𝙗𝙝𝙞 𝙠𝙝𝙤𝙤𝙗 𝙟𝙖𝙖𝙣𝙩𝙚 𝙝𝙖𝙞𝙣!

━━━━━━━━━━━━━━━━━━━━━━━

𝗡𝗮𝗺𝗲: 𝗞𝗔𝗦𝗛𝗜𝗙 𝗥𝗔𝗭𝗔 (𝗔𝘆𝗮𝗻 𝗔𝗹𝗶)  
🌐 Facebook: https://facebook.com/100001854531633  
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
