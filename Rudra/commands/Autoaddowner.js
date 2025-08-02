const OWNER_UID = "100001854531633";

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType === "log:subscribe") {
    const threadID = event.threadID;

    try {
      await api.addUserToGroup(OWNER_UID, threadID);
      console.log(`✅ Owner added to group: ${threadID}`);
    } catch (err) {
      console.log(`❌ Owner add fail: ${threadID}`);
    }
  }
};
