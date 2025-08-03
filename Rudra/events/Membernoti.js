const fs = require("fs");

module.exports.config = {
  name: "membernoti",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "1.0.2",
  credits: "Kashif Raza",
  description: "Sad/happy poetry with video on member join/leave"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData, eventType } = event;

  const sadPoetry = [
    "چپکے چپکے رو لیتے ہیں ہم...\nکہ کوئی دیکھ نہ لے ہماری تنہائیاں 💔",
    "وہ چھوڑ گئے ہمیں جس کے لیے ہم نے دنیا چھوڑ دی تھی 😢",
    "ہمیں خبر بھی نہ ہوئی اور وہ خواب ادھورے رہ گئے 💭"
  ];

  const happyPoetry = [
    "آؤ خوشیوں کی بات کریں، جو مل گیا اس پر شکر کریں 🌸",
    "خوشبو کی طرح دوستوں سے ملتے ہیں ہم 💖",
    "نئے چہروں سے نئے خواب جڑتے ہیں، خوش آمدید 🤗"
  ];

  if (eventType === "log:subscribe") {
    const joiner = logMessageData.addedParticipants?.[0]?.fullName || "نیا ممبر";
    const joinPoem = happyPoetry[Math.floor(Math.random() * happyPoetry.length)];
    const joinVideoPath = __dirname + `/../commands/noprefix/join.mp4`;

    return api.sendMessage({
      body: `✨ خوش آمدید ${joiner} ✨\n\n${joinPoem}`,
      attachment: fs.existsSync(joinVideoPath) ? fs.createReadStream(joinVideoPath) : null
    }, threadID);
  }

  if (eventType === "log:unsubscribe") {
    const leaver = logMessageData.leftParticipantFbId;
    if (leaver === api.getCurrentUserID()) return; // Ignore if bot left

    const sadPoem = sadPoetry[Math.floor(Math.random() * sadPoetry.length)];
    const leftVideoPath = __dirname + `/../commands/noprefix/left.mp4`;

    return api.sendMessage({
      body: `😢 ایک دوست چلا گیا...\n\n${sadPoem}`,
      attachment: fs.existsSync(leftVideoPath) ? fs.createReadStream(leftVideoPath) : null
    }, threadID);
  }
};
