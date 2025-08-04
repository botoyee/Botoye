
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "dafaho",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
  description: "Push message/media silently to all threads",
  commandCategory: "Admin",
  usages: "[reply to media/text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const allThread = global.data.allThreadID || [];
  const { threadID, messageID, messageReply, senderID } = event;

  // Check if user is admin
  if (!global.config.ADMINBOT.includes(senderID)) {
    return api.sendMessage("⚠️ Only admins can use this command!", threadID, messageID);
  }

  if (!messageReply) return api.sendMessage("⚠️ Pehle kisi message ya media pe reply karo!", threadID, messageID);

  let msgData = {};
  const isMedia = messageReply.attachments && messageReply.attachments.length > 0;

  // Send processing message
  api.sendMessage("🔄 Broadcasting message to all groups, please wait...", threadID, messageID);

  if (isMedia) {
    try {
      const url = messageReply.attachments[0].url;
      const ext = url.substring(url.lastIndexOf(".") + 1);
      const path = __dirname + `/cache/dafaho_file_${Date.now()}.${ext}`;
      
      const response = await axios.get(url, { 
        responseType: "arraybuffer",
        timeout: 30000 
      });
      
      fs.writeFileSync(path, Buffer.from(response.data));
      msgData.attachment = path; // Store path instead of stream
      
    } catch (error) {
      console.error("Error downloading media:", error);
      return api.sendMessage("❌ Failed to download media for broadcasting!", threadID, messageID);
    }
  } else if (messageReply.body) {
    msgData.body = messageReply.body;
  } else {
    return api.sendMessage("⚠️ Reply message khali hai!", threadID, messageID);
  }

  let sent = 0, failed = 0;
  
  for (const id of allThread) {
    if (id != threadID && !isNaN(parseInt(id))) {
      try {
        // Create fresh attachment stream for each send if media
        let sendData = {};
        if (isMedia && msgData.attachment) {
          const url = messageReply.attachments[0].url;
          const ext = url.substring(url.lastIndexOf(".") + 1);
          const tempPath = __dirname + `/cache/temp_${Date.now()}_${id}.${ext}`;
          
          const response = await axios.get(url, { 
            responseType: "arraybuffer",
            timeout: 30000 
          });
          
          fs.writeFileSync(tempPath, Buffer.from(response.data));
          sendData.attachment = fs.createReadStream(tempPath);
          
          // Send and cleanup immediately
          await api.sendMessage(sendData, id);
          
          // Delete temp file
          setTimeout(() => {
            try {
              fs.unlinkSync(tempPath);
            } catch (err) {}
          }, 5000);
        } else {
          sendData.body = msgData.body;
          await api.sendMessage(sendData, id);
        }
        
        sent++;
        // Increased delay to prevent rate limiting
        await new Promise(r => setTimeout(r, 1500));
      } catch (error) {
        failed++;
        console.log(`Failed to send to thread ${id}:`, error.message);
      }
    }
  }

  return api.sendMessage(
    `✅ Dafa diya gaya hai ${sent} groups mein!${failed ? ` ❌ Fail: ${failed}` : ""}\n📊 Total threads: ${allThread.length - 1}`,
    threadID,
    messageID
  );
};
