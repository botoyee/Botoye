const fs = require("fs");
const moment = require("moment-timezone");
const path = require("path");

let lastPoetryTime = 0;
let lastQuoteTime = 0;
let lastQuranTime = { morning: 0, night: 0 };

const poetry = require("./poetry.json");
const quotes = require("./quotes.json");
const quranAyat = require("./quranAyat.json");

const joinVid = fs.existsSync(path.join(__dirname, "../commands/noprefix/join.mp4")) ? fs.createReadStream(path.join(__dirname, "../commands/noprefix/join.mp4")) : null;
const leftVid = fs.existsSync(path.join(__dirname, "../commands/noprefix/left.mp4")) ? fs.createReadStream(path.join(__dirname, "../commands/noprefix/left.mp4")) : null;

module.exports = {
  config: {
    name: "mainEvent",
    version: "2.0",
    author: "Kashif x Ayan",
    description: "All-in-one: join/leave + hourly quote + poetry + Quran + Namaz",
    dependencies: []
  },

  async onLoad({ api }) {
    const interval = setInterval(async () => {
      const now = moment().tz("Asia/Karachi");
      const hour = now.hour();
      const minute = now.minute();
      const currentTime = Date.now();

      // 1. Send Poetry every 2 hours
      if (currentTime - lastPoetryTime >= 2 * 60 * 60 * 1000) {
        lastPoetryTime = currentTime;
        const rand = poetry[Math.floor(Math.random() * poetry.length)];
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        for (const thread of threads) {
          if (thread.isGroup) {
            api.sendMessage(rand, thread.threadID);
          }
        }
      }

      // 2. Send Islamic Quote every hour
      if (currentTime - lastQuoteTime >= 60 * 60 * 1000) {
        lastQuoteTime = currentTime;
        const rand = quotes[Math.floor(Math.random() * quotes.length)];
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        for (const thread of threads) {
          if (thread.isGroup) {
            api.sendMessage(rand, thread.threadID);
          }
        }
      }

      // 3. Morning & Night Quranic Ayat
      const hourNow = now.hour();
      const isMorning = hourNow >= 6 && hourNow <= 9;
      const isNight = hourNow >= 20 && hourNow <= 23;

      if (isMorning && currentTime - lastQuranTime.morning > 6 * 60 * 60 * 1000) {
        lastQuranTime.morning = currentTime;
        const ayah = quranAyat[Math.floor(Math.random() * quranAyat.length)];
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        for (const thread of threads) {
          if (thread.isGroup) {
            api.sendMessage(`📖 *Subah Ki Ayat:*\n${ayah}`, thread.threadID);
          }
        }
      }

      if (isNight && currentTime - lastQuranTime.night > 6 * 60 * 60 * 1000) {
        lastQuranTime.night = currentTime;
        const ayah = quranAyat[Math.floor(Math.random() * quranAyat.length)];
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        for (const thread of threads) {
          if (thread.isGroup) {
            api.sendMessage(`🌙 *Raat Ki Ayat:*\n${ayah}`, thread.threadID);
          }
        }
      }

      // 4. Namaz Alerts (simple version)
      if (minute === 0 && [5, 13, 16, 18, 20].includes(hour)) {
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        const namazMap = {
          5: "🌅 Fajr ka waqt ho gaya hai!",
          13: "🌞 Zuhr ka waqt ho gaya hai!",
          16: "🌤 Asr ka waqt ho gaya hai!",
          18: "🌇 Maghrib ka waqt ho gaya hai!",
          20: "🌙 Isha ka waqt ho gaya hai!"
        };
        for (const thread of threads) {
          if (thread.isGroup) {
            api.sendMessage(namazMap[hour], thread.threadID);
          }
        }
      }
    }, 60 * 1000); // Every 1 minute
  },

  async run({ event, api }) {
    const { threadID, logMessageType, logMessageData } = event;

    if (logMessageType === "log:subscribe") {
      const name = logMessageData.addedParticipants[0]?.fullName || "Ek naye member";
      const poetryLine = poetry[Math.floor(Math.random() * poetry.length)];
      api.sendMessage({
        body: `✨ *Welcome ${name}!* \n\n${poetryLine}`,
        attachment: fs.createReadStream(path.join(__dirname, "../commands/noprefix/join.mp4"))
      }, threadID);
    }

    if (logMessageType === "log:unsubscribe") {
      const name = event.logMessageData.leftParticipantFbId === event.senderID ? "Kisi ne" : "Ek member ne";
      const poetryLine = poetry[Math.floor(Math.random() * poetry.length)];
      api.sendMessage({
        body: `😢 *${name} group chorr gaya...*\n\n${poetryLine}`,
        attachment: fs.createReadStream(path.join(__dirname, "../commands/noprefix/left.mp4"))
      }, threadID);
    }
  }
};
