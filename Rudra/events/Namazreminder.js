const fs = require("fs");
const path = require("path");

module.exports = (api) => {
  const namazTimes = {
    Fajr: "05:00",
    Dhuhr: "12:30",
    Asr: "16:30",
    Maghrib: "19:10",
    Isha: "20:30"
  };

  const imagePath = path.join(__dirname, "../commands/noprefix/namaz.jpg");

  setInterval(() => {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
    const currentTime = new Date(now);
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    for (const [namaz, time] of Object.entries(namazTimes)) {
      if (time === timeString) {
        api.getThreadList(10, null, ["INBOX"], (err, threads) => {
          if (err) return console.error(err);
          threads.forEach(thread => {
            api.sendMessage({
              body: `🕌 *${namaz} Namaz ka waqt ho gaya hai!*\nAllah humein apni ibadat ka waqt nikaalne ki tofeeq de. 🤲`,
              attachment: fs.createReadStream(imagePath)
            }, thread.threadID);
          });
        });
      }
    }
  }, 60 * 1000); // check every minute
};
