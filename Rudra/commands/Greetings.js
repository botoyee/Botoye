const moment = require("moment-timezone");

module.exports.config = {
  name: "autoGreeting",
  version: "1.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Time-based Islamic greeting",
  commandCategory: "Islamic",
  usages: "",
  cooldowns: 5
};

const quotes = {
  morning: "🕌 Subha ka waqt duaon ka hai. Allah se har din ki behtari maango.",
  afternoon: "📿 Har waqt Allah ka shukar ada karo. Zindagi mein sukoon milega.",
  evening: "🌇 Shaam ka waqt zikr aur tasbeeh ka hai. SubhanAllah!",
  night: "🌙 Sone se pehle apne gunoahon ki maafi mango. Allah gafoor hai."
};

let lastGreeting = null;

module.exports.onLoad = ({ api }) => {
  setInterval(() => {
    const time = moment().tz("Asia/Karachi");
    const currentHour = time.hour();
    let greetingType = null;

    if (currentHour >= 6 && currentHour < 12) greetingType = "morning";
    else if (currentHour >= 12 && currentHour < 17) greetingType = "afternoon";
    else if (currentHour >= 17 && currentHour < 20) greetingType = "evening";
    else if (currentHour >= 20 && currentHour <= 23) greetingType = "night";
    else return; // No greeting at night 12AM to 6AM

    const currentTag = `${greetingType}-${time.format("HH:mm")}`;
    if (lastGreeting === currentTag) return;

    lastGreeting = currentTag;

    const greetingText = {
      morning: "🌤️ *Good Morning!*",
      afternoon: "🌞 *Good Afternoon!*",
      evening: "🌆 *Good Evening!*",
      night: "🌙 *Good Night!*"
    }[greetingType];

    const message = `${greetingText}\n\n📖 ${quotes[greetingType]}`;

    const allThreads = global.data.allThreadID || [];

    allThreads.forEach(threadID => {
      api.sendMessage(message, threadID);
    });
  }, 60000); // Runs every minute
};