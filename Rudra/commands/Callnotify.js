const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "callnotifier",
    version: "1.0.0",
    credits: "Your Name",
    hasPermssion: 0,
    description: "Announces call starts and joins in group chat",
    commandCategory: "system",
    cooldowns: 5
  },
  
  onCall: async function({ api, event }) {
    try {
      const { threadID, isGroup, callStatus, participantIDs } = event;
      
      if (!isGroup) return; // Only work in group chats
      
      // Get sender info
      const senderInfo = await api.getUserInfo(event.author);
      const senderName = senderInfo[event.author]?.name || "Someone";
      
      // Get call participants names
      const participantsInfo = await api.getUserInfo(participantIDs);
      
      if (callStatus === "started") {
        // Call started notification
        api.sendMessage({
          body: `📞 ${senderName} started a ${event.isVideoCall ? "video" : "audio"} call`,
          mentions: [{
            tag: senderName,
            id: event.author
          }]
        }, threadID);
        
        // Log call start
        this.logCallEvent(threadID, 'started', event.author);
        
      } else if (callStatus === "joined") {
        // Participant joined notification
        const joinerName = participantsInfo[event.author]?.name || "Someone";
        
        api.sendMessage({
          body: `🤙 ${joinerName} joined the call`,
          mentions: [{
            tag: joinerName,
            id: event.author
          }]
        }, threadID);
        
        // Log call join
        this.logCallEvent(threadID, 'joined', event.author);
      }
      
    } catch (error) {
      console.error("CallNotifier error:", error);
    }
  },
  
  logCallEvent: function(threadID, eventType, userID) {
    const logPath = path.join(__dirname, 'call_logs.json');
    const logData = {
      timestamp: new Date().toISOString(),
      threadID,
      eventType,
      userID
    };
    
    // Read existing logs
    let logs = [];
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath));
    }
    
    // Add new log entry
    logs.push(logData);
    
    // Save logs
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  }
};
