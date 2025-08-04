
module.exports.config = {
  name: "namazReminder",
  eventType: [],
  version: "1.0.0",
  credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
  description: "Automatic namaz reminder for Pakistan time",
  envConfig: {
    enable: true
  }
};

module.exports.onLoad = function() {
  const cron = require("node-cron");
  const moment = require("moment-timezone");
  
  // Define prayer times (approximate for Pakistan - you can adjust these)
  const prayerTimes = {
    fajr: { time: "05:00", name: "Fajr (فجر)" },
    dhuhr: { time: "12:30", name: "Dhuhr (ظہر)" },
    asr: { time: "16:00", name: "Asr (عصر)" },
    maghrib: { time: "18:30", name: "Maghrib (مغرب)" },
    isha: { time: "20:00", name: "Isha (عشاء)" }
  };

  // Create cron jobs for each prayer
  Object.keys(prayerTimes).forEach(prayer => {
    const [hour, minute] = prayerTimes[prayer].time.split(":");
    
    cron.schedule(`${minute} ${hour} * * *`, () => {
      if (!global.configModule[this.config.name].enable) return;
      
      const currentTime = moment.tz("Asia/Karachi").format("HH:mm");
      const prayerName = prayerTimes[prayer].name;
      
      const reminderMessage = `🕌 ${prayerName} Time Reminder 🕌\n\n` +
        `⏰ Time: ${currentTime} (Pakistan Time)\n` +
        `🤲 It's time for ${prayerName} prayer\n\n` +
        `اَللّٰہُ اَکْبَر\n` +
        `May Allah accept your prayers 🤲`;

      // Send to all groups
      const allThreads = global.data.allThreadID || [];
      allThreads.forEach(threadID => {
        if (!isNaN(parseInt(threadID))) {
          try {
            global.data.api.sendMessage(reminderMessage, threadID);
          } catch (error) {
            console.log(`Failed to send namaz reminder to thread ${threadID}:`, error.message);
          }
        }
      });
      
      console.log(`[NAMAZ REMINDER] Sent ${prayerName} reminder at ${currentTime} Pakistan time`);
    }, {
      scheduled: true,
      timezone: "Asia/Karachi"
    });
  });

  // Optional: Send a special reminder for Jummah (Friday prayer)
  cron.schedule('0 12 * * 5', () => {
    if (!global.configModule[this.config.name].enable) return;
    
    const jummahMessage = `🕌 Jummah Mubarak! 🕌\n\n` +
      `🌟 It's Friday - the blessed day\n` +
      `🤲 Don't forget to attend Jummah prayer\n` +
      `📿 Recite Surah Al-Kahf today\n\n` +
      `جُمُعَہ مُبارَک\n` +
      `May Allah bless this holy day 🤲`;

    const allThreads = global.data.allThreadID || [];
    allThreads.forEach(threadID => {
      if (!isNaN(parseInt(threadID))) {
        try {
          global.data.api.sendMessage(jummahMessage, threadID);
        } catch (error) {
          console.log(`Failed to send Jummah reminder to thread ${threadID}:`, error.message);
        }
      }
    });
    
    console.log("[JUMMAH REMINDER] Sent Jummah Mubarak message");
  }, {
    scheduled: true,
    timezone: "Asia/Karachi"
  });

  console.log("[NAMAZ REMINDER] Event loaded successfully with Pakistan timezone");
};

module.exports.run = async function() {
  // This event runs automatically via cron jobs
  return;
};
