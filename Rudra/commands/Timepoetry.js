module.exports.config = {
  name: "poetrysender",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif + Muskan ❤️",
  description: "Har ghante ke :15 minute pe random poetry send kare",
  commandCategory: "system",
  cooldowns: 5
};

const moment = require("moment-timezone");

module.exports.onLoad = async function({ api, Threads }) {
  setInterval(async () => {
    const timeNow = moment.tz("Asia/Karachi").format("HH:mm");
    const minutes = moment.tz("Asia/Karachi").format("mm");

    // Sirf tab chale jab minute 15 ho
    if (minutes === "15") {
      const poetryList = [
        "Kabhi hum se bhi baat karo, sirf khayalon me hi nahi 💌",
        "Tere bina jeena mumkin hai, magar acha nahi lagta 💔",
        "Dil ka dard samajhne wale kam milte hain 💭",
        "Tu mile ya na mile, duaon me hamesha rahega 🌙",
        "Woh nazrein milana bhi kya khoobsurat pal tha ✨",
        "Mohabbat sirf ehsaas ka naam hai, lafzon ka nahi ❤️",
        "Tum chaho ya na chaho, hum tumse mohabbat karte rahenge 💞",
        "Tere muskurane ka sabab ban jaun 🌸",
        "Teri yaadon ka safar kabhi khatam nahi hota 💌",
        "Tu door hoke bhi dil ke paas rehta hai 💖",
        "Har pal tumhari kami mehsoos hoti hai 💭",
        "Dil ke kone me bas tum hi ho, baaki sab mehmaan hain 💕"
      ];

      const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];

      try {
        const allThreads = await Threads.getAll(["threadID"]);
        for (const thread of allThreads) {
          await api.sendMessage(`🕒 Time: ${timeNow}\n\n📜 *Poetry of the Hour:*\n${randomPoetry}`, thread.threadID);
        }
      } catch (err) {
        console.error("Error sending poetry:", err);
      }
    }
  }, 60 * 1000); // Har 1 minute me check karega
};

module.exports.run = async function({ api, event }) {
  api.sendMessage("Poetry sender har ghante ke :15 minute pe automatic poetry bhejta hai 💌", event.threadID);
};
