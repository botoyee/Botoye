const cron = require("node-cron");
const fs = require("fs");
const moment = require("moment-timezone");
const path = require("path");

module.exports.config = {
  name: "autopoetry",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Modified by Ayan Ali",
  description: "Send a random poetry to all groups every 2 hours",
  commandCategory: "automation",
  usages: "",
  cooldowns: 0
};

module.exports.onLoad = function ({ api }) {
  cron.schedule("0 */2 * * *", async () => {
    try {
      const allThreads = global.data.allThreadID || [];
      const time = moment().tz("Asia/Kolkata").format("hh:mm A");

      const dataPath = path.join(__dirname, "poetry.json");
      const poetryData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

      if (!Array.isArray(poetryData) || poetryData.length === 0) return;

      const poetry = poetryData[Math.floor(Math.random() * poetryData.length)];
      const message = `🕰️ ${time} (India Time)\n\n📜 *Random Poetry*\n\n${poetry}`;

      for (const threadID of allThreads) {
        api.sendMessage(message, threadID);
      }

      console.log(`[✓] Poetry sent at ${time}`);
    } catch (e) {
      console.error("❌ Poetry Automation Error:", e);
    }
  });

  console.log("✅ AutoPoetry Scheduler Started (Every 2 Hours)");
};

module.exports.run = async () => {};
