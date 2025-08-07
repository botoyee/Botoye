const fs = require("fs");
const path = require("path");

// Correct path for your Rudra project
const approvedFile = path.join(__dirname, "./Priyanshu/approvedThreads.json");
const pendingFile = path.join(__dirname, "./Priyanshu/pendingThreads.json");

module.exports = {
  config: {
    name: "approve",
    version: "1.0",
    author: "Kashif Raza",
    role: 2, // admin only
    shortDescription: "Approve a group for bot",
    longDescription: "Allow the bot to run in this group",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ message, event }) {
    const threadID = event.threadID;
    const approved = JSON.parse(fs.readFileSync(approvedFile));
    const pending = JSON.parse(fs.readFileSync(pendingFile));

    if (approved.includes(threadID)) {
      return message.reply("✅ This group is already approved.");
    }

    approved.push(threadID);
    fs.writeFileSync(approvedFile, JSON.stringify(approved, null, 2));

    const index = pending.indexOf(threadID);
    if (index !== -1) {
      pending.splice(index, 1);
      fs.writeFileSync(pendingFile, JSON.stringify(pending, null, 2));
    }

    return message.reply("✅ This group has been approved successfully.");
  }
};
