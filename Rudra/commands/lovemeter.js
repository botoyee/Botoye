module.exports.config = {
  name: "lovemeter",
  version: "1.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Tag 2 people to calculate love meter",
  commandCategory: "fun",
  usages: "@user1 @user2",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { mentions, threadID, messageID } = event;

  const mentionArray = Object.keys(mentions);
  if (mentionArray.length === 2) {
    const name1 = mentions[mentionArray[0]];
    const name2 = mentions[mentionArray[1]];
    const lovePercent = Math.floor(Math.random() * 51) + 50; // 50% - 100%

    const replies = [
      "💖 Tum dono ki love story likhne layak hai 📖",
      "🌹 Nazar na lage is jodi ko 😍",
      "💘 Aap dono ko dekh kar dil garden garden ho gaya 🌼",
      "❤️ Dil to pagal hai... aur tum dono bhi 😝",
      "💞 Officially best couple 2025 🌟",
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const msg = `💌 𝑳𝒐𝒗𝒆 𝑴𝒆𝒕𝒆𝒓 𝑹𝒆𝒔𝒖𝒍𝒕 💌

🥰 ${name1} ❤️ ${name2}
✨ 𝑳𝒐𝒗𝒆 𝑷𝒆𝒓𝒄𝒆𝒏𝒕: ${lovePercent}%

${randomReply}`;

    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = () => {};