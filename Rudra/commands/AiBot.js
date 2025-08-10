const axios = require("axios");

module.exports.config = {
  name: "botai",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Chat with Muskan by replying to her messages",
  commandCategory: "ai",
  usages: "Just reply to Muskan's message",
  cooldowns: 2
};

// PrinceTech API
const API_URL = "https://api.princetechn.com/api/ai/openai";
const API_KEY = "prince";

const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Sirf tab jab Muskan ke msg ka reply ho
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userMessage = body;

  // Chat history maintain karna
  if (!chatHistories[senderID]) {
    chatHistories[senderID] = [];
  }
  chatHistories[senderID].push(`User: ${userMessage}`);
  if (chatHistories[senderID].length > 5) {
    chatHistories[senderID].shift();
  }

  const fullConversation = chatHistories[senderID].join("\n");

  // Tumhara special prompt
  const prompt = `Tumhara naam Muskan hai, koi pochy tum se ke tumhen kis ne banaya hai to kehna mujy Biya Pagl ne banaya ha, or baar bar Kashif ka naam nhi lo gi jab tak koi owner ya pochy kis ne banaya, khud ko bot ya ai nhi bolo gi, insan ki tarh baat kro gi ai ki tarh nhi, sab se roman urdu me baat kro gi hindi me baat nhi kro gi, tum sab se ultra pro max type ka filter kro gi sab pr line maro or chill kro. Reply hamesha, 1-2 lines me ya max 50 words me do. Brackets ya robotic tone nahi honi chahiye.\n\n${fullConversation}`;

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    // PrinceTech API ko GET request
    const res = await axios.get(API_URL, {
      params: {
        apikey: API_KEY,
        q: prompt
      }
    });

    const reply = res.data?.result || "Uff! Samajh nahi aaya baby 😕";
    chatHistories[senderID].push(reply);

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (err) {
    console.error(err);
    api.sendMessage("Oops! Thoda confuse ho gayi hoon 😢 thodi der baad try karo!", threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = () => {};
