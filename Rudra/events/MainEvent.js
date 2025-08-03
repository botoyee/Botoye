const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "mainEvent",
    version: "1.0",
    author: "Kashif Raza",
    description: "All-in-one: Greetings + Namaz Alerts + Islamic Quotes + Quran Ayat + Join/Left Poetry",
    eventType: ["log:subscribe", "log:unsubscribe"],
  },

  onLoad: function () {
    if (!global.mainEventInterval) {
      global.mainEventInterval = setInterval(async () => {
        const now = moment().tz("Asia/Karachi");
        const hour = now.hour();
        const memory = getMemory();

        // Islamic Quote every hour
        if (hour !== memory.lastQuoteHour) {
          sendRandomQuote();
          memory.lastQuoteHour = hour;
        }

        // Poetry every 2 hours
        if (hour % 2 === 0 && hour !== memory.lastPoetryHour) {
          sendPoetry();
          memory.lastPoetryHour = hour;
        }

        // Namaz alerts
        const namazTimes = {
          5: "Fajr 🕌",
          12: "Zuhar 🕌",
          15: "Asar 🕌",
          18: "Maghrib 🕌",
          20: "Isha 🕌",
        };
        if (namazTimes[hour] && hour !== memory.lastNamazHour) {
          sendNamazAlert(namazTimes[hour]);
          memory.lastNamazHour = hour;
        }

        // Quran Ayat Morning & Night
        if ((hour === 8 || hour === 22) && hour !== memory.lastAyatHour) {
          sendQuranAyat();
          memory.lastAyatHour = hour;
        }

        setMemory(memory);
      }, 60 * 1000);
    }
  },

  run: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData } = event;

    // Join Event
    if (logMessageType === "log:subscribe") {
      const name = logMessageData.addedParticipants[0]?.fullName || "Member";
      const video = fs.createReadStream(path.join(__dirname, "../commands/noprefix/join.mp4"));
      const poetry = getRandomPoetry("happy");
      api.sendMessage({ body: `𝘞𝘦𝘭𝘤𝘰𝘮𝘦 ${name} 🎉\n\n${poetry}`, attachment: video }, threadID);
    }

    // Leave Event
    if (logMessageType === "log:unsubscribe") {
      const name = logMessageData?.leftParticipantName || "Member";
      const video = fs.createReadStream(path.join(__dirname, "../commands/noprefix/left.mp4"));
      const poetry = getRandomPoetry("sad");
      api.sendMessage({ body: `𝘈𝘭𝘸𝘪𝘥𝘢 ${name} 💔\n\n${poetry}`, attachment: video }, threadID);
    }
  },
};

// === Utility Functions ===

const memoryFile = path.join(__dirname, "./mainEventMemory.json");

function getMemory() {
  try {
    return JSON.parse(fs.readFileSync(memoryFile));
  } catch {
    return {
      lastQuoteHour: null,
      lastPoetryHour: null,
      lastAyatHour: null,
      lastNamazHour: null
    };
  }
}

function setMemory(data) {
  fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
}

function sendRandomQuote() {
  const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, "./quotes.json")));
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  global.api.getThreadList(10, null, ["INBOX"], (err, data) => {
    for (const thread of data) {
      global.api.sendMessage(`📖 𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗤𝘂𝗼𝘁𝗲:\n\n${random}`, thread.threadID);
    }
  });
}

function sendNamazAlert(namazName) {
  global.api.getThreadList(10, null, ["INBOX"], (err, data) => {
    for (const thread of data) {
      global.api.sendMessage(`🕌 𝗡𝗮𝗺𝗮𝘇 𝗔𝗹𝗲𝗿𝘁:\n\nIt's time for ${namazName}.\nOffer your Salah with sincerity!`, thread.threadID);
    }
  });
}

function sendPoetry() {
  const poetryData = JSON.parse(fs.readFileSync(path.join(__dirname, "./poetry.json")));
  const allPoetry = [...poetryData.happy, ...poetryData.sad];
  const random = allPoetry[Math.floor(Math.random() * allPoetry.length)];
  global.api.getThreadList(10, null, ["INBOX"], (err, data) => {
    for (const thread of data) {
      global.api.sendMessage(`📜 𝗣𝗼𝗲𝘁𝗿𝘆 𝗧𝗶𝗺𝗲:\n\n${random}`, thread.threadID);
    }
  });
}

function sendQuranAyat() {
  const ayatData = JSON.parse(fs.readFileSync(path.join(__dirname, "./quranAyat.json")));
  const random = ayatData[Math.floor(Math.random() * ayatData.length)];
  global.api.getThreadList(10, null, ["INBOX"], (err, data) => {
    for (const thread of data) {
      global.api.sendMessage(`📖 𝗤𝘂𝗿𝗮𝗻 𝗔𝘆𝗮𝘁:\n\n${random.arabic}\n\n📘 Urdu Translation:\n${random.urdu}`, thread.threadID);
    }
  });
}

function getRandomPoetry(type = "happy") {
  const poetryData = JSON.parse(fs.readFileSync(path.join(__dirname, "./poetry.json")));
  const list = poetryData[type] || [];
  return list[Math.floor(Math.random() * list.length)] || "✨";
}
