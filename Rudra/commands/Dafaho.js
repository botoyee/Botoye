const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "dafaho", // 👈 Yahan tarja ko rename kiya
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Ayan Kashif",
  description: "Push message/media silently to all threads",
  commandCategory: "Admin",
  usages: "[reply to media/text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const allThread = global.data.allThreadID || [];
  const { threadID, messageID, messageReply } = event;

  if (!messageReply) return api.sendMessage("⚠️ Pehle kisi message ya media pe reply karo!", threadID, messageID);

  let msgData = {};
  const isMedia = messageReply.attachments && messageReply.attachments.length > 0;

  if (isMedia) {
    const url = messageReply.attachments[0].url;
    const ext = url.substring(url.lastIndexOf(".") + 1);
    const path = __dirname + `/cache/dafaho_file.${ext}`;
    const data = (await axios.get(url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    msgData.attachment = fs.createReadStream(path);
  } else if (messageReply.body) {
    msgData.body = messageReply.body;
  } else {
    return api.sendMessage("⚠️ Reply message khali hai!", threadID, messageID);
  }

  let sent = 0, failed = 0;
  for (const id of allThread) {
    if (id != threadID && !isNaN(parseInt(id))) {
      try {
        await api.sendMessage(msgData, id);
        sent++;
        await new Promise(r => setTimeout(r, 500));
      } catch {
        failed++;
      }
    }
  }

  return api.sendMessage(
    `✅ Dafa diya gaya hai ${sent} groups mein!${failed ? ` ❌ Fail: ${failed}` : ""}`,
    threadID,
    messageID
  );
};
