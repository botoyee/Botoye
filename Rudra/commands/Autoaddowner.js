const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports.config = {
  name: "owneradd",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "Ayan Ali",
  description: "Add owner to all groups where bot is present and owner is not.",
  commandCategory: "system",
  usages: "owneradd",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const ownerID = "100001854531633";
  const senderID = event.senderID;

  if (senderID !== ownerID) return api.sendMessage("Sirf owner hi ye command chala sakta hai!", event.threadID);

  try {
    const threads = await api.getThreadList(100, null, ["INBOX"]);
    let added = 0;

    for (const thread of threads) {
      const threadID = thread.threadID;

      try {
        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs.includes(ownerID)) {
          await api.addUserToGroup(ownerID, threadID);
          added++;
          await delay(2000); // 2 second delay per group to avoid spam block
        }
      } catch (err) {
        console.log(`❌ Group ${threadID} error: ${err.message}`);
        continue;
      }
    }

    return api.sendMessage(`✅ Owner added to ${added} group(s).`, event.threadID);

  } catch (err) {
    console.error("❌ Main Error:", err.message);
    return api.sendMessage("❌ Error while checking groups or adding owner. Check console.", event.threadID);
  }
};
