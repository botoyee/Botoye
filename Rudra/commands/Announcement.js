const fs = require("fs");

module.exports.config = {
  name: "announcement",
  version: "1.0.0",
  hasPermssion: 2, // only bot admin/owner
  credits: "Kashif Raza (Ayan Ali)",
  description: "Send a message to all groups",
  commandCategory: "system",
  usages: "/announcement [message]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const message = args.join(" ");
  const threadList = await api.getThreadList(100, null, ["INBOX"]);
  const groupIDs = threadList.filter(thread => thread.isGroup && thread.name != null).map(thread => thread.threadID);

  if (!message) return api.sendMessage("⚠️ Pehle announcement ka message likho!\nExample: /announcement Hello friends!", event.threadID);

  api.sendMessage(`📢 Announcement sending to ${groupIDs.length} groups...`, event.threadID);

  let success = 0, failed = 0;

  for (const id of groupIDs) {
    try {
      await api.sendMessage(`📣 اعلان:\n\n${message}`, id);
      success++;
    } catch (e) {
      failed++;
    }
  }

  return api.sendMessage(`✅ Announcement completed!\nSent: ${success} groups\n❌ Failed: ${failed}`, event.threadID);
};
