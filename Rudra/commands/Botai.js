const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Chat with Muskan (DeepSeek-V3 via OpenRouter)",
  commandCategory: "ai",
  usages: "Reply to Muskan's message",
  cooldowns: 5
};

// OpenRouter API Configuration (DeepSeek-V3)
const OPENROUTER_API_KEY = "your-api-key-here"; // 🔴 Replace with your OpenRouter key!
const DEEPSEEK_MODEL = "deepseek/deepseek-chat-v3-0324:free";

const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Only respond if the message is a reply to Muskan (the bot)
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userMessage = body;

  // Initialize chat history if not exists
  if (!chatHistories[senderID]) {
    chatHistories[senderID] = [];
  }

  // Add user message to history
  chatHistories[senderID].push({ role: "user", content: userMessage });

  // Keep only the last 5 messages (to avoid long context)
  if (chatHistories[senderID].length > 5) {
    chatHistories[senderID].shift();
  }

  // Prepare the AI's personality & conversation history
  const messages = [
    {
      role: "system",
      content: `You are Muskan, a friendly AI created by Kashif Raza. Follow these rules:
      - Always reply in Roman Urdu (no English unless needed)
      - Keep responses short (1-2 lines max)
      - Be playful, sweet, and funny 😊
      - Never say you're an AI or bot
      - Use emojis sometimes (but not too much)`
    },
    ...chatHistories[senderID]
  ];

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: DEEPSEEK_MODEL,
        messages: messages,
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://www.your-site.com", // Optional (for OpenRouter stats)
          "X-Title": "Muskan AI Bot" // Optional (for OpenRouter stats)
        }
      }
    );

    const reply = response.data.choices[0]?.message?.content || 
                  "Oops! Mein thori confused hoon, phir try karo? 😅";

    // Save AI's reply to chat history
    chatHistories[senderID].push({ role: "assistant", content: reply });

    await api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (error) {
    console.error("Muskan AI Error:", error.response?.data || error.message);
    
    let errorMsg = "Mujhe lagta hai kuch gadbad ho gayi! 😢 Thoda wait karo...";
    
    if (error.response?.status === 429) {
      errorMsg = "Too many requests! Thoda slow karo, baad mein try karna 😅";
    } else if (error.code === "ECONNABORTED") {
      errorMsg = "Server ne reply nahi diya... Internet check karo! 🌐";
    }

    await api.sendMessage(errorMsg, threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = () => {};
