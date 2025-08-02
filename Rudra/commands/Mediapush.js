const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "mediapush",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Ayan x Kashif",
  description: "Send attached media to all groups",
  commandCategory: "admin",
  usages: "[Attach media]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const { messageReply, threadID, messageID } = event;

  // Step 1: Validate media
  const attachments = messageReply?.attachments;
  if (!attachments || attachments.length === 0) {
    return api.sendMessage("❌ | Reply kisi image/video/audio pe karo jise sab groups me bhejna hai.", threadID, messageID);
  }

  const attachment = attachments[0];
  const url = attachment.url;
  const ext = path.extname(url.split("?")[0]).split(".").pop() || "tmp";
  const fileName = `mediapush_${Date.now()}.${ext}`;
  const filePath = path.join(__dirname, "cache", fileName);

  try {
    // Step 2: Download file
    const response = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Step 3: Send to all groups
    const allThreads = global.data.allThreadID || [];
    let success = 0, failed = 0;

    for (const id of allThreads) {
      try {
        await api.sendMessage(
          { body: "📤 | Media Push", attachment: fs.createReadStream(filePath) },
          id
        );
        success++;
      } catch (e) {
        failed++;
      }
    }

    fs.unlinkSync(filePath);

    return api.sendMessage(
      `✅ | Media sent to ${success} groups.\n❌ | Failed in ${failed} groups.`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error("[ mediapush ERROR ]", err);
    return api.sendMessage("🚫 | File download ya broadcast me error aya.", threadID, messageID);
  }
};
