module.exports.handleEvent = async function ({ api, event, Users }) {
  const { logMessageType, senderID, threadID } = event;

  // Call started
  if (logMessageType === "log:thread-call") {
    const name = await Users.getNameUser(senderID);
    return api.sendMessage(`📞 ${name} started an audio call`, threadID);
  }

  // User joined the call
  if (logMessageType === "log:thread-call-add-participant") {
    const name = await Users.getNameUser(senderID);
    return api.sendMessage(`🤙 ${name} joined the call`, threadID);
  }
};

module.exports.config = {
  name: "callEvent",
  eventType: ["log:thread-call", "log:thread-call-add-participant"]
};
