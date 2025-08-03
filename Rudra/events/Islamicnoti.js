const quotes = [
  "“The heart that beats for Allah is always a stranger among the hearts that beat for the Dunya.” 🕋",
  "“When the world pushes you to your knees, you’re in the perfect position to pray.” 🤲",
  "“Do not lose hope, nor be sad.” – Quran 3:139 🌙",
  "“And He found you lost and guided [you].” – Quran 93:7 🌟",
  "“Allah does not burden a soul beyond that it can bear.” – Quran 2:286 🧘",
];

const greetings = [
  { time: 6, msg: "🌄 *Good Morning! May your day be full of Barakah.*" },
  { time: 12, msg: "🌞 *Good Afternoon! Don’t forget your Dhuhr prayer.*" },
  { time: 18, msg: "🌆 *Good Evening! May peace and light be upon you.*" },
  { time: 21, msg: "🌙 *Good Night! Pray before you sleep.*" },
];

const namazAlerts = {
  5: "🌅 *Fajr Time* – Start your day with the light of prayer.",
  13: "☀️ *Dhuhr Time* – Take a break, connect with Allah.",
  17: "🏜️ *Asr Time* – Strengthen your soul with remembrance.",
  19: "🌇 *Maghrib Time* – Sunset brings the time for reflection.",
  21: "🌌 *Isha Time* – End your day in peace through prayer."
};

module.exports.config = {
  name: "islamicNotifier",
  version: "1.0.0",
  credits: "Kashif Raza",
  description: "Sends Islamic quotes, namaz alerts, and greetings hourly",
  eventType: []
};

module.exports.run = async function ({ api }) {
  const threadList = await api.getThreadList(100, null, ["INBOX"]);

  setInterval(() => {
    const date = new Date();
    const hour = date.getHours();

    // Greeting Message
    const greet = greetings.find(g => g.time === hour);
    if (greet) {
      for (const thread of threadList) {
        api.sendMessage(greet.msg, thread.threadID);
      }
    }

    // Namaz Alert
    if (namazAlerts[hour]) {
      for (const thread of threadList) {
        api.sendMessage(namazAlerts[hour], thread.threadID);
      }
    }

    // Hourly Islamic Quote
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    for (const thread of threadList) {
      api.sendMessage(`📖 *Islamic Quote*\n${quote}`, thread.threadID);
    }

  }, 60 * 60 * 1000); // Runs every hour
};
