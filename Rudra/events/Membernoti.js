const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "memberNoti",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "1.0.0",
  credits: "Kashif x Ayan",
  description: "Join/Left notification with poetry and video"
};

const happyShayari = [
  "خوشبو کی طرح تیرے استقبال کو آئے ہیں 🌸",
  "آج ہماری محفل میں چمکتا ستارہ آیا ہے ✨",
  "تیرا آنا دل کو بہار دے گیا ❤️",
  "خوش آمدید اے پیارے مہمان 💐",
  "آؤ بیٹھو دوستو، ایک نیا چہرہ آیا ہے 🌷"
];

const sadShayari = [
  "ہم نے تمہیں روز یاد کرنا ہے اب 💔",
  "تیرا جانا اداسی دے گیا 😢",
  "رخصت ہوا ایک چمکتا ستارہ 🌙",
  "دل اداس ہے، تم چلے گئے 🥀",
  "الوداع... تم یاد آتے رہو گے 🌧️"
];

module.exports.run = async function({ api, event }) {
  const { threadID, logMessageType, logMessageData } = event;

  try {
    let userID, userName, msg, videoPath;

    if (logMessageType === "log:subscribe") {
      userID = logMessageData.addedParticipants[0].userFbId;
      userName = (await api.getUserInfo(userID))[userID].name;

      const randomShayari = happyShayari[Math.floor(Math.random() * happyShayari.length)];
      msg = `🌸 خوش آمدید ${userName}!\n\n${randomShayari}`;
      videoPath = path.join(__dirname, "commands", "noprefix", "join.mp4");

    } else if (logMessageType === "log:unsubscribe") {
      userID = logMessageData.leftParticipantFbId;
      userName = (await api.getUserInfo(userID))[userID].name;

      const randomShayari = sadShayari[Math.floor(Math.random() * sadShayari.length)];
      msg = `💔 الوداع ${userName}...\n\n${randomShayari}`;
      videoPath = path.join(__dirname, "commands", "noprefix", "left.mp4");
    }

    if (fs.existsSync(videoPath)) {
      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(videoPath)
      }, threadID);
    } else {
      return api.sendMessage({ body: msg }, threadID);
    }

  } catch (err) {
    console.log("[❌ memberNoti ERROR]", err);
  }
};
