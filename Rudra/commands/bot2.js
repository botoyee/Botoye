const axios = require("axios");
const fs = require("fs");

const userHistoryPath = __dirname + "/cbot_history.json";
if (!fs.existsSync(userHistoryPath)) fs.writeFileSync(userHistoryPath, "{}");

module.exports = {
  config: {
    name: "anjum",
    version: "1.0",
    hasPermssion: 0,
    credits: "Mirrykal",
    description: "Talk with Shadow AI (memory of last 3 msgs)",
    commandCategory: "ai",
    usages: "Annu <message>",
    cooldowns: 2,
  },

  run: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("❌ | Please enter a message to talk with Shadow AI.", event.threadID, event.messageID);

    const uid = event.senderID;
    let history = JSON.parse(fs.readFileSync(userHistoryPath));

    // Initialize or update message history
    if (!history[uid]) history[uid] = [];
    history[uid].push(prompt);
    if (history[uid].length > 3) history[uid].shift(); // keep only last 3

    // Combine previous messages
    const fullPrompt = history[uid].join("\n");

    try {
      const res = await axios.get(https://shadowscriptz.xyz/shadowapisv4/chatbot_api.php?prompt=${encodeURIComponent(fullPrompt)});
      const reply = res.data.reply || "⚠️ Sorry, I couldn't understand that.";

      api.sendMessage(🤖: ${reply}, event.threadID, (err, msgInfo) => {
        if (!err) {
          // Save message ID to continue on replies
          history[uid]._lastBotMsg = msgInfo.messageID;
          fs.writeFileSync(userHistoryPath, JSON.stringify(history, null, 2));
        }
      });
    } catch (e) {
      console.error(e);
      api.sendMessage("⚠️ API error, please try again later.", event.threadID, event.messageID);
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    const uid = event.senderID;
    let history = JSON.parse(fs.readFileSync(userHistoryPath));

    if (!history[uid]) return;

    // Add user reply
    history[uid].push(event.body);
    if (history[uid].length > 3) history[uid].shift();

    const fullPrompt = history[uid].join("\n");

    try {
      const res = await axios.get(https://shadowscriptz.xyz/shadowapisv4/chatbot_api.php?prompt=${encodeURIComponent(fullPrompt)});
      const reply = res.data.reply || "⚠️ Sorry, couldn't respond.";

      api.sendMessage(💬: ${reply}, event.threadID, (err, msgInfo) => {
        if (!err) {
          history[uid]._lastBotMsg = msgInfo.messageID;
          fs.writeFileSync(userHistoryPath, JSON.stringify(history, null, 2));
        }
      });
    } catch (e) {
      console.error(e);
      api.sendMessage("⚠️ API Error during reply.", event.threadID, event.messageID);
    }
  }
};
