
const axios = require("axios");
const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "remini",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
  description: "Enhance image using AI (Remini style)",
  commandCategory: "tools",
  usages: "reply to an image",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { messageReply, threadID, messageID } = event;

  // Check if image is replied
  if (!messageReply || !messageReply.attachments || !messageReply.attachments[0] || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("⚠️ Please reply to an image to enhance it.", threadID, messageID);
  }

  const imageUrl = messageReply.attachments[0].url;

  // Send processing message
  api.sendMessage("🔄 Processing your image, please wait...", threadID, messageID);

  try {
    const response = await axios.get(`https://api.princetechn.com/api/tools/remini`, {
      params: {
        apikey: "prince",
        url: imageUrl
      },
      responseType: "stream",
      timeout: 30000 // 30 second timeout
    });

    // Save to temp file and send
    const path = __dirname + `/cache/remini_${Date.now()}.jpg`;
    const writer = fs.createWriteStream(path);

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: "✨ Here's your enhanced image!",
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        // Clean up temp file
        try {
          fs.unlinkSync(path);
        } catch (err) {
          console.log("Failed to delete temp file:", err);
        }
      }, messageID);
    });

    writer.on("error", (err) => {
      console.error("Stream write error:", err);
      api.sendMessage("❌ Failed to save enhanced image. Try again later.", threadID, messageID);
    });

  } catch (err) {
    console.error("Remini API error:", err);
    if (err.code === "ECONNABORTED") {
      return api.sendMessage("⏰ Request timed out. The image might be too large or the service is slow.", threadID, messageID);
    }
    return api.sendMessage("❌ Failed to enhance image. The API might be unavailable.", threadID, messageID);
  }
};
