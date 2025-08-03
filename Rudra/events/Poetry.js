const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "poetry",
  version: "1.0.0",
  credits: "Kashif x Ayan",
  description: "Send random Urdu poetry every 2 hours while bot is running",
};

let interval = null;

module.exports.onLoad = ({ api }) => {
  const poetryPath = path.join(__dirname, "../commands/noprefix/poetry.json");
  let poetries = [];

  try {
    poetries = JSON.parse(fs.readFileSync(poetryPath, "utf-8"));
  } catch (e) {
    console.error("❌ poetry.json not found or invalid:", e);
    return;
  }

  function sendPoetry() {
    if (poetries.length === 0) return;

    const msg = `📝 *Poetry Time!*\n\n${poetries[Math.floor(Math.random() * poetries.length)]}`;

    api.getThreadList(100, null, ["INBOX"]).then(threads => {
      threads.forEach(thread => {
        api.sendMessage(msg, thread.threadID);
      });
      console.log("✅ Poetry sent to all groups");
    });
  }

  // Clear old interval if exists
  if (interval) clearInterval(interval);
  interval = setInterval(sendPoetry, 1000 * 60 * 60 * 2); // 2 hours
};
