module.exports.config = {
  name: "callEvent",
  eventType: ["log:thread-call", "log:thread-call-add-member"],
  version: "1.1",
  credits: "Kashif x ChatGPT"
};

module.exports.run = async function ({ api, event }) {
  const { logMessageType, logMessageData, author, threadID } = event;

  try {
    // Call Start (Audio or Video)
    if (logMessageType === "log:thread-call" && logMessageData.event === "call_started") {
      const userInfo = await api.getUserInfo(author);
      const userName = userInfo[author]?.name || "Someone";
      const callType = logMessageData.video ? "📹 video call" : "📞 audio call";
      return api.sendMessage(`${userName} started a ${callType}`, threadID);
    }

    // Member joined call
    if (logMessageType === "log:thread-call-add-member") {
      const joiningID = logMessageData.participant_id;
      const userInfo = await api.getUserInfo(joiningID);
      const userName = userInfo[joiningID]?.name || "Someone";
      return api.sendMessage(`${userName} joined the call 🤙`, threadID);
    }

  } catch (err) {
    console.error("Call event error:", err);
  }
};
