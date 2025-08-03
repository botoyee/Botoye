module.exports.config = {
  name: "memberNoti",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "1.2",
  credits: "Kashif Raza",
  description: "Send welcome/leave messages with poetry and video"
};

const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const userID = event.logMessageData?.leftParticipantFbId || event.logMessageData?.addedParticipants?.[0]?.userFbId;
  const userName = event.logMessageData?.leftParticipantFbId
    ? (await api.getUserInfo(event.logMessageData.leftParticipantFbId))[event.logMessageData.leftParticipantFbId].name
    : event.logMessageData.addedParticipants[0].fullName;

  // Video paths
  const joinVideo = path.join(__dirname, "commands", "noprefix", "join.mp4");
  const leftVideo = path.join(__dirname, "commands", "noprefix", "left.mp4");

  // Happy join poetry
  const happyPoetry = [
    `*خوش آمدید!*\n\nخوشبو کی طرح تیرے آنے کی خبر آئی ہے،\nمحفل میں جیسے چاندنی بھر آئی ہے 💐✨`,
    `*دل سے خوش آمدید!*\n\nتیرے آنے سے روشن ہوا ہر اک گوشہ دل کا،\nبزم سجی ہے تیری آمد پر 💖🌙`,
    `*سلامت رہو!*\n\nتم آئے ہو بہاروں کی طرح،\nخوشبو بن کے فضاؤں میں چھا گئے ہو 🌸🌿`
  ];

  // Sad left poetry
  const sadPoetry = [
    `*الوداع دوست!*\n\nوہ جو چھوڑ گیا ہمیں تنہا،\nیادوں میں اب بس وہی لمحے رہ گئے 😢💔`,
    `*رخصت کا لمحہ!*\n\nتم چلے گئے ہو تو دل اداس ہے،\nمحفل خالی خالی سی لگتی ہے 🌧️🕊️`,
    `*بچھڑنے کا غم!*\n\nکبھی ہم ساتھ تھے ہنستے تھے،\nآج صرف خاموشی ہے، اور یادیں 😔🌙`
  ];

  // Send join message
  if (event.logMessageType === "log:subscribe") {
    const body = `${userName} خوش آمدید 🌸\n\n${happyPoetry[Math.floor(Math.random() * happyPoetry.length)]}`;
    if (fs.existsSync(joinVideo)) {
      api.sendMessage({ body, attachment: fs.createReadStream(joinVideo) }, threadID);
    } else {
      api.sendMessage(body, threadID);
    }
  }

  // Send left message
  if (event.logMessageType === "log:unsubscribe") {
    const body = `${userName} نے گروپ چھوڑ دیا 😢\n\n${sadPoetry[Math.floor(Math.random() * sadPoetry.length)]}`;
    if (fs.existsSync(leftVideo)) {
      api.sendMessage({ body, attachment: fs.createReadStream(leftVideo) }, threadID);
    } else {
      api.sendMessage(body, threadID);
    }
  }
};
