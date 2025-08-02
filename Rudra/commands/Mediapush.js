const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "mediapush",
  version: "1.0.0",
  hasPermssion: 2, // admin only
  credits: "Kashif",
  description: "Send media to all groups",
  commandCategory: "admin",
  usages: "[Reply to media]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  try {
    const { messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("❌ | Reply karo kisi media (image, video, voice) par to push it.", event.threadID, event.messageID);
    }

    const attachment = messageReply.attachments[0];
    const ext = getExtension(attachment.type);
    const url = attachment.url;

    if (!ext || !url) {
      return api.sendMessage("⚠️ | Unsupported attachment type.", event.threadID, event.messageID);
    }

    const fileName = `media_${event.senderID}.${ext}`;
    const filePath = path.resolve(__dirname, "cache", fileName);

    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const allThreads = global.data.allThreadID || [];
    let success = 0, failed = 0;

    for (const threadID of allThreads) {
      try {
        await api.sendMessage({
          body: `📤 | Admin sent a media file`,
          attachment: fs.createReadStream(filePath)
        }, threadID);
        success++;
      } catch (e) {
        failed++;
      }
    }

    fs.unlinkSync(filePath);

    return api.sendMessage(`✅ | Media sent to ${success} groups.\n❌ | Failed in ${failed} groups.`, event.threadID, event.messageID);
  } catch (err) {
    console.error("[ mediapush ERROR ]", err);
    return api.sendMessage("🚫 | Error sending media to groups.", event.threadID, event.messageID);
  }
};

function getExtension(type) {
  switch (type) {
    case "photo": return "jpg";
    case "video": return "mp4";
    case "audio": return "mp3";
    case "animated_image": return "gif";
    default: return null;
  }
}
