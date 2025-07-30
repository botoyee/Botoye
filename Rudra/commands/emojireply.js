module.exports.config = {
  name: "autoemoji",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Auto reply to emoji-only messages with funny desi style",
  commandCategory: "fun",
  usages: "auto emoji detect & reply",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;

  if (!body) return;

  // Emoji-only pattern (ignore text, only emoji allowed)
  const emojiOnly = /^[\p{Emoji}\s]+$/u;
  if (!emojiOnly.test(body.trim())) return;

  const emoji = body.trim();
  const replyMap = {
    "🥺": "Itna masoom bna k kis ka dil jeetny chale ho? 😏",
    "😂": "Hansi rok lo warna pani chhoot jaye ga 🤣💦",
    "😢": "Rona band kar pagle, kal fry-day hai! 🍟",
    "❤️": "Dil to har kisi ka toot ta hai, tumhara bhi toote ga 😌",
    "😎": "Swag se karenge sabka swagat 😎🔥",
    "🤔": "Itna mat soch... chakna bhi nahi milna sochny ka 🫣",
    "😡": "Gussa kam kar, sabzi thandi ho jayegi 🌶️",
    "😍": "Aankhon ka kajal bana dya kisika dil 💘",
    "😭": "Rula dya bhai! 🧻 Lo tissue...",
    "🤣": "Tu to full comedy scene hai boss 🎬",
    "😇": "Naqli masoom 😇 spotted!",
    "🔥": "Aag lga di re baba! 🔥 Fire Hai!"
  };

  // Find any emoji in the replyMap
  for (const emo in replyMap) {
    if (emoji.includes(emo)) {
      return api.sendMessage(replyMap[emo], threadID, messageID);
    }
  }

  // Default reply if emoji not matched
  const fallback = [
    "Emoji game strong hai boss 💪",
    "Sirf emojis? Dil ki baat toh bol 😏",
    "Acha mood hai lagta hai 😉",
    "Kya cryptic signal bhej rahe ho? 😅"
  ];
  const randomReply = fallback[Math.floor(Math.random() * fallback.length)];
  return api.sendMessage(randomReply, threadID, messageID);
};

module.exports.run = function () {};