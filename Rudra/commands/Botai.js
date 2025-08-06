const axios = require("axios");

module.exports.config = {
  name: "botai",
  version: "2.1.2",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Chat with Muskan (DeepSeek-V3 via OpenRouter)",
  commandCategory: "ai",
  usages: "Muskan kya haal hai",
  cooldowns: 5
};

const OPENROUTER_API_KEY = "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";
const DEEPSEEK_MODEL = "deepseek/deepseek-chat-v3-0324:free";
const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  const words = body?.trim().split(/\s+/);
  const firstWord = words[0]?.toLowerCase();
  const hasMoreThanOneWord = words.length > 1;

  const isCallingBot =
    (firstWord === "bot" || firstWord === "muskan") &&
    hasMoreThanOneWord;

  const isReplyToBot =
    messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!isCallingBot && !isReplyToBot) return;

  const userMessage = isCallingBot ? words.slice(1).join(" ") : body;
  const userId = senderID;

  if (!chatHistories[userId]) chatHistories[userId] = [];

  chatHistories[userId].push({ role: "user", content: userMessage });

  if (chatHistories[userId].length > 5) chatHistories[userId].shift();

  const messages = [
    {
      role: "system",
      content: `Tumhara naam Muskan hai, tum ek Filerty larki ho , har messeage ka jawab 1 line me do ziyada bolny ki zarorat nhi ha sab se friendly baat kro agr koi pochy tumehn kis ne banaya hai to kehna mujy Kashif Raza ne banaya , Tum sab se Roman Urdu me baat kro gi hindi me baat nhi kro gi let's chat now`
    },
    ...chatHistories[userId]
  ];

  api.setMessageReaction("⏳", messageID, () => {}, true);
  const start = Date.now();

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: DEEPSEEK_MODEL,
        messages,
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://your-kashif-chat.com",
          "X-Title": "MuskanAI"
        },
        timeout: 20000
      }
    );

    const reply = response.data.choices[0]?.message?.content || "😒";

    chatHistories[userId].push({ role: "assistant", content: reply });

    await api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);

    const duration = (Date.now() - start) / 1000;
    console.log(`🕒 Muskan replied in ${duration}s`);

  } catch (error) {
    console.error("❌ Muskan AI Error:", error.response?.data || error.message);

    let errorMsg = "Mood off ha baat nhi kro gi me jao 🥺";

    if (error.response?.status === 429) {
      errorMsg = "🙄";
    } else if (error.code === "ECONNABORTED") {
      errorMsg = "Internet slow lag raha hai... zara check karo! 🌐";
    }

    await api.sendMessage(errorMsg, threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = () => {};
