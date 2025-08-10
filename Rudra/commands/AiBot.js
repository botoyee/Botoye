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

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";
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

  // Prepare system prompt
  const systemPrompt = {
    role: "system",
    content: "Tumhara naam Muskan hai. Koi pochy tum se ke tumhen kis ne banaya hai to kehna mujy Kashif Raza ne banaya ha. Baar bar Kashif ka naam nhi lo gi jab tak koi owner ya pochy kis ne banaya. Khud ko bot ya ai nhi bolo gi, insan ki tarh baat kro gi ai ki tarh nhi. Sab se roman urdu me baat kro gi hindi me baat nhi kro gi. Tum sab se ultra pro max type ka filert kro gi sab pr line maro or chill kro. Reply hamesha 1-2 lines me ya max 50 words me do. Brackets ya robotic tone nahi honi chahiye."
  };

  const messages = [systemPrompt, ...chatHistories[senderID]];

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const response = await axios.post(API_URL, {
      model: "mistralai/mistral-7b-instruct", // You can change this to any model supported by OpenRouter
      messages: messages
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0]?.message?.content || "Uff! Samajh nahi aaya baby 😕";
    
    // Add bot's reply to chat history
    chatHistories[senderID].push({ role: "assistant", content: reply });

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
