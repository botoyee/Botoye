module.exports.config = {
  name: "callevent",
  eventType: ["log:thread-call", "log:generic"],
  version: "1.0",
  credits: "ChatGPT",
  description: "Notifies when a call is started or someone joins a call"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageType, logMessageBody, author } = event;

  // Get user info
  const userInfo = await api.getUserInfo(author);
  const senderName = userInfo[author]?.name || "Someone";

  // Detect when a call is started (audio or video)
  if (logMessageType === "log:thread-call") {
    if (logMessageBody?.includes("started an audio call")) {
      return api.sendMessage(`📞 ${senderName} started an audio call!`, threadID);
    }

    if (logMessageBody?.includes("started a video chat")) {
      return api.sendMessage(`🎥 ${senderName} started a video call!`, threadID);
    }
  }

  // Detect when someone joins the call
  if (logMessageType === "log:generic") {
    if (logMessageBody?.includes("joined the call")) {
      return api.sendMessage(`🤙 ${senderName} joined the call!`, threadID);
    }
  }
};
