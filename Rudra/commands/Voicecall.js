const fs = require("fs-extra"); const path = require("path"); const axios = require("axios");

module.exports.config = { name: "voice", version: "1.0.0", hasPermssion: 2, credits: "Modified by Technical Solution", description: "Send a voice message to all threads using Google TTS", commandCategory: "Admin", usages: "/voice [text]", cooldowns: 10 };

module.exports.run = async function ({ api, event, args, Users }) { if (!args[0]) return api.sendMessage("❌ | Please provide a message to speak.", event.threadID, event.messageID);

const text = args.join(" "); const lang = "hi"; // you can change it to "en" if you want English const ttsUrl = https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob; const filePath = path.join(_dirname, "cache", `tts${Date.now()}.mp3");

const allThread = global.data.allThreadID || []; let success = 0, fail = 0;

try { const response = await axios({ method: "GET", url: ttsUrl, responseType: "stream" });

const writer = fs.createWriteStream(filePath);
response.data.pipe(writer);

writer.on("finish", async () => {
  for (const thread of allThread) {
    try {
      await api.sendMessage({ attachment: fs.createReadStream(filePath) }, thread);
      success++;
    } catch (e) {
      fail++;
    }
  }
  fs.unlinkSync(filePath);
  api.sendMessage(`✅ | Voice message sent to ${success} threads. Failed in ${fail} threads.`, event.threadID);
});

writer.on("error", err => {
  console.error(err);
  api.sendMessage("❌ | Error while creating voice message.", event.threadID);
});

} catch (err) { console.error(err); api.sendMessage("❌ | Failed to generate voice from Google.", event.threadID); } };

