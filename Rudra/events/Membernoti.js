const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "membernoti",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "1.0.0",
  credits: "Kashif Raza",
  description: "Send join/left notification with desi Urdu poetry",
};

module.exports.run = async function ({ event, api }) {
  const threadID = event.threadID;
  const added = event.logMessageData?.addedParticipants || [];
  const leftID = event.logMessageData?.leftParticipantFbId;
  const botID = api.getCurrentUserID();

  // On Join
  if (event.logMessageType === "log:subscribe") {
    for (const user of added) {
      if (user.userFbId !== botID) {
        const joinPoetry = [
          "🌸 خوش آمدید اے جانِ محفل 💕\nآپ کی آمد نے رونق لگا دی ✨",
          "🌼 خوشیوں بھرا ہو ہر دن تمہارا 💫\nگروپ میں خوش رہو بس ہمارا 🤝",
          "🫶 نئی آمد نئی خوشبو 🌺\nباتوں میں ہو پیار کا جادو ✨",
        ];
        const body = joinPoetry[Math.floor(Math.random() * joinPoetry.length)];
        const videoPath = path.join(__dirname, "..", "commands", "noprefix", "join.mp4");

        if (fs.existsSync(videoPath)) {
          api.sendMessage(
            {
              body,
              attachment: fs.createReadStream(videoPath),
            },
            threadID
          );
        } else {
          api.sendMessage(body, threadID);
        }
      }
    }
  }

  // On Left
  if (event.logMessageType === "log:unsubscribe" && leftID !== botID) {
    const sadPoetry = [
      "💔 چپکے سے کوئی خواب ٹوٹ گیا 🌙\nکسی کا ہنستا ہوا چہرہ چھوٹ گیا 🥀",
      "😔 محفل سے گیا وہ خاموشی سے\nدل چھوڑ گیا وہ خوشبو کی طرح 🌫️",
      "🌧️ جدائی کا لمحہ کچھ عجیب ہوتا ہے\nہر ہنسی پیچھے ایک نصیب ہوتا ہے 💭",
    ];
    const body = sadPoetry[Math.floor(Math.random() * sadPoetry.length)];
    const videoPath = path.join(__dirname, "..", "commands", "noprefix", "left.mp4");

    if (fs.existsSync(videoPath)) {
      api.sendMessage(
        {
          body,
          attachment: fs.createReadStream(videoPath),
        },
        threadID
      );
    } else {
      api.sendMessage(body, threadID);
    }
  }
};
