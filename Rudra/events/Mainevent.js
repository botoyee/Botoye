const fs = require("fs"); const path = require("path"); const moment = require("moment-timezone");

module.exports = { config: { name: "mainEvent", version: "1.0", author: "Kashif Raza", description: "All-in-one: Greetings + Namaz Alerts + Islamic Quotes + Quran Ayat + Join/Left Poetry", eventType: ["log:subscribe", "log:unsubscribe"], },

onLoad: function () { if (!global.mainEventInterval) { global.mainEventInterval = setInterval(async () => { const now = moment().tz("Asia/Karachi"); const hour = now.hour();

// Send hourly Islamic quote
    if (hour !== global.lastQuoteHour) {
      global.lastQuoteHour = hour;
      sendRandomQuote();
    }

    // Send poetry every 2 hours
    if (hour % 2 === 0 && hour !== global.lastPoetryHour) {
      global.lastPoetryHour = hour;
      sendPoetry();
    }

    // Namaz alerts
    const namazTimes = {
      5: "Fajr 🕌",
      12: "Zuhar 🕌",
      15: "Asar 🕌",
      18: "Maghrib 🕌",
      20: "Isha 🕌",
    };
    if (namazTimes[hour] && hour !== global.lastNamazHour) {
      global.lastNamazHour = hour;
      sendNamazAlert(namazTimes[hour]);
    }

    // Quran Ayat Morning (8AM) and Night (10PM)
    if ((hour === 8 || hour === 22) && hour !== global.lastAyatHour) {
      global.lastAyatHour = hour;
      sendQuranAyat();
    }
  }, 60 * 1000);
}

},

run: async function ({ api, event }) { const { threadID, logMessageType, logMessageData } = event;

// Join event
if (logMessageType === "log:subscribe") {
  const name = logMessageData.addedParticipants[0]?.fullName || "Member";
  const video = fs.createReadStream(path.join(__dirname, "../commands/noprefix/join.mp4"));
  const poetry = getRandomPoetry("happy");
  api.sendMessage({ body: `𝘞𝘦𝘭𝘤𝘰𝘮𝘦 ${name} 🎉\n\n${poetry}`, attachment: video }, threadID);
}

// Left event
if (logMessageType === "log:unsubscribe") {
  const name = event.logMessageData?.leftParticipantName || "Member";
  const video = fs.createReadStream(path.join(__dirname, "../commands/noprefix/left.mp4"));
  const poetry = getRandomPoetry("sad");
  api.sendMessage({ body: `𝘈𝘭𝘸𝘪𝘥𝘢 ${name} 💔\n\n${poetry}`, attachment: video }, threadID);
}

}, };

// Utility Functions

function sendRandomQuote() { const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, "./quotes.json"))); const random = quotes[Math.floor(Math.random() * quotes.length)]; global.api.getThreadList(10, null, ["INBOX"], (err, data) => { for (const thread of data) { global.api.sendMessage(📖 𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗤𝘂𝗼𝘁𝗲:\n\n${random}, thread.threadID); } }); }

function sendNamazAlert(namazName) { global.api.getThreadList(10, null, ["INBOX"], (err, data) => { for (const thread of data) { global.api.sendMessage(🕌 𝗡𝗮𝗺𝗮𝘇 𝗔𝗹𝗲𝗿𝘁:\n\nIt's time for ${namazName}.\nOffer your Salah with sincerity!, thread.threadID); } }); }

function sendPoetry() { const poetryData = JSON.parse(fs.readFileSync(path.join(__dirname, "./poetry.json"))); const allPoetry = [...poetryData.happy, ...poetryData.sad]; const random = allPoetry[Math.floor(Math.random() * allPoetry.length)]; global.api.getThreadList(10, null, ["INBOX"], (err, data) => { for (const thread of data) { global.api.sendMessage(📜 𝗣𝗼𝗲𝘁𝗿𝘆 𝗧𝗶𝗺𝗲:\n\n${random}, thread.threadID); } }); }

function sendQuranAyat() { const ayatData = JSON.parse(fs.readFileSync(path.join(__dirname, "./quranAyat.json"))); const random = ayatData[Math.floor(Math.random() * ayatData.length)]; global.api.getThreadList(10, null, ["INBOX"], (err, data) => { for (const thread of data) { global.api.sendMessage(📖 𝗤𝘂𝗿𝗮𝗻 𝗔𝘆𝗮𝘁:\n\n${random.arabic}\n\n📘 Urdu Translation:\n${random.urdu}, thread.threadID); } }); }

function getRandomPoetry(type = "happy") { const poetryData = JSON.parse(fs.readFileSync(path.join(__dirname, "./poetry.json"))); const list = poetryData[type] || []; return list[Math.floor(Math.random() * list.length)] || "✨"; }

