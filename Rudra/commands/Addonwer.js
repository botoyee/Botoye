module.exports.config = {
  name: "owneradd",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Ayan Ali",
  description: "Adds owner to all groups where bot is present but owner is not.",
  commandCategory: "system",
  usages: "owneradd",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const ownerID = "100001854531633"; // your owner UID
  const senderID = event.senderID;

  if (senderID !== ownerID) return api.sendMessage("Sirf owner hi ye command chala sakta hai!", event.threadID);

  try {
    const allThreads = await api.getThreadList(100, 1); // Get last 100 groups (you can increase)
    let addedCount = 0;

    for (const thread of allThreads) {
      const threadID = thread.threadID;

      try {
        const info = await api.getThreadInfo(threadID);
        const alreadyAdded = info.participantIDs.includes(ownerID);

        if (!alreadyAdded) {
          await api.addUserToGroup(ownerID, threadID);
          addedCount++;
        }
      } catch (err) {
        console.log(`❌ Error in thread ${threadID}:`, err.message);
        // continue to next thread
      }
    }

    return api.sendMessage(`✅ Done! Owner added to ${addedCount} group(s).`, event.threadID);

  } catch (err) {
    console.error("❌ Main Error:", err.message);
    return api.sendMessage("❌ Error while checking groups or adding owner. Check console for details.", event.threadID);
  }
};
