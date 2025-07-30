const fs = require("fs");

module.exports.config = {
  name: "mehruTag",
  version: "1.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Sends a beautiful message when Mehru is mentioned",
  commandCategory: "auto-response",
  usages: "auto",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const { mentions, threadID } = event;

  if (!mentions) return;

  const triggerNames = ["mehru", "@gemini ♊♏🦋", "@meher mehruu"];

  for (let tag in mentions) {
    const name = mentions[tag].toLowerCase();
    if (triggerNames.some(trigger => name.includes(trigger.toLowerCase()))) {
      const msg = `🌸✨ *Mehru* detected!\nEk nazar mein dil le jane wali 😍\nSab ki jaan, sab ki shaan 💖`;

      const attachment = fs.createReadStream(__dirname + "/noprefix/mehru.jpg");

      return api.sendMessage(
        { body: msg, attachment },
        threadID
      );
    }
  }
};

module.exports.run = () => {};