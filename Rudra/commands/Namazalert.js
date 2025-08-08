// namazalert.js
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "namazalert",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif",
  description: "Namaz ka waqt yaad dilana with random Quran ayat (Urdu tarjuma)",
  commandCategory: "Utility",
  cooldowns: 5
};

async function getRandomAyat() {
  try {
    const res = await axios.get("https://api.alquran.cloud/v1/ayah/random/ur.junagarhi"); 
    const ayat = res.data.data.text;
    const surahName = res.data.data.surah.englishName;
    const number = res.data.data.numberInSurah;

    return `📖 *${surahName}* [${number}]\n${ayat}`;
  } catch (err) {
    console.error("Ayat fetch error:", err.message);
    return "📖 آج کی آیت فی الحال لانے میں مشکل پیش آئی، بعد میں کوشش کریں۔";
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  const timeNow = moment.tz("Asia/Karachi").format("HH:mm:ss");
  const seconds = moment.tz("Asia/Karachi").format("ss");

  // Tumhare diye huye namaz ke waqt
  const times = {
    fajr: `04:17:${seconds}`,
    dhuhr: `12:28:${seconds}`,
    asr: `17:13:${seconds}`,
    maghrib: `19:11:${seconds}`,
    isha: `20:39:${seconds}`
  };

  for (let [name, setTime] of Object.entries(times)) {
    if (timeNow === setTime && seconds < 3) {
      const ayat = await getRandomAyat();
      const msg = `🕌 *${name.toUpperCase()} Namaz Alert*\n\n${ayat}\n\n⏰ Time: ${moment.tz("Asia/Karachi").format("hh:mm A")}\n📢 Namaz ka waqt ho gaya!`;

      api.sendMessage(msg, event.threadID);
    }
  }
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage("📢 Namaz Alert system active hai. Ye apne waqt pe automatic alert bhejega.", event.threadID);
};
