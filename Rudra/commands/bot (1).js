module.exports.config = {
  name: "botreply",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Funny desi replies when someone mentions 'bot', with @mention",
  commandCategory: "fun",
  usages: "auto bot reply",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body) return;

  const lowerCaseMsg = body.toLowerCase();

  if (lowerCaseMsg.includes("bot")) {
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "jaan";

    const replies = ["Tere baad to lipstick bhi lagayi... par mirror ne kaha 'bekaar mehnat hai' 💄😒",
  "Tere jaise se to khuda bhi kahe... 'beta sabar ka imtihaan mat le' 😩👐",
  "Us ne kaha chand ho tum... lekin full moon ki load shedding jaisi lagti ho 🌚😂",
  "Mujhe us se mohabbat thi... par us ke signal weak thay 📶❌",
  "Tere bina to raaton ki neend gayi... par neend gayi nahi, tu sapno mein dikh gaya 👻",
  "Tujh pe ghazal likhna chahti thi... par dimaag bola 'waste of ink' 🖊️😤",
  "Tere pyar ne hamein woh dukh diye... jaise wedding card ke baad rishta tod diya ho 📩💔",
  "Tujhe bhoolna chahti hoon... par tu har chappal mein yaad aa jata hai 👡😭",
  "Tu zindagi ka wo safha hai... jise main page number samajh ke ulti thi 🤦‍♀️📖",
  "Mohabbat ka chaska lagaya us ne... aur chuski ki tarah chhod bhi gaya 🧊💔" ,
"𝑨𝒆 𝒉𝒐𝒏𝒕 𝒑𝒆 𝒉𝒂𝒔𝒊 𝒐𝒓 𝒅𝒊𝒍 𝒎𝒆 𝒕𝒆𝒓𝒂 𝒏𝒂𝒎, 𝒃𝒂𝒕𝒉𝒓𝒐𝒐𝒎 𝒎𝒆 𝒃𝒉𝒊 𝒕𝒖𝒋𝒉𝒆 𝒉𝒊 𝒚𝒂𝒅 𝒌𝒂𝒓𝒖",
"𝑨𝒆 𝒍𝒂𝒅𝒌𝒆 𝒅𝒊𝒍 𝒍𝒆 𝒌𝒆 𝒃𝒂𝒈𝒉 𝒎𝒆 𝒏𝒂 𝒃𝒉𝒂𝒈 𝒋𝒂𝒏𝒂 😏",
"𝑴𝒂𝒊𝒏 𝒏𝒂 𝒉𝒊𝒓𝒐𝒊𝒏 𝒏𝒊 𝒃𝒂𝒓𝒃𝒂𝒓𝒂 𝒂𝒂𝒅𝒉𝒊 𝒎𝒂𝒅𝒉𝒖𝒓𝒊, 𝒂𝒂𝒅𝒉𝒊 𝒓𝒂𝒌𝒉𝒊 💃",
"𝑻𝒖 𝒃𝒖𝒍𝒂𝒚𝒆 𝒏𝒂 𝒎𝒂𝒊𝒏 𝒂𝒂𝒖, 𝒕𝒉𝒐𝒅𝒊 𝒎𝒂𝒓𝒚𝒂𝒅𝒂 𝒉𝒐𝒕𝒊 𝒉𝒖 𝒎𝒆𝒊𝒏 😌",
"𝑴𝒆𝒓𝒊 𝒂𝒅𝒂𝒐𝒏 𝒔𝒆 𝒅𝒂𝒓 𝒎𝒂𝒕 𝒋𝒂𝒏𝒂, 𝒎𝒂𝒊𝒏 𝒕𝒐 𝒃𝒂𝒔 𝒕𝒉𝒐𝒅𝒊 𝒃𝒂𝒕𝒎𝒊𝒛 𝒉𝒖𝒏 😉",
"𝑻𝒖 𝒅𝒂𝒓𝒘𝒂𝒛𝒂 𝒌𝒉𝒐𝒍 𝒕𝒐 𝒔𝒉𝒓𝒂𝒓𝒂𝒓𝒂𝒕𝒐𝒏 𝒌𝒊 𝒂𝒂𝒏𝒅𝒉𝒊 𝒂𝒂𝒋𝒂𝒚𝒆𝒈𝒊 🌪️",
"𝑴𝒆𝒓𝒂 𝒅𝒊𝒍 𝒕𝒐 𝒌𝒂𝒎𝒊𝒏𝒂 𝒉𝒂𝒊, 𝒕𝒖 𝒔𝒂𝒎𝒋𝒉 𝒌𝒂𝒚 𝒉𝒊 𝒏𝒂𝒊 𝒕𝒉𝒂 😋",
"𝑩𝒂𝒓𝒊 𝒍𝒂𝒅𝒌𝒊 𝒉𝒖𝒏 𝒎𝒂𝒊𝒏, 𝒍𝒆𝒌𝒊𝒏 𝒕𝒖 𝒎𝒆𝒓𝒆 𝒔𝒂𝒎𝒏𝒆 𝒃𝒂𝒄𝒄𝒉𝒂 𝒍𝒂𝒈𝒕𝒂 𝒉𝒂𝒊 🤭",
"𝑻𝒖 𝒃𝒂𝒕𝒐𝒏 𝒎𝒆 𝒖𝒍𝒋𝒉𝒂 𝒓𝒉𝒂 𝒉𝒂𝒊, 𝒎𝒆𝒓𝒊 𝒏𝒊𝒈𝒂𝒉𝒐𝒏 𝒔𝒆 𝒃𝒂𝒄𝒉 𝒏𝒂𝒉𝒊 𝒑𝒂𝒚𝒆𝒈𝒂",
"𝑪𝒉𝒐𝒌𝒓𝒂 𝒋𝒂𝒘𝒂𝒏 𝒉𝒐 𝒈𝒚𝒂 𝒉𝒂𝒊, 𝒎𝒆𝒓𝒊 𝒂𝒅𝒂 𝒑𝒂𝒓 𝒇𝒊𝒅𝒂 𝒉𝒐 𝒈𝒚𝒂 𝒉𝒂𝒊 😝",
"𝑻𝒖 𝒔𝒂𝒎𝒋𝒉𝒕𝒂 𝒉𝒂𝒊 𝒎𝒂𝒊𝒏 𝒃𝒉𝒐𝒍𝒊 𝒉𝒖, 𝒎𝒂𝒈𝒂𝒓 𝒎𝒆𝒓𝒂 𝒅𝒊𝒍 𝒕𝒐 𝒅𝒂𝒖𝒅𝒖 𝒔𝒆 𝒃𝒉𝒊 𝒕𝒆𝒛 𝒉𝒂𝒊 🐍",
"𝑴𝒂𝒊𝒏 𝒕𝒐 𝒂𝒊𝒔𝒊 𝒉𝒖, 𝒅𝒊𝒍 𝒎𝒆 𝒂𝒖 𝒂𝒖𝒓 𝒅𝒖𝒅𝒉 𝒑𝒊𝒍𝒂𝒖 😛",
"𝑷𝒚𝒂𝒓 𝒕𝒐 𝒂𝒖𝒓𝒐𝒏 𝒔𝒆 𝒌𝒓𝒕𝒆 𝒉𝒐, 𝒎𝒂𝒈𝒂𝒓 𝒕𝒐 𝒎𝒆𝒓𝒂 𝒃𝒂𝒃𝒚 𝒉𝒂𝒊 😚",
"𝑯𝒖𝒔𝒏 𝒎𝒆𝒓𝒂 𝒂𝒕𝒕𝒆𝒓𝒄𝒉𝒂𝒓𝒈𝒆, 𝒅𝒆𝒌𝒉𝒏𝒆 𝒘𝒂𝒍𝒂 𝒉𝒊 𝒇𝒖𝒍𝒍 𝒃𝒉𝒂𝒓𝒎 𝒎𝒆 𝒂𝒂 𝒋𝒂𝒆 🧨",
"𝑻𝒖 𝒃𝒐𝒍 𝒏𝒂 𝒋𝒂𝒏𝒖, 𝒎𝒂𝒊𝒏 𝒕𝒐 𝒕𝒆𝒓𝒊 𝒅𝒐𝒍𝒍 𝒉𝒖 🎀",
"𝑴𝒆𝒓𝒂 𝒃𝒖𝒕𝒕𝒆𝒓 𝒉𝒆𝒂𝒓𝒕 𝒉𝒂𝒊, 𝒎𝒂𝒈𝒂𝒓 𝒎𝒐𝒐𝒅 𝒂𝒚𝒆 𝒕𝒐 𝒄𝒉𝒖𝒓𝒊 𝒃𝒉𝒊 𝒃𝒂𝒏 𝒋𝒂𝒂𝒖 🤪",
"𝑨𝒂 𝒎𝒆𝒓𝒆 𝒑𝒂𝒔 𝒃𝒂𝒃𝒚, 𝒄𝒉𝒖𝒎𝒎𝒊 𝒌𝒂 𝒃𝒊𝒍𝒍 𝒇𝒓𝒆𝒆 𝒉𝒐𝒈𝒂 😘",
"𝑻𝒖 𝒉𝒂𝒂𝒏 𝒌𝒂𝒓, 𝒎𝒂𝒊𝒏 𝒎𝒂𝒏𝒅𝒊𝒓 𝒃𝒉𝒊 𝒋𝒂𝒖𝒏 𝒂𝒖𝒓 𝒎𝒂𝒔𝒋𝒊𝒅 𝒃𝒉𝒊 💃",
"𝑴𝒂𝒊𝒏 𝒕𝒖𝒋𝒉𝒆 𝒃𝒉𝒖𝒍𝒂 𝒏𝒂𝒉𝒊 𝒔𝒂𝒌𝒕𝒊, 𝒃𝒂𝒔 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒌𝒆 𝒃𝒂𝒕 𝒌𝒓 𝒍𝒐 😤"
      "𝐥𝐚𝐚𝐧𝐚𝐭 𝐛𝐡𝐢 𝐤𝐲𝐚 𝐜𝐡𝐞𝐞𝐳 𝐡𝐚𝐢 𝐚𝐝𝐫𝐞𝐬𝐬 𝐧𝐚𝐡 𝐛𝐡𝐢 𝐥𝐢𝐤𝐡𝐨𝐧 𝐦𝐮𝐬𝐭𝐚𝐡𝐢𝐪 𝐚𝐟𝐫𝐚𝐚𝐝 𝐭𝐚𝐤 𝐩𝐚𝐡𝐨𝐧𝐜𝐡 𝐣𝐚𝐭𝐢 𝐡𝐚𝐢🤣",
      "𝐰𝐨𝐡 𝐣𝐨 𝐤𝐚𝐫𝐨𝐫𝐫𝐨𝐧 𝐦𝐞𝐢𝐧 𝐚𝐢𝐤 𝐡𝐚𝐢 𝐧𝐚! 𝐰𝐨𝐡 𝐦𝐞𝐢𝐧 𝐤𝐡𝐮𝐝 𝐡𝐢 𝐡𝐨",
      "𝐊𝐢𝐬𝐢 𝐤𝐨 𝐬𝐚𝐜𝐡𝐞𝐲 𝐝𝐢𝐥 𝐬𝐞 𝐜𝐡𝐚𝐚𝐡𝐨 𝐭𝐨 𝐩𝐨𝐨𝐫𝐢 𝐤𝐚𝐚𝐲𝐞𝐧𝐚𝐚𝐭 𝐢𝐬 𝐤𝐢 𝐬𝐡𝐚𝐝𝐢 𝐤𝐢𝐬𝐢 𝐚𝐮𝐫 𝐬𝐞 𝐤𝐫𝐰𝐚𝐧𝐞 𝐦𝐞𝐢𝐧 𝐥𝐚𝐠 𝐣𝐚𝐭𝐢 𝐡𝐚𝐢🥺🥺🥺",
      "𝐀𝐚𝐨 𝐝𝐚𝐫𝐝 𝐛𝐚𝐧𝐭𝐭𝐚𝐲 𝐡𝐚𝐢𝐧 𝐓𝐮𝐦 𝐝𝐚𝐫𝐰𝐚𝐳𝐚𝐲 𝐦𝐞𝐢𝐧 𝐮𝐧𝐠𝐥𝐢 𝐝𝐨 𝐏𝐡𝐢𝐫 𝐦𝐢𝐥 𝐤𝐚𝐫 𝐜𝐡𝐞𝐞𝐤𝐡𝐚𝐢𝐧 𝐦𝐚𝐚𝐫𝐭𝐚𝐲 𝐡𝐚𝐢𝐧🙈🙈",
      "𝐓𝐚𝐢𝐫𝐚𝐲 𝐣𝐚𝐚𝐧𝐞 𝐤𝐞 𝐛𝐚𝐚𝐝 𝐰𝐚𝐪𝐭 𝐭𝐡𝐚𝐦 𝐬𝐚 𝐠𝐚𝐲𝐚 𝐭𝐡𝐚 𝐁𝐚𝐚𝐝 𝐦𝐞𝐢𝐧 𝐩𝐚𝐭𝐚 𝐜𝐡𝐚𝐥𝐚 𝐤𝐞 𝐆𝐡𝐚𝐫𝐢 𝐤𝐚 𝐜𝐞𝐥𝐥 𝐤𝐡𝐚𝐭𝐚𝐦 𝐡𝐨𝐠𝐚𝐲𝐚 𝐭𝐡𝐚🤣🙈",
      "𝐀𝐢𝐬𝐚 𝐥𝐚𝐠𝐭𝐚 𝐡𝐚𝐢 𝐜𝐡𝐚𝐲 𝐝𝐢𝐧 𝐠𝐡𝐚𝐫 𝐰𝐚𝐥𝐚𝐲 𝐬𝐢𝐫𝐟 𝐲𝐞𝐡 𝐬𝐨𝐜𝐡𝐭𝐚𝐲 𝐫𝐞𝐡𝐭𝐚𝐲 𝐡𝐚𝐢𝐧 𝐤𝐞 𝐈𝐭𝐰𝐚𝐫 𝐰𝐚𝐥𝐚𝐲 𝐝𝐢𝐧 𝐦𝐮𝐣𝐡 𝐬𝐞 𝐤𝐲𝐚 𝐤𝐲𝐚 𝐤𝐚𝐚𝐦 𝐤𝐚𝐫𝐰𝐚𝐧𝐚𝐲 𝐡𝐚𝐢𝐧🥵🙄😂",
      "𝐒𝐡𝐮𝐤𝐚𝐫 𝐡𝐚𝐢 𝐥𝐚𝐫𝐤𝐢𝐲𝐚𝐧 𝐪𝐮𝐫𝐛𝐚𝐧𝐢 𝐤𝐚 𝐣𝐚𝐧𝐰𝐚𝐫 𝐥𝐚𝐢𝐧𝐚𝐲 𝐧𝐚𝐡𝐢 𝐣𝐚𝐭𝐢 𝐰𝐚𝐫𝐧𝐚 𝐩𝐢𝐧𝐤 𝐜𝐨𝐥𝐨𝐫 𝐤𝐚 𝐛𝐚𝐤𝐫𝐚 𝐚𝐮𝐫 𝐥𝐢𝐠𝐡𝐭 𝐠𝐫𝐞𝐞𝐧 𝐜𝐨𝐥𝐨𝐫 𝐤𝐢 𝐠𝐚𝐲𝐞 𝐤𝐚𝐡𝐚𝐧 𝐬𝐞 𝐚𝐚𝐭𝐢🤣😂",
      "𝐦𝐮𝐧𝐠𝐡 𝐩𝐡𝐚𝐥𝐢 𝐦𝐞 𝐝𝐚𝐧𝐚 𝐧𝐡𝐢 𝐊𝐚𝐬𝐡𝐢𝐟 𝐤𝐨 𝐬𝐡𝐨𝐫 𝐤𝐫 𝐣𝐚𝐧𝐚 𝐧𝐡𝐢😅😅😅",
      "𝐓𝐮𝐦𝐚𝐡𝐚𝐫𝐢 𝐳𝐮𝐥𝐟𝐨𝐧 𝐦𝐞𝐢𝐧 𝐮𝐥𝐣𝐡𝐚 𝐡𝐰𝐚 𝐡𝐚𝐢 𝐌𝐨𝐡𝐚𝐥𝐥𝐞 𝐤𝐚 𝐬𝐮𝐥𝐣𝐡𝐚 𝐡𝐰𝐚 𝐥𝐚𝐫𝐤𝐚 𝐊𝐚𝐬𝐡𝐢𝐟",
      "𝐭𝐮𝐦 𝐛𝐚𝐬 𝐦𝐮 𝐛𝐚𝐧𝐚𝐭𝐢 𝐫𝐞𝐡𝐧𝐚 𝐊𝐚𝐬𝐡𝐢𝐟 𝐤𝐨 𝐤𝐨𝐢 𝐨𝐫 𝐩𝐚𝐭𝐚 𝐥𝐞 𝐠𝐢 🤣😅"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    return api.sendMessage({
      body: `@${userName}, ${randomReply}`,
      mentions: [{
        tag: `@${userName}`,
        id: senderID
      }]
    }, threadID, messageID);
  }
};

module.exports.run = () => {};
