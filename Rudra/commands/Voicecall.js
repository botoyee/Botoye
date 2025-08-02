const fs = require("fs");
const request = require("request");
const { get } = require("https");
const path = require("path");

module.exports.config = {
  name: "vannounce",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "Modified by Technical Solution",
  description: "Send voice to all groups using TTS",
  commandCategory: "Admin",
  usages: "[Text]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const moment = require("moment-timezone");
  const gio = moment.tz("Asia/Karachi").format("DD/MM/YYYY - HH:mm:ss");

  if (!args[0]) return api.sendMessage("❌ | Text likho jo bolna hai.\nExample: /vannounce mujhe sab se pyar hai", event.threadID);

  const msg = args.join(" ");
  const lang = "hi";
  const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${lang}&client=tw-ob`;
  const filePath = path.join(__dirname, "cache", `vannounce_${Date.now()}.mp3`);

  const file = fs.createWriteStream(filePath);
  get(ttsURL, (response) => {
    response.pipe(file);
    file.on("finish", async () => {
      file.close();

      const allThread = global.data.allThreadID || [];
      let can = 0, canNot = 0;

      for (const thread of allThread) {
        try {
          api.sendMessage({
            body: `🎤 *Voice Announcement*\n🕒 ${gio}\n🗣️ ${await Users.getNameUser(event.senderID)} says:\n\n"${msg}"`,
            attachment: fs.createReadStream(filePath)
          }, thread, (err, info) => {
            if (!err) {
              global.client.handleReply.push({
                name: module.exports.config.name,
                type: "reply",
                messageID: info.messageID,
                messID: event.messageID,
                threadID: event.threadID
              });
              can++;
            } else canNot++;
          });
        } catch (e) {
          canNot++;
        }
      }

      // Notify sender
      setTimeout(() => {
        api.sendMessage(`✅ | Voice sent to ${can} groups.\n❌ Failed in ${canNot} groups.`, event.threadID);
        fs.unlinkSync(filePath);
      }, 2000);
    });
  }).on("error", (err) => {
    fs.unlinkSync(filePath);
    return api.sendMessage("🚫 | Voice generate karne me error hua.", event.threadID);
  });
};
