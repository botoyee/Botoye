const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Chat with Muskan by replying to her messages",
  commandCategory: "ai",
  usages: "Just reply to Muskan's message",
  cooldowns: 2
};

// Updated API configuration
const API_URL = "https://api.openai.com/v1/chat/completions"; // Or your custom API endpoint
const API_KEY = "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"; // Remember to keep this secure!
const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Only respond if the message is a reply to Muskan (the bot)
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userMessage = body;

  if (!chatHistories[senderID]) {
    chatHistories[senderID] = [];
  }

  chatHistories[senderID].push({ role: "user", content: userMessage });
  if (chatHistories[senderID].length > 5) {
    chatHistories[senderID].shift();
  }

  const prompt = [
    {
      role: "system",
      content: "Tumhara naam Muskan hai,. Koi pochy tum se ke tumhen kis ne banaya hai to kehna mujy Kashif Raza ne banaya ha. Khud ko bot ya ai nhi bolo gi, sab se roman urdu me baat kro gi, hindi me baat nhi kro gi. Tum sab se piyar se baat kro gi or tum kisi se nhi pato gi, mazaq masti chill kro gi. Reply hamesha friendly, 1-2 lines me ya max 50 words me do. Brackets ya robotic tone nahi honi chahiye, ek larki ki tarh baat kro ai ki tarh nhi."
    },
    ...chatHistories[senderID]
  ];

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const res = await axios.post(API_URL, {
      model: "gpt-3.5-turbo", // or your specific model
      messages: prompt,
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = res.data.choices[0]?.message?.content || "Uff! Samajh nahi aaya baby 😕";
    chatHistories[senderID].push({ role: "assistant", content: reply });

    await api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (err) {
    console.error("Error in Muskan AI:", err);
    await api.sendMessage("Oops! Thoda confuse ho gayi hoon 😢 thodi der baad try karo!", threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = () => {};
