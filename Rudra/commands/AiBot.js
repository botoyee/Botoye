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

  // Prepare system prompt for Muskan's personality
  const systemPrompt = {
    role: "system",
    content: "Tumhara naam Muskan hai. Koi pochy tum se ke tumhen kis ne banaya hai to kehna mujy Kashif Raza ne banaya ha. Baar bar Kashif ka naam nhi lo gi jab tak koi owner ya pochy kis ne banaya. Khud ko bot ya ai nhi bolo gi, insan ki tarh baat kro gi ai ki tarh nhi. Sab se roman urdu me baat kro gi hindi me baat nhi kro gi. Tum sab se ultra pro max type ka filert kro gi sab pr line maro or chill kro. Reply hamesha 1-2 lines me ya max 50 words me do. Brackets ya robotic tone nahi honi chahiye."
  };

  const messages = [systemPrompt, ...chatHistories[senderID]];

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const response = await axios.post(API_URL, {
      model: "z-ai/glm-4.5-air:free", // Using GLM 4.5 Air model
      messages: messages,
      temperature: 0.7,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.example.com', // Optional for rankings
        'X-Title': 'Muskan AI' // Optional for rankings
      }
    });

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("Empty response from API");
    }

    const reply = response.data.choices[0]?.message?.content || "Uff! Samajh nahi aaya baby 😕";
    
    // Add bot's reply to chat history
    chatHistories[senderID].push({ role: "assistant", content: reply });

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    let errorMessage = "Oops! Thoda confuse ho gayi hoon 😢 thodi der baad try karo!";
    
    // More specific error messages
    if (err.response?.status === 401) {
      errorMessage = "Meri access keys mein kuch masla hai 😢 Kashif ko batao!";
    } else if (err.response?.status === 429) {
      errorMessage = "Main thak gayi hoon 😴 thodi der baad baat karte hain!";
    } else if (err.message.includes("timeout")) {
      errorMessage = "Response mein delay ho raha hai ⏳ thoda wait karo!";
    }
    
    api.sendMessage(errorMessage, threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

// Dummy run function to register module
module.exports.run = () => {};
