const OWNER_UID = "100001854531633";

module.exports.config = {
  name: "addowner",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Ayan Ali",
  description: "Add bot owner to all groups",
  commandCategory: "system",
  usages: "[admin only]",
  cooldowns: 5,
};

module.exports.run = async ({ api, args }) => {
  const allThreads = await api.getThreadList(100, 2); // Only group threads
  let success = 0, fail = 0;

  for (const thread of allThreads) {
    if (thread.isGroup) {
      try {
        await api.addUserToGroup(OWNER_UID, thread.threadID);
        success++;
      } catch (e) {
        fail++;
      }
    }
  }

  return api.sendMessage(`✅ Owner add ho gaya ${success} groups mein.\n❌ Fail hua ${fail} groups mein.`, args[0]);
};
