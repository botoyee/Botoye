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
    "994458070956118",
    "994457834289475",
    "994457597622832",
    // QooBee Gets Funny
    "958598070838103",
    "958598314171412",
    "958598470838063",
    // Milk & Mocha: Cutest!
    "909175329597154",
    "909175389597148",
    "909175269597160"
  ];

  const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
  return api.sendMessage({ sticker: randomSticker }, threadID, messageID);
};

module.exports.run = () => {};
