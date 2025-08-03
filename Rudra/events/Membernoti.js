const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "membernoti",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "1.0.5",
  credits: "Kashif Raza",
  description: "Join/Leave shayari with 600KB mp4"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData, eventType } = event;
  const botID = api.getCurrentUserID();

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

  // If someone joins
  if (eventType === "log:subscribe") {
    const joiner = logMessageData.addedParticipants?.[0]?.fullName || "نیا ممبر";
    const poem = happyPoetry[Math.floor(Math.random() * happyPoetry.length)];
    const videoPath = path.join(__dirname, "..", "commands", "noprefix", "join.mp4");

    return api.sendMessage({
      body: `✨ خوش آمدید ${joiner} ✨\n\n${poem}`,
      attachment: fs.createReadStream(videoPath)
    }, threadID);
  }

  // If someone leaves (except bot itself)
  if (eventType === "log:unsubscribe") {
    if (logMessageData.leftParticipantFbId === botID) return;
    const poem = sadPoetry[Math.floor(Math.random() * sadPoetry.length)];
    const videoPath = path.join(__dirname, "..", "commands", "noprefix", "left.mp4");

    return api.sendMessage({
      body: `💔 ایک دوست چلا گیا...\n\n${poem}`,
      attachment: fs.createReadStream(videoPath)
    }, threadID);
  }
};
