module.exports.config = {
  name: "autolovesticker",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Auto reply with Messenger loving stickers on 'bot'",
  commandCategory: "auto",
  usages: "Auto-sticker reply",
  cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body || body.toLowerCase().trim() !== "bot") return;

  // Stickers from Piyomaru Playground, QooBee Gets Funny, Milk & Mocha: Cutest!
  const stickers = [
    // Piyomaru Playground
    "7533460264934895089",
    "7533459305567939100",
    "7533460316293063094",
    // QooBee Gets Funny
    "7533458903425173001",
    "7533459765367118492",
    "",
    // Milk & Mocha: Cutest!
    "",
    "",
    ""
  ];

  const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
  return api.sendMessage({ sticker: randomSticker }, threadID, messageID);
};

module.exports.run = () => {};
