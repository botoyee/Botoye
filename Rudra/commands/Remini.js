const axios = require("axios");
const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "remini",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Modified by GPT",
  description: "Enhance image using AI (Remini style)",
  commandCategory: "tools",
  usages: "reply to an image",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { messageReply, threadID, messageID } = event;

  // Check if image is replied
  if (!messageReply || !messageReply.attachments[0] || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("⚠️ Please reply to an image to enhance it.", threadID, messageID);
  }

  const imageUrl = messageReply.attachments[0].url;

  try {
    const response = await axios.get(`https://api.princetechn.com/api/tools/remini`, {
      params: {
        apikey: "prince",
        url: imageUrl
      },
      responseType: "stream"
    });

    // Save to temp file and send
    const path = __dirname + `/temp_${Date.now()}.jpg`;
    const writer = fs.createWriteStream(path);

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: "✨ Here's your enhanced image!",
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Failed to enhance image. Try again later.", threadID, messageID);
  }
};
