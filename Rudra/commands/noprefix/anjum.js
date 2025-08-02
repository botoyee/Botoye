const axios = require("axios");
const fs = require("fs");

const userHistoryPath = __dirname + "/cbot_history.json";
if (!fs.existsSync(userHistoryPath)) fs.writeFileSync(userHistoryPath, "{}");

module.exports = {
  config: {
    name: "muskan",
    version: "1.1",
    hasPermission: 0,
    credits: "Fixed by ChatGPT",
    description: "Talk to Muskan without prefix",
    commandCategory: "noprefix",
    usages: "Muskan [your message]",
    cooldowns: 1,
  },

  handleEvent: async function ({ api, event }) {
    if (!event.body) return;

    const body = event.body.toLowerCase();

    // Only respond if message starts with "muskan"
    if (!body.startsWith("muskan")) return;

    const uid = event.senderID;
    const msg = event.body.substring(6).trim(); // remove "muskan"

    if (!msg) {
      return api.sendMessage("👋 Haan bolo, Muskan sun rahi hai!", event.threadID);
    }

    // Load or initialize history
    let history = {};
    try {
      history = JSON.parse(fs.readFileSync(userHistoryPath));
    } catch (e) {
      history = {};
    }

    if (!history[uid]) history[uid] = [];

    history[uid].push(msg);
    if (history[uid].length > 3) history[uid].shift();

    const fullPrompt = history[uid].join("\n");

    try {
      const res = await axios.get(`https://shadowscriptz.xyz/shadowapisv4/chatbot_api.php?prompt=${encodeURIComponent(fullPrompt)}`);
      const reply = res.data.reply || "😕 Muskan ko samajh nahi aaya.";

      api.sendMessage(`🧕 Muskan: ${reply}`, event.threadID, event.messageID);
      fs.writeFileSync(userHistoryPath, JSON.stringify(history, null, 2));
    } catch (err) {
      console.error("API Error:", err);
      api.sendMessage("⚠️ Muskan kuch der ke liye offline hai, baad me try karo.", event.threadID);
    }
  },

  // Disable `run`, since it's a noprefix handler
  run: () => {}
};
