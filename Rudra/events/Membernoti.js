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
          "ðŸŒ¸ Ø®ÙˆØ´ Ø¢Ù…Ø¯ÛŒØ¯ Ø§Û’ Ø¬Ø§Ù†Ù Ù…Ø­ÙÙ„ ðŸ’•\nØ¢Ù¾ Ú©ÛŒ Ø¢Ù…Ø¯ Ù†Û’ Ø±ÙˆÙ†Ù‚ Ù„Ú¯Ø§ Ø¯ÛŒ âœ¨",
          "ðŸŒ¼ Ø®ÙˆØ´ÛŒÙˆÚº Ø¨Ú¾Ø±Ø§ ÛÙˆ ÛØ± Ø¯Ù† ØªÙ…ÛØ§Ø±Ø§ ðŸ’«\nÚ¯Ø±ÙˆÙ¾ Ù…ÛŒÚº Ø®ÙˆØ´ Ø±ÛÙˆ Ø¨Ø³ ÛÙ…Ø§Ø±Ø§ ðŸ¤",
          "ðŸ«¶ Ù†Ø¦ÛŒ Ø¢Ù…Ø¯ Ù†Ø¦ÛŒ Ø®ÙˆØ´Ø¨Ùˆ ðŸŒº\nØ¨Ø§ØªÙˆÚº Ù…ÛŒÚº ÛÙˆ Ù¾ÛŒØ§Ø± Ú©Ø§ Ø¬Ø§Ø¯Ùˆ âœ¨",
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
      "ðŸ’” Ú†Ù¾Ú©Û’ Ø³Û’ Ú©ÙˆØ¦ÛŒ Ø®ÙˆØ§Ø¨ Ù¹ÙˆÙ¹ Ú¯ÛŒØ§ ðŸŒ™\nÚ©Ø³ÛŒ Ú©Ø§ ÛÙ†Ø³ØªØ§ ÛÙˆØ§ Ú†ÛØ±Û Ú†Ú¾ÙˆÙ¹ Ú¯ÛŒØ§ ðŸ¥€",
      "ðŸ˜” Ù…Ø­ÙÙ„ Ø³Û’ Ú¯ÛŒØ§ ÙˆÛ Ø®Ø§Ù…ÙˆØ´ÛŒ Ø³Û’\nØ¯Ù„ Ú†Ú¾ÙˆÚ‘ Ú¯ÛŒØ§ ÙˆÛ Ø®ÙˆØ´Ø¨Ùˆ Ú©ÛŒ Ø·Ø±Ø­ ðŸŒ«ï¸",
      "ðŸŒ§ï¸ Ø¬Ø¯Ø§Ø¦ÛŒ Ú©Ø§ Ù„Ù…Ø­Û Ú©Ú†Ú¾ Ø¹Ø¬ÛŒØ¨ ÛÙˆØªØ§ ÛÛ’\nÛØ± ÛÙ†Ø³ÛŒ Ù¾ÛŒÚ†Ú¾Û’ Ø§ÛŒÚ© Ù†ØµÛŒØ¨ ÛÙˆØªØ§ ÛÛ’ ðŸ’­",
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
