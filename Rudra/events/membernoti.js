module.exports.config = {
  name: "membernoti",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "1.0.2",
  credits: "Kashif Raza",
  description: "Funny Desi notifications on join/left"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData, eventType } = event;
  const botID = api.getCurrentUserID();

  try {
    if (eventType === "log:subscribe") {
      const addedUser = logMessageData.addedParticipants?.[0];
      const name = addedUser?.fullName || "Naya Banda";

      const welcomeMsg = 
`🤝✨ *𝗡𝗮𝘆𝗮 𝗠𝗲𝗺𝗯𝗲𝗿 𝗔𝗮 𝗚𝗮𝘆𝗮!* ✨🤝

🌟 خوش آمدید ${name} بھائی/باجی!  
یہ گروپ ہے *درد والوں کا تھانہ* 😭  
دعاؤں میں یاد رکھنا، ہنسی مذاق چلتا رہے گا 💬

*⛔ گالی گلوچ بند ❌*  
*💔 پیار میں دغا دینے والوں سے بچو 😭*

لکھو: /help — تاکہ پتہ چلے کیا گل کھلاتے ہیں ہم`;

      return api.sendMessage(welcomeMsg, threadID);
    }

    if (eventType === "log:unsubscribe") {
      const leftID = logMessageData.leftParticipantFbId;

      if (leftID === botID) return; // Bot left, skip message

      const userInfo = await api.getUserInfo(leftID);
      const name = userInfo[leftID]?.name || "Koi Banda";

      const leftMsg = 
`💔 *𝙀𝙠 𝙎𝙖𝙩𝙝𝙞 𝘾𝙝𝙤𝙧 𝙂𝙖𝙮𝙖...* 💔

😢 ${name} گروپ چھوڑ کے چلا گیا...  
ہم دعا کرتے ہیں کہ اگلا گروپ بہتر ملے 😭  
اور اگر دھی کا پیسہ باقی ہے تو واپس کر دے 😂`;

      return api.sendMessage(leftMsg, threadID);
    }

  } catch (err) {
    console.log("⚠️ Member Noti Error:", err);
  }
};
