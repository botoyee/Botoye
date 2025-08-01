const fs = require("fs");

module.exports.config = {
  name: "stickerid",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Reply with sticker ID when someone sends sticker",
  commandCategory: "utility",
  usages: "Auto detect sticker and reply with ID",
  cooldowns: 1
};

module.exports.handleEvent = async function({ event, api }) {
  const { attachments, threadID, messageID, senderID } = event;

  if (!attachments || attachments.length === 0) return;

  const sticker = attachments.find(att => att.type === "sticker");
  if (!sticker) return;

  const stickerID = sticker.ID || sticker.stickerID || sticker.id;
  if (!stickerID) return;

  const reply = `🤖 Sticker ID: ${stickerID}`;
  return api.sendMessage(reply, threadID, messageID);
};

module.exports.run = () => {};
