const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "vannounce",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Ayan x MuskanBot",
  description: "Voice announcement in all groups using Google TTS",
  commandCategory: "admin",
  usages: "[text]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  if (!args[0]) return api.sendMessage("🗣️ | Voice me kya bolna hai? Text do!\n\nExample:\n/vannounce Hello everyone!", threadID, messageID);

  const text = args.join(" ");
  const lang = "hi"; // fixed to Hindi/Urdu style

  try {
    const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const filePath = path.resolve(__dirname, "cache", `announce_${Date.now()}.mp3`);

    const response = await axios.get(ttsURL, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const allThreads = global.data.allThreadID || [];
    let success = 0, failed = 0;

    for (const id of allThreads) {
      try {
        await api.sendMessage({
          body: `🎤 Voice Announcement`,
          attachment: fs.createReadStream(filePath),
        }, id);
        success++;
      } catch (e) {
        failed++;
      }
    }

    fs.unlinkSync(filePath);

    return api.sendMessage(
      `✅ | Voice sent to ${success} groups.\n❌ | Failed in ${failed} groups.`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error("[ vannounce ERROR ]", err);
    return api.sendMessage("🚫 | Voice generate nahi ho payi. Try again.", threadID, messageID);
  }
};
