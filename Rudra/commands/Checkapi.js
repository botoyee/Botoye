const axios = require("axios");

module.exports.config = {
  name: "checkapi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Check API health and see response",
  commandCategory: "system",
  usages: "checkapi <url>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("❌ Please provide an API URL.\nExample: checkapi https://api.princetechn.com/api/search/tiktoksearch?apikey=prince&query=test", threadID, messageID);
  }

  const url = args.join(" ").trim();

  try {
    const res = await axios.get(url);

    const status = res.status;
    const data = res.data;

    let message = `✅ API Status: ${status}\n`;

    if (data.success !== undefined) message += `🔹 Success: ${data.success}\n`;
    if (data.message) message += `💬 Message: ${data.message}\n`;
    if (data.results) {
      if (typeof data.results === "object") {
        const keys = Object.keys(data.results).slice(0, 5); // first 5 keys
        message += `📦 Results Keys: ${keys.join(", ")}\n`;
      } else {
        message += `📦 Results: ${data.results.toString().slice(0, 100)}...\n`;
      }
    }

    return api.sendMessage(message, threadID, messageID);
  } catch (err) {
    console.error("API Check Failed:", err.message);
    return api.sendMessage(`❌ Failed to reach API.\nError: ${err.message}`, threadID, messageID);
  }
};
