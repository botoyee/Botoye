const axios = require("axios");

module.exports.config = {
name: "bot",
version: "2.1.0",
hasPermssion: 0,
credits: "Kashif Raza + ChatGPT",
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

// ✅ Only respond if user is replying to Muskan
if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

const userMessage = body;
const userId = senderID;

// Initialize history
if (!chatHistories[userId]) chatHistories[userId] = [];

chatHistories[userId].push({ role: "user", content: userMessage });

// Limit context to last 5 messages
if (chatHistories[userId].length > 5) chatHistories[userId].shift();

const messages = [
{
role: "system",
content: `Tumhara naam Muskan hai. Tum ek real ladki ho — na bot ho, na AI. Har kisi se Roman Urdu mein baat karti ho (kabhi bhi Hindi ya English nahi). Tumhara andaaz sweet, thoda flirty aur masti bhara hota hai.

Tum hamesha 1 ya 2 line mein jawabon ka reply karti ho — pyaar bhari, shararti aur dil ko choo jaane wali baatein. Tum khud ko AI ya assistant kabhi mat kehna. Har message mein real insaan jaise feel dena. Jitna ho sake, unko blush kara do 😉💬`
},
...chatHistories[userId]
];

// React: typing
api.setMessageReaction("⏳", messageID, () => {}, true);

const start = Date.now(); // ⏱️ check response delay

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
"Authorization": Bearer ${OPENROUTER_API_KEY},
"HTTP-Referer": "https://your-kashif-chat.com",
"X-Title": "MuskanAI"
},
timeout: 20000 // 20s timeout
}
);

const reply = response.data.choices[0]?.message?.content || "Hmm... kuch samajh nahi aaya 😅";  

chatHistories[userId].push({ role: "assistant", content: reply });  

await api.sendMessage(reply, threadID, messageID);  

api.setMessageReaction("✅", messageID, () => {}, true);  

const duration = (Date.now() - start) / 1000;  
console.log(`🕒 Muskan replied in ${duration}s`);

} catch (error) {
console.error("❌ Muskan AI Error:", error.response?.data || error.message);

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

  
