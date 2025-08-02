const axios = require("axios");
const fs = require("fs");

const userHistoryPath = __dirname + "/cbot_history.json";
if (!fs.existsSync(userHistoryPath)) fs.writeFileSync(userHistoryPath, "{}");

module.exports = {
  config: {
    name: "muskan",
    version: "1.0",
    hasPermssion: 0,
    credits: "Fixed by ChatGPT",
    description: "Chat with Muskan (AI)",
    commandCategory: "ai",
    usages: "Just say Muskan and talk",
    cooldowns: 1,
  },

  handleEvent: async function ({ api, event }) {
    const content = event.body?.toLowerCase();
    if (!content || !content.startsWith("muskan")) return;

    const message = content.replace(/^muskan[:,]?\s*/i, "");
    if (!message) return api.sendMessage("👀 | Haan bolo?", event.threadID);

    const uid = event.senderID;
    let history = JSON.parse(fs.readFileSync(userHistoryPath));
    if (!history[uid]) history[uid] = [];
    history[uid].push(message);
    if (history[uid].length > 3) history[uid].shift();

    const fullPrompt = history[uid].join("\n");

    try {
      const res = await axios.get(`https://shadowscriptz.xyz/shadowapisv4/chatbot_api.php?prompt=${encodeURIComponent(fullPrompt)}`);
      const reply = res.data.reply || "😅 | Kuch samajh nahi aaya.";

      api.sendMessage(`🗣️ Muskan: ${reply}`, event.threadID, (err, info) => {
        if (!err) {
          history[uid]._lastBotMsg = info.messageID;
          fs.writeFileSync(userHistoryPath, JSON.stringify(history, null, 2));
        }
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ | Muskan busy hai, baad me try karo.", event.threadID);
    }
  }
};
