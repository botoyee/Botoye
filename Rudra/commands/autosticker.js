module.exports.config = {
  name: "autolovesticker",
  version: "1.0.0",
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

  const stickers = [
    "369239263222822",
    "369239343222814",
    "369239263222814",
    "1658193461178005",
    "886382334881917",
    "2278774302289892",
    "974519762655405",
    "150884588926224",
    "745054975611498",
    "613235422148020"
  ];

  const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
  return api.sendMessage({ sticker: randomSticker }, threadID, messageID);
};

module.exports.run = () => {};