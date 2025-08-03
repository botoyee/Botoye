const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "greetingsIslamic",
  version: "1.0.2",
  credits: "Kashif Raza",
  description: "Sends greetings, namaz alerts, and Islamic quotes periodically",
  cooldowns: 5,
};

let sentGreetings = {
  morning: false,
  night: false,
};

module.exports.run = async function({ api }) {
  const quotesFile = path.join(__dirname, "greetingsQuotes.json");

  // Load quotes from JSON file
  let quotes = [];
  if (fs.existsSync(quotesFile)) {
    quotes = JSON.parse(fs.readFileSync(quotesFile, "utf-8"));
  }

  const namazTimings = {
    Fajr: "05:00",
    Dhuhr: "13:00",
    Asr: "16:30",
    Maghrib: "19:00",
    Isha: "20:30"
  };

  const allThreads = await api.getThreadList(100, null, ["INBOX"]);
  const groupThreads = allThreads.filter(t => t.isGroup);

  const sendToAll = async (msg) => {
    for (const thread of groupThreads) {
      try {
        await api.sendMessage(msg, thread.threadID);
      } catch (err) {
        console.log(`[❌] Failed to send to ${thread.threadID}`);
      }
    }
  };

  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hour.toString().padStart(2, "0")}:${minutes}`;

  // 🕌 Namaz Alerts
  for (const [namaz, time] of Object.entries(namazTimings)) {
    if (currentTime === time) {
      await sendToAll(`📿 *Namaz Alert!*\nAb ${namaz} ki namaz ka waqt ho gaya hai.\nNamaz parhna mat bhoolna 🤲`);
    }
  }

  // 🌞 Morning Greeting
  if (hour >= 6 && hour < 12 && !sentGreetings.morning) {
    sentGreetings.morning = true;
    sentGreetings.night = false;
    await sendToAll("🌞 *Subha Bakhair!*\nNayi subha, naye jazbaat, naye iraade.\nNamaz aur dua se apna din shuru karein 🤍");
  }

  // 🌙 Night Greeting
  if (hour >= 22 && !sentGreetings.night) {
    sentGreetings.night = true;
    sentGreetings.morning = false;
    await sendToAll("🌙 *Shab Bakhair!*\nDuaon mein yaad rakhna 💫\nAllah hum sab ko apni hifazat mein rakhe 🤲");
  }

  // 🕊️ Islamic Quote Every Hour
  if (quotes.length > 0) {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    await sendToAll(`🕋 *Islamic Quote:*\n${random}`);
  }
};
