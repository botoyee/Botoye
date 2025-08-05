module.exports.config = {
  name: "autoOwnerAdd",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Kashif",
  description: "Automatically adds owner to any group where bot is added",
  commandCategory: "system",
  usages: "Auto add owner to group",
  cooldowns: 1,
  listenEvents: true
};

const OWNER_ID = "100001854531633"; // 👑 Replace this if needed

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, logMessageType } = event;

  // Only run on member added event (including bot)
  if (logMessageType !== "log:subscribe") return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);

    // Check if owner is already in the group
    if (!threadInfo.participantIDs.includes(OWNER_ID)) {
      await api.addUserToGroup(OWNER_ID, threadID);
      await api.sendMessage("👑 Owner has been automatically added to this group.", threadID);
    }
  } catch (err) {
    console.error("❌ Error auto-adding owner:", err);
  }
};

module.exports.run = () => {}; // Required empty run function
