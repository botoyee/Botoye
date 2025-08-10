module.exports.config = {
  name: "autoemoji",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza & Ayan Ali",
  description: "Auto reply to emoji-only messages with funny desi style (50+ emojis)",
  commandCategory: "fun",
  usages: "auto emoji detect & reply",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body) return;

  // Only allow messages that are purely emojis (ignore text)
  const emojiOnly = /^[\p{Emoji}\s]+$/u;
  if (!emojiOnly.test(body.trim())) return;

  const emoji = body.trim();

  // 50+ Emoji Funny Replies
  const replyMap = {
    "🥺": "tya hua baby 🥺",
    "😂": "ziyada na hans 32vi bahar gir jaye gi 😹",
    "😢": "Rona band kar pagle, kal fry-day hai! 🍟",
    "❤️": "Dil to har kisi ka toot ta hai, tumhara bhi toote ga 😌",
    "😎": "Swag se karenge sabka swagat 😎🔥",
    "🤔": "chaprasi jaisi shakl hai tumhari Ziyada soch kr konsa kashmir azad krwao gy 🤣",
    "😡": "mainy tya tiya baby 🥺🥺",
    "😍": "Aankhon ka kajal bana dya kisika dil 💘",
    "😭": "Rula dya bhai! 🧻 Lo tissue...",
    "🤣": "Ziyada na hans pagl lg rhy",
    "😇": "Naqli masoom 😇 spotted!",
    "🔥": "Aag lga di re baba! 🔥 Fire Hai!",
    "🤩": "Chamak rahi ho, solar panel pe charge ho? ☀️",
    "🥳": "Party hard! 🥳🍾",
    "😜": "Aankh maar ke dil le gayi 😜",
    "🤯": "Dimaag ka dahi ban gaya 🥛",
    "🙃": "Uljha hua pyaar ka scene lagta hai 😏",
    "💀": "Maar hi dala hansi hansi me ☠️",
    "🫡": "Salute aapki harkaton ko 🫡",
    "👍": "Shabaash beta 👍",
    "👎": "Bura laga bhai 😒",
    "🙏": "Duaon me yaad rakhna 😌",
    "💔": "Arre yaar, phir toot gaya dil 💔",
    "💋": "Kiss ka tax bhar diya tumne 😘",
    "😏": "Ye wala look main bhi maar sakti hu 😏",
    "😤": "Steam nikal rahi hai muh se 🚂",
    "🥱": "Bore kar diya tumne 😴",
    "🤌": "Italian style ka pyaar 🤌🇮🇹",
    "👀": "Itni nazar kis pe lagi hai? 👀",
    "🙄": "oper teri pHophi nAsreen ha kya🙄",
    "💃": "Nach baliye ka audition lagta hai 💃",
    "🕺": "Disco dancer 2.0 🕺",
    "😻": "Billi wale pyaar wale vibes 😻",
    "🙈": "Dekha nahi kuch... par suna sab 🙈",
    "🙉": "Kuch sunai nahi de raha... drama hai kya? 🙉",
    "🙊": "Chup bilkul chup 🙊",
    "🥰": "bndr jaisi shakl pr dil rkh kr khush ho rhy 🤣",
    "🎉": "Celebration mode on 🎉",
    "🍫": "Chocolate ka mood ban gaya 🍫",
    "🍕": "Pizza khilao warna baat mat karo 🍕",
    "🍟": "Fry-day everyday 🍟",
    "🍺": "Cheers! 🍺",
    "☕": "Chai pilao, dil jeet lo ☕",
    "🥂": "Party vibes detected 🥂",
    "🍷": "Sharabi nazar aa rahe ho 🍷",
    "🌹": "Phool to acha diya, ab gulab jamun bhi do 🌹",
    "🌚": "Dark mode me pyar 🌚",
    "🌞": "Suraj se zyada bright tum 🌞",
    "🌈": "Rainbow vibes 🌈",
    "⚡": "Bijli gir gayi tum pe ⚡",
    "💣": "Bomb lagte ho tum 💣",
    "🩷": "Soft pink wala pyaar 🩷"
  };

  // Check if any emoji matches exactly
  for (const emo in replyMap) {
    if (emoji.includes(emo)) {
      return api.sendMessage(replyMap[emo], threadID, messageID);
    }
  }

  // If no match, don't reply
  return;
};

module.exports.run = function () {};
