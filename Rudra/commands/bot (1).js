module.exports.config = {
  name: "botreply",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Funny desi replies when someone types only 'bot'",
  commandCategory: "fun",
  usages: "Type exactly 'bot'",
  cooldowns: 2,
  listenEvents: true // ✅ Required to make handleEvent work
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body) return;

  const lowerCaseMsg = body.toLowerCase().trim();

  // ✅ Only trigger when message is exactly "bot"
  if (lowerCaseMsg !== "bot") return;

  try {
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "jaan";

    const replies = [
      "Kaash hum dono WhatsApp pe hote ❤️🥺. edhrr ao tumyy godee me uthaoo💋' 💄😒",
      "hyee hyee... 'beta sabar ka imtihaan mat le' 😩👐",
      "Us ne kaha chand ho tum... i love u ummmmah🌚😂",
      "Mujhe us se mohabbat thi... par us ke signal weak thay 📶❌",
      "Tere bina to raaton ki neend gayi... par neend gayi nahi, tu sapno mein dikh gaya 👻",
      "Tujh pe ghazal likhna chahti thi... par dimaag bola 'waste of ink' 🖊️😤",
      "Tere pyar ne hamein woh dukh diye... jaise wedding card ke baad rishta tod diya ho 📩💔",
      "Tujhe bhoolna chahti hoon... par tu har chappal mein yaad aa jata hai 👡😭",
      "Tu zindagi ka wo safha hai... jise main page number samajh ke ulti thi 🤦‍♀️📖",
      "Mohabbat ka chaska lagaya us ne... aur chuski ki tarah chhod bhi gaya 🧊💔",
      "𝐥𝐚𝐚𝐧𝐚𝐭 𝐛𝐡𝐢 𝐤𝐲𝐚 𝐜𝐡𝐞𝐞𝐳 𝐡𝐚𝐢 𝐚𝐝𝐫𝐞𝐬𝐬 𝐧𝐚𝐡 𝐛𝐡𝐢 𝐥𝐢𝐤𝐡𝐨𝐧 𝐦𝐮𝐬𝐭𝐚𝐡𝐢𝐪 𝐚𝐟𝐫𝐚𝐚𝐝 𝐭𝐚𝐤 𝐩𝐚𝐡𝐨𝐧𝐜𝐡 𝐣𝐚𝐭𝐢 𝐡𝐚𝐢🤣",
      "𝐰𝐨𝐡 𝐣𝐨 𝐤𝐚𝐫𝐨𝐫𝐫𝐨𝐧 𝐦𝐞𝐢𝐧 𝐚𝐢𝐤 𝐡𝐚𝐢 𝐧𝐚! 𝐰𝐨𝐡 𝐦𝐞𝐢𝐧 𝐤𝐡𝐮𝐝 𝐡𝐢 𝐡𝐨",
      "𝐊𝐢𝐬𝐢 𝐤𝐨 𝐬𝐚𝐜𝐡𝐞𝐲 𝐝𝐢𝐥 𝐬𝐞 𝐜𝐡𝐚𝐚𝐡𝐨 𝐭𝐨 𝐩𝐨𝐨𝐫𝐢 𝐤𝐚𝐚𝐲𝐞𝐧𝐚𝐚𝐭 𝐢𝐬 𝐤𝐢 𝐬𝐡𝐚𝐝𝐢 𝐤𝐢𝐬𝐢 𝐚𝐮𝐫 𝐬𝐞 𝐤𝐫𝐰𝐚𝐧𝐞 𝐦𝐞𝐢𝐧 𝐥𝐚𝐠 𝐣𝐚𝐭𝐢 𝐡𝐚𝐢🥺🥺🥺",
      "𝐀𝐚𝐨 𝐝𝐚𝐫𝐝 𝐛𝐚𝐧𝐭𝐭𝐚𝐲 𝐡𝐚𝐢𝐧 𝐓𝐮𝐦 𝐝𝐚𝐫𝐰𝐚𝐳𝐚𝐲 𝐦𝐞𝐢𝐧 𝐮𝐧𝐠𝐥𝐢 𝐝𝐨 𝐏𝐡𝐢𝐫 𝐦𝐢𝐥 𝐤𝐚𝐫 𝐜𝐡𝐞𝐞𝐤𝐡𝐚𝐢𝐧 𝐦𝐚𝐚𝐫𝐭𝐚𝐲 𝐡𝐚𝐢𝐧🙈🙈",
      "𝐓𝐚𝐢𝐫𝐚𝐲 𝐣𝐚𝐚𝐧𝐞 𝐤𝐞 𝐛𝐚𝐚𝐝 𝐰𝐚𝐪𝐭 𝐭𝐡𝐚𝐦 𝐬𝐚 𝐠𝐚𝐲𝐚 𝐭𝐡𝐚 𝐁𝐚𝐚𝐝 𝐦𝐞𝐢𝐧 𝐩𝐚𝐭𝐚 𝐜𝐡𝐚𝐥𝐚 𝐤𝐞 𝐆𝐡𝐚𝐫𝐢 𝐤𝐚 𝐜𝐞𝐥𝐥 𝐤𝐡𝐚𝐭𝐚𝐦 𝐡𝐨𝐠𝐚𝐲𝐚 𝐭𝐡𝐚🤣🙈",
      "Itna single hoon ke khwab mein bhi larki ke haan karne se pehle aankh khul jaati hai 🙂🤣😂",
      "Aao pyaar karein💋💋😅",
      "Tumko meri ittu si bhi yaad nahi aati 🥹",
      "Itna single hoon ke khwab mein bhi larki ke haan karne se pehle aankh khul jaati hai 🙂😅"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    return api.sendMessage({
      body: `@${userName}, ${randomReply}`,
      mentions: [{
        tag: `@${userName}`,
        id: senderID
      }]
    }, threadID, messageID);
  } catch (error) {
    console.error("BotReply Error:", error);
  }
};

module.exports.run = () => {};
