const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kashif x Ayan",
  description: "Chat with Muskan by replying to her messages",
  commandCategory: "ai",
  usages: "Just reply to Muskan's message",
  cooldowns: 2
};

const API_URL = "https://geminiw.onrender.com/chat";
const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Only respond if the message is a reply to Muskan (the bot)
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userMessage = body;

  if (!chatHistories[senderID]) {
    chatHistories[senderID] = [];
  }

  chatHistories[senderID].push(`User: ${userMessage}`);
  if (chatHistories[senderID].length > 5) {
    chatHistories[senderID].shift();
  }

  const fullConversation = chatHistories[senderID].join("\n");

  const prompt = `Tumhara naam Muskan hai, tum ek pyari si Urdu bolne wali ladki ho. Tumhara creator Kashif x Ayan hai. Tum hamesha pyar bhari, choti aur mazedar baat karti ho. Sirf jitna pucha jaye utna jawab do. Reply hamesha friendly, 1-2 lines me ya max 50 words me do. Brackets ya robotic tone nahi honi chahiye.\n\n${fullConversation}`;

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
    const reply = res.data.reply || "Uff! Samajh nahi aaya baby 😕";
    chatHistories[senderID].push(reply);

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (err) {
    console.error(err);
    api.sendMessage("Oops! Thoda confuse ho gayi hoon 😢 thodi der baad try karo!", threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

// Dummy run function to register module
module.exports.run = () => {};
