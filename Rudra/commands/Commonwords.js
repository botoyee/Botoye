module.exports.config = {
  name: "commonwords",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Reply to common phrases in a desi funny style",
  commandCategory: "fun",
  usages: "auto reply",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msg = body.toLowerCase();

  const replies = {
    "thank you": [
      "Shukriya ka tohfa bht acha laga, lekin biryani bhej dete to zyada khushi hoti 🍛😋",
      "JazakAllah! Ab chai pilao 😌☕",
      "Thank you kehne se kya hoga, ab to party banti hai 😎🎉"
    ],
    "love you": [
      "Areey dil jeet liya tumne to 🥺❤️",
      "Pehle keh dete, hum pehle se hi single the 😭💔",
      "Love you too, ab mummy se baat karwao 😜"
    ],
    "i love you bot": [
      "Bot bhi ab sharma gaya 🥰",
      "Aisa pyar pehli dafa mila hai 🤖❤️",
      "Lekin bot abhi rishtay mein bandhne ko tayyar nahi 😅"
    ],
    "thank you bot": [
      "Bot ne thank you receive kar liya 📩",
      "Bot ka dil garden garden ho gaya 🌸",
      "Bot keh raha hai: mention na karo yar 😌"
    ],
    "tharki bot": [
      "Arayyy bot ne kya kiya ab 😳",
      "Bot seedha saadha bacha hai 🙈",
      "Tharki tum, bot to masoom hai 😇"
    ],
    "bot pagal": [
      "Haan, certified pagal bot hoon 😜",
      "Pagalpanti bhi ek art hoti hai 😏",
      "Tum bhi kuch kam nahi ho 🤪"
    ],
    "pagal bot": [
      "Pagal bot ya pyara bot? 😅",
      "Bot khud se milne gaya tha mental hospital mein 😵‍💫",
      "Tu bhi bot jaisa hi hai 😎"
    ],
    "bol pagal ha": [
      "Pagal to tum lagte ho, bolne ka tareeqa dekho 😒",
      "Aree bhai pagal nahi, sirf thoda offbeat hai 🤪",
      "Main pagal? Tere jaise hazaar dekhe hain 😂"
    ]
  };

  // Loop through keys and check if any phrase matches in message
  for (const phrase in replies) {
    if (msg.includes(phrase)) {
      const randomReply = replies[phrase][Math.floor(Math.random() * replies[phrase].length)];
      return api.sendMessage(randomReply, threadID, messageID);
    }
  }
};

module.exports.run = function () {};
