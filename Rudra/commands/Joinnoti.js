const fs = require("fs");

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Kashif Raza",
  description: "Sends a cool welcome message with owner info when bot is added"
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  if (event.logMessageData?.addedParticipants.some(user => user.userFbId === botID)) {
    const msg = 
`🎉✨ 𝑩𝒐𝒕 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒆𝒅 𝑻𝒐 𝑮𝒓𝒐𝒖𝒑 ✨🎉

🖐️ ʜᴇʟʟᴏ ɢᴜʏꜱ! ɪ ᴀᴍ ʏᴏᴜʀ ɴᴇᴡ ꜱᴍᴀʀᴛ ᴀɪ ʙᴏᴛ 🤖 
ᴛʏᴘᴇ '/help' ᴛᴏ ꜱᴇᴇ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ. 💬

📘✨ ᴏᴡɴᴇʀ ɪɴꜰᴏ ✨📘

(◕‿◕)➤ ★彡
👑 𝑨𝒈𝒆 : 22
💘 𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑 : 𝑵𝒐𝒏𝒆, 
🏡 𝑭𝒓𝒐𝒎 : 
🎓 𝑺𝒕𝒖𝒅𝒚 : 
📘 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 :

📞 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 : 𝒕𝒂𝒎𝒊𝒛 𝒔𝒆 𝒃𝒂𝒂𝒕 𝒌𝒓, 𝒄𝒉𝒂𝒍 𝒏𝒆𝒌𝒂𝒍 ⚠️

🖤 
"𝑻𝒖 𝒘𝒂𝒇𝒂 𝒌𝒊 𝒃𝒂𝒂𝒕 𝒌𝒂𝒓𝒕𝒂 𝒉𝒂𝒊,  
𝑯𝒂𝒎 𝒕𝒐 𝒕𝒂𝒒𝒅𝒊𝒓𝒐𝒏 𝒌𝒐 𝒃𝒉𝒊 𝒄𝒉𝒉𝒐𝒓 𝒅𝒆𝒕𝒆 𝒉𝒂𝒊𝒏!" 😈💔🔥`;

    const attachment = fs.existsSync(__`)
      ? fs.createReadStream(_)
      : null;

    return api.sendMessage({
      body: msg,
      attachment
    }, threadID);
  }
};
