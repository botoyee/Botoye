const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "saveStickerId",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Save sticker ID to noprefix folder on sticker message",
  commandCategory: "tools",
  usages: "auto",
  cooldowns: 1,
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, attachments, senderID } = event;

  if (!attachments || attachments[0]?.type !== "sticker") return;

  const stickerID = attachments[0]?.ID;

  if (!stickerID) return;

  const dir = path.join(__dirname, "noprefix");
  const filePath = path.join(dir, "sticker_ids.txt");

  // Create noprefix directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const entry = `Thread: ${threadID} | Sender: ${senderID} | StickerID: ${stickerID}\n`;

  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error("❌ Failed to save sticker ID:", err);
    } else {
      console.log("✅ Sticker ID saved:", stickerID);
    }
  });
};

module.exports.run = () => {};
