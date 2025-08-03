const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "music",
  version: "1.1",
  permission: 0,
  prefix: true,
  credits: "Muskan",
  description: "Search and play music from Pixabay",
  category: "media",
  usages: "/music <search>",
  cooldowns: 5,
};

let tempResults = {}; // To store results temporarily

module.exports.run = async function ({ api, event, args }) {
  const search = args.join(" ");
  if (!search) return api.sendMessage("🔎 /music <search>\nمثال: /music sad", event.threadID, event.messageID);

  const API_KEY = "51609285-e2658ec185028d1e56777bd26";
  const url = `https://pixabay.com/api/sounds/?key=${API_KEY}&q=${encodeURIComponent(search)}&per_page=7`;

  try {
    const res = await axios.get(url);
    const results = res.data.hits;

    if (results.length === 0) return api.sendMessage("😔 کوئی موسیقی نہیں ملی، کچھ اور try کریں!", event.threadID, event.messageID);

    let msg = `🎧 𝗦𝗲𝗹𝗲𝗰𝘁 𝗺𝘂𝘀𝗶𝗰 𝗳𝗼𝗿: "${search}"\n\n`;
    results.forEach((track, index) => {
      msg += `${index + 1}. 🎶 *${track.tags}*\n📏 ${track.duration}s\n👤 ${track.user}\n\n`;
    });
    msg += "💬 کسی نمبر کا جواب دیں (1–7) تاکہ وہ موسیقی سنی جا سکے۔";

    tempResults[event.senderID] = results;

    return api.sendMessage(msg, event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "choose",
      });
    });
  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ موسیقی حاصل کرنے میں مسئلہ ہو گیا!", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (handleReply.type !== "choose") return;
  if (event.senderID !== handleReply.author) return;

  const num = parseInt(event.body);
  if (isNaN(num) || num < 1 || num > 7) return api.sendMessage("⛔ براہ کرم 1 سے 7 تک کا نمبر دیں!", event.threadID, event.messageID);

  const track = tempResults[event.senderID][num - 1];
  const audioUrl = track.audio;
  const thumbUrl = track.userImageURL;

  const filePath = __dirname + `/cache/music_${event.senderID}.mp3`;
  const fileThumb = __dirname + `/cache/music_thumb_${event.senderID}.jpg`;

  request(thumbUrl).pipe(fs.createWriteStream(fileThumb)).on("close", () => {
    request(audioUrl).pipe(fs.createWriteStream(filePath)).on("close", () => {
      api.sendMessage({
        body: `🎶 *${track.tags}*\n👤 ${track.user}\n📏 ${track.duration}s`,
        attachment: [
          fs.createReadStream(fileThumb),
          fs.createReadStream(filePath)
        ]
      }, event.threadID, () => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(fileThumb);
      });
    });
  });
};
