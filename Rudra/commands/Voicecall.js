const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "vannounce",
  version: "1.0.0",
  hasPermssion: 2, // only admin
  credits: "Modified by MuskanBot",
  description: "Voice Announcement to all groups",
  commandCategory: "admin",
  usages: "[lang] [text]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!args[0]) return api.sendMessage("❌ | Message likho jo announce karna hai.\nExample: /vannounce auto Kal meeting hai", event.threadID, event.messageID);

    const supportedLangs = ["hi", "en", "ja", "ru", "tl"];
    let lang = "auto", msg = args.join(" ");

    if (supportedLangs.includes(args[0].toLowerCase())) {
      lang = args[0].toLowerCase();
      msg = args.slice(1).join(" ");
    }

    // Auto Hindi for Hinglish
    if (lang === "auto") {
      const hindiPattern = /[क-हाि-ॣ़ा़ेैोौंःँ]/;
      lang = hindiPattern.test(msg) ? "hi" : "hi";
    }

    const filePath = path.resolve(__dirname, "cache", `vannounce_${event.senderID}.mp3`);
    const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${lang}&client=tw-ob`;

    await global.utils.downloadFile(ttsURL, filePath);

    const allThreads = global.data.allThreadID || [];
    let success = 0, failed = 0;

    for (const threadID of allThreads) {
      try {
        await api.sendMessage({
          body: `🔊 | Voice Announcement from Admin\n\n🗣️: ${msg}`,
          attachment: fs.createReadStream(filePath)
        }, threadID);
        success++;
      } catch (e) {
        failed++;
      }
    }

    fs.unlinkSync(filePath); // remove after sending
    return api.sendMessage(`✅ | Voice sent to ${success} groups.\n❌ | Failed in ${failed} groups.`, event.threadID, event.messageID);

  } catch (err) {
    console.error("💥 Error in /vannounce:", err);
    return api.sendMessage("🚫 | Error voice generate karne me. Try again later.", event.threadID, event.messageID);
  }
};
