const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "callnotifier",
    version: "1.1.0",
    credits: "Your Name",
    hasPermssion: 0,
    description: "Announces call starts and joins in group chat",
    commandCategory: "system",
    cooldowns: 3
  },

  handleEvent: async function({ api, event }) {
    try {
      // Only proceed if this is a call-related event in a group
      if (!event.isGroup || !event.hasOwnProperty('callStatus')) return;

      const { threadID, author, callStatus, isVideoCall, participantIDs } = event;
      
      // Get user info
      const userInfo = await api.getUserInfo(author);
      const userName = userInfo[author]?.name || "Someone";

      if (callStatus === "started") {
        // Call started notification
        api.sendMessage({
          body: `📞 ${userName} started a ${isVideoCall ? "video" : "audio"} call`,
          mentions: [{
            tag: userName,
            id: author
          }]
        }, threadID);

      } else if (callStatus === "joined") {
        // Call join notification
        api.sendMessage({
          body: `🤙 ${userName} joined the call`,
          mentions: [{
            tag: userName,
            id: author
          }]
        }, threadID);
      }

    } catch (error) {
      console.error("Call Notifier Error:", error);
    }
  },

  onStart: function() {
    // Initialization if needed
  }
};
