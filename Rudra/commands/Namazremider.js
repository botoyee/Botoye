const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
  name: "namazReminder",
  version: "1.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Auto sends namaz reminders by Pakistan time",
  commandCategory: "Islamic",
  usages: "",
  cooldowns: 5
};

const namazTimings = [
  { name: "Fajr", time: "04:15" },
  { name: "Dhuhr", time: "12:30" },
  { name: "Asr", time: "16:45" },
  { name: "Maghrib", time: "19:15" },
  { name: "Isha", time: "20:30" }
];

let lastSent = null;

module.exports.onLoad = ({ api }) => {
  setInterval(() => {
    const now = moment().tz("Asia/Karachi").format("HH:mm");
    const match = namazTimings.find(n => n.time === now);

    if (match && lastSent !== now) {
      lastSent = now;

      const message = `🕌 *${match.name}* ka waqt ho gaya hai 🌙\nNamaz parhna mat bhoolna 💚`;
      const attachment = fs.createReadStream(__dirname + `/noprefix/namaz.jpg`);

      const allThreads = global.data.allThreadID || [];
      allThreads.forEach(threadID => {
        api.sendMessage({ body: message, attachment }, threadID);
      });
    }
  }, 60000); // Check every 1 minute
};