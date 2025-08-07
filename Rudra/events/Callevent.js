module.exports = async function callNotifier({ api, event, Users }) {
  const { logMessageType, logMessageData, threadID } = event;

  // 1. Call Started
  if (logMessageType === "log:thread-call") {
    const initiatorID = logMessageData.initiator;
    const userName = await Users.getNameUser(initiatorID) || "Someone";
    const callType = logMessageData.video === true ? "📹 video call" : "🎧 audio call";

    api.sendMessage(
      `📞 ${userName} started a ${callType}!`,
      threadID
    );
  }

  // 2. User Joined Call
  else if (logMessageType === "log:thread-call-participant-join") {
    const joinerID = logMessageData.participant_id;
    const userName = await Users.getNameUser(joinerID) || "Someone";

    api.sendMessage(
      `👤 ${userName} joined the call.`,
      threadID
    );
  }

  // 3. Call Ended (optional)
  else if (logMessageType === "log:thread-call-ended") {
    api.sendMessage(`📴 Call ended.`, threadID);
  }
};
