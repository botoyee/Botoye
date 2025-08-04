const axios = require("axios");

let autoReply = true;
let history = [];

const prompt = `Tum Shizuka ho , koi pochy tumhen kis ne banaya ha to kehna mujhy Kashif Raza ne banaya hai , tum sirf roman urdu me baat kro gi , fun masti or flirt kro gi`;

module.exports = {
  config: {
    name: "shizuka",
    version: "1.0",
    author: "Kashif Raza",
    countDown: 0,
    role: 0,
    shortDescription: "Romantic chatbot",
    longDescription: "Shizuka: Flirty Roman Urdu chatbot with context",
    category: "no prefix",
    guide: {
      en: "Type anything romantic/fun, or use: shizuka on/off"
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, api }) {
    const msg = event.body;
    if (!msg || !autoReply || msg.length < 3) return;

    history.push({ role: "user", content: msg });
    if (history.length > 3) history.shift();

    const context = history.map(entry => `${entry.role === "user" ? "User" : "Shizuka"}: ${entry.content}`).join("\n");
    const finalPrompt = `${prompt}\n${context}\nShizuka:`;

    try {
      const res = await axios.get(`https://api.princetechn.com/api/ai/gpt4o?apikey=prince&q=${encodeURIComponent(finalPrompt)}`);
      const reply = res.data.message || res.data.reply || "😽 Janu abhi mood nahi hai";

      history.push({ role: "assistant", content: reply });
      if (history.length > 3) history.shift();

      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (err) {
      console.log("❌ Error:", err);
      api.sendMessage("Oops janu, kuch masla ho gaya 😿", event.threadID);
    }
  },

  onCommand: async function ({ message, args }) {
    const cmd = args[0]?.toLowerCase();
    if (cmd === "on") {
      autoReply = true;
      return message.reply("💖 Shizuka ab active hai — flirt mode ON!");
    } else if (cmd === "off") {
      autoReply = false;
      return message.reply("😴 Shizuka ab chup ho gayi — flirt mode OFF!");
    } else {
      return message.reply("⚙️ Use: `shizuka on` ya `shizuka off` to control flirt mode.");
    }
  }
};
