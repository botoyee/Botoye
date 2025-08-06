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

// ✅ OpenRouter API Configuration
const OPENROUTER_API_KEY = "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";
const DEEPSEEK_MODEL = "deepseek/deepseek-chat-v3-0324:free";

const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // ✅ Only respond if replying to bot (Muskan)
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userMessage = body;

  // Initialize history
  if (!chatHistories[senderID]) chatHistories[senderID] = [];

  // Add user message
  chatHistories[senderID].push({ role: "user", content: userMessage });

  // Limit context
  if (chatHistories[senderID].length > 5) chatHistories[senderID].shift();

  const messages = [
    {
      role: "system",
      content: `Tumhara naam Muskan hai , Sab se Roman Urdu mein baat karo Hindi me baat nhi kro, pyaar , masti mein filert kro.
Khud ko bot ya AI kabhi nahi bolo. Hamesha 1-2 lines ka funny ya sweet jawab do.
 insan ki tarh bat kro ai ki tarh nhi.`
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
          "HTTP-Referer": "https://your-kashif-chat.com", // optional
          "X-Title": "MuskanAI" // optional
        }
      }
    );

    const reply = response.data.choices[0]?.message?.content || 
                  "Umm... kuch samajh nahi aaya yaar 😅";

    chatHistories[senderID].push({ role: "assistant", content: reply });

    await api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (error) {
    console.error("Muskan AI Error:", error.response?.data || error.message);
    
    let errorMsg = "Mujhe lagta hai kuch gadbad ho gayi! 😢 Thoda wait karo...";

    if (error.response?.status === 429) {
      errorMsg = "Zyada messages bhej diye! Thoda break lo 😅";
    } else if (error.code === "ECONNABORTED") {
      errorMsg = "Internet slow lag raha hai... zara check karo! 🌐";
    }

    await api.sendMessage(errorMsg, threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = () => {};
