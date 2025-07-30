const fs = require("fs");

module.exports.config = {
  name: "help2",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Modified by Ayan Ali",
  description: "Stylish Help Menu v2",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 1
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const prefix = global.config.PREFIX || "/";

  let helpText = `
╭──────────────╮
✨ 𝙎𝙏𝙔𝙇𝙄𝙎𝙃 𝙃𝙀𝙇𝙋 𝙈𝙀𝙉𝙐 ✨
╰──────────────╯

🔰 Prefix: ${prefix}
📂 Category: Fun, Utility, System

╭───────────╮
🔥 𝗧𝗢𝗣 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 🔥
╰───────────╯
✅ ${prefix}menu – Show main menu  
✅ ${prefix}owner – Bot owner info  
✅ ${prefix}upt – Bot uptime  
✅ ${prefix}kick – Remove member  
✅ ${prefix}tag – Tag all members  
✅ ${prefix}love – Romantic replies  
✅ ${prefix}group – Group settings  

╭────────────╮
👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
╰────────────╯
👤 Name: 𝐀𝐲𝐚𝐧 𝐀𝐥𝐢  
🔗 FB: www.facebook.com/61565142011404  

📝 Use ${prefix}help [command] to get details.
`;

  const imagePath = __dirname + `/noprefix/ayanhelp.jpg`;
  if (fs.existsSync(imagePath)) {
    return api.sendMessage(
      {
        body: helpText,
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      messageID
    );
  } else {
    return api.sendMessage(helpText, threadID, messageID);
  }
};
