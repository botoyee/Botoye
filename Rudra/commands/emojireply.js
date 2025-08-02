module.exports.config = {
  name: "autoemoji",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Ayan Ali + Modified by ChatGPT",
  description: "Desi-style auto reply for emoji-only messages",
  commandCategory: "fun",
  usages: "auto emoji detect & reply (Desi style)",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;

  if (!body) return;

  // Emoji-only check
  const emojiOnly = /^[\p{Emoji}\s]+$/u;
  if (!emojiOnly.test(body.trim())) return;

  const emoji = body.trim();

  const replyMap = {
    // ❤️ 💓 💕 💖 💗 💘 💝 💞 💟 💋 🥰 😘 😚 😙 😍
    "❤️": "Tera pyaar to seedha dil ko chu gaya re laddooo ❤️",
    "💓": "Dil dhadak raha hai naam tera le ke 💓",
    "💖": "Itni chamak to chand me bhi nahi jitni teri aankhon me 💖",
    "😘": "Oye hoye! Aaj to kiss ka mausam lagta hai 😘",
    "🥰": "Tum samne ho to duniya bhool jaata hoon 🥰",
    "💋": "Zuban sambhal ke! Yeh dil seedha shaadi tak jaata hai 💋",
    "😍": "Nazrein hata loon to jaan chali jaye 😍",

    // 😂 🤣 😆 😅 😜 😛 🤪 😋
    "😂": "Has has ke pet dard ho gaya re! 😂",
    "🤣": "Tu toh comedy ka full theka leke aaya hai 🤣",
    "😆": "Chal comedy circus ka naya hero tu hi hai 😆",
    "😜": "Aankh maar ke dil le gaya re 😜",
    "🤪": "Pagalpan me bhi pyaar chhupa hai tera 🤪",
    "😋": "Lagta hai biryani dekh li kisi ne 😋",

    // 😢 😭 😥 😓 🥺 🥹 😿
    "🥺": "Aankhon me aansu ache nahi lagte, muskura de zara 🥺",
    "😢": "Rone se kya fayda? Chal chai peene chalte hain 😢",
    "😭": "Tissue de doon ya kandha? Rona band karde yaar 😭",
    "😥": "Jo chala gaya usse bhool ja, chai bana le 😥",
    "🥹": "Dil chhota mat kar hero, sab theek ho jayega 🥹",

    // 😠 😡 🤬 😤
    "😠": "Itna gussa? Lagta hai samosay thande mil gaye 😠",
    "😡": "O bhai thand rakh, zindagi chhoti hai 😡",
    "🤬": "Gaali se kya hoga, aaj pakoray kha le 🤬",
    "😤": "Naak se dhuan nikal gaya lagta hai 😤",

    // 😇 🙃 🙂 🙈 🙊 🙉
    "😇": "Masoomiyat ka award jata hai... tujhe! 😇",
    "🙃": "Ulta seedha kar ke dil jeet liya 🙃",
    "🙂": "Seedhe mooh waali baat tum hi kar sakte ho 🙂",
    "🙈": "Kya dekh liya jo aankh chhupa li? 🙈",
    "🙊": "Aree baat karle, itna kya chup rehna 🙊",
    "🙉": "Sun bhi le, yeh dil ki baat hai 🙉",

    // 😐 😶 😑 😬 🤐 🫣
    "😐": "Yeh kya mooh bana liya? Shaadi cancel ho gayi kya 😐",
    "😶": "Khamoshi bhi kuch keh jaati hai 😶",
    "😑": "Bhai kuch toh bol... ya chai pila 😑",
    "😬": "Oho! Lage haath joke maar de 😬",
    "🤐": "Secret mat rakh... bata de, hum bhi shamil ho jayein 🤐",
    "🫣": "Yeh kis baat ka sharmaana hai? 🫣",

    // 🤮 🤕 🤧 😪
    "🤮": "Ye kisne khana banaya bhai 🤮",
    "🤕": "Oho! Kya laga sir pe? Gf ka chappal? 🤕",
    "🤧": "Nak band, dil open 😅🤧",
    "😪": "Neend aa rahi to chaddar le aur so ja 😪",

    // 💀 🍼
    "💀": "Mar gaya? Nahi! Biryani over ho gayi sirf 💀",
    "🍼": "Bachpan yaad dila diya re tu ne 🍼",

    // 🇵🇰
    "🇵🇰": "Pakistan Zindabad! 💚🤍 🇵🇰"
  };

  // Check matching emojis
  for (const emo in replyMap) {
    if (emoji.includes(emo)) {
      return api.sendMessage(replyMap[emo], threadID, messageID);
    }
  }

  // Default reply
  const fallbackReplies = [
    "Emoji ka tohfa kabool hai 🎁",
    "Sirf emoji? Muh se bhi kuch bol de 😄",
    "Lagta hai dil ka haal sirf emoji me bata diya 🧐",
    "Emoji se pyaar ho gaya lagta hai 💌"
  ];
  const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  return api.sendMessage(randomReply, threadID, messageID);
};

module.exports.run = function () {};
