const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "voice",
  version: "1.0.0",
  hasPermssion: 2, // Sirf owner use kar sakta hai
  credits: "Kashif Raza (Ayan Ali)",
  description: "Send voice message to all groups using Google TTS",
  commandCategory: "system",
  usages: "/voice [text]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const message = args.join(" ");
  if (!message) return api.sendMessage("❌ Text missing!\nUse: /voice [your message]", event.threadID);

  const lang = "hi"; // aap 'auto' ya 'en' bhi rakh sakte hain
  const fileName = `${event.threadID}_${Date.now()}.mp3`;
  const filePath = path.join(__dirname, "cache", fileName);
  const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(message)}&tl=${lang}&client=tw-ob`;

  // Download audio file
  await global.utils.downloadFile(ttsURL, filePath);

  // Get all groups
  const threadList = await api.getThreadList(100, null, ["INBOX"]);
  const groupIDs = threadList.filter(t => t.isGroup && t.name != null).map(t => t.threadID);

  api.sendMessage(`📢 Sending voice note to ${groupIDs.length} groups...`, event.threadID);

  let success = 0, failed = 0;

  for (const id of groupIDs) {
    try {
      await api.sendMessage({
        attachment: fs.createReadStream(filePath),
      }, id);
      success++;
    } catch (e) {
      failed++;
    }
  }

  fs.unlinkSync(filePath); // Remove file after use

  return api.sendMessage(`✅ Voice sent to ${success} groups\n❌ Failed: ${failed}`, event.threadID);
};
