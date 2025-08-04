const lockedNames = {};

module.exports = {
  config: {
    name: "lockname",
    version: "1.0",
    hasPermssion: 1,
    credits: "Rudra",
    description: "Lock group name",
    commandCategory: "admin",
    usages: "[group name]",
    cooldowns: 5
  },

  run: async function({ api, event, args }) {
    const threadID = event.threadID;
    const nameToLock = args.join(" ");
    lockedNames[threadID] = nameToLock;
    return api.sendMessage(`🔒 Group name locked to: ${nameToLock}`, threadID);
  },

  lockedNames // <-- export it here
};
