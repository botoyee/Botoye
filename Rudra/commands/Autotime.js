const cron = require("node-cron");
const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "autotime",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Updated by ChatGPT",
  description: "Auto post poetry with image every 2 hours (Pakistan time) in all groups",
  commandCategory: "system",
  usages: "",
  cooldowns: 0
};

// 🔁 Image Links
const images = [
  "https://i.imgur.com/PXbqlcI.jpeg",
  "https://i.imgur.com/eUvBowi.jpeg",
  "https://i.imgur.com/NcYmlWL.jpeg",
  "https://i.imgur.com/AUhdJrn.jpeg",
  "https://i.imgur.com/KQBmHXP.jpeg",
  "https://i.imgur.com/D09Arck.jpeg",
  "https://i.imgur.com/DWgvEYs.jpeg",
  "https://i.imgur.com/o2qFjwW.jpeg",
  "https://i.imgur.com/Scrh6lr.jpeg",
  "https://i.imgur.com/55B0fT7.jpeg"
];

module.exports.onLoad = function ({ api }) {
  cron.schedule("0 */2 * * *", async () => {
    try {
      const allThreads = global.data.allThreadID || [];
      const time = moment().tz("Asia/Karachi").format("hh:mm A");

      // Load poetry from JSON file
      const poetryPath = path.join(__dirname, "..", "poetry.json");
      const poetryList = JSON.parse(fs.readFileSync(poetryPath, "utf-8"));
      const poetry = poetryList[Math.floor(Math.random() * poetryList.length)];

      // Pick random image
      const imageURL = images[Math.floor(Math.random() * images.length)];

      // Download image
      const res = await axios.get(imageURL, { responseType: "stream" });
      const tempPath = path.join(__dirname, `temp_img_${Date.now()}.jpg`);
      const writer = fs.createWriteStream(tempPath);
      res.data.pipe(writer);

      writer.on("finish", () => {
        for (const threadID of allThreads) {
          api.sendMessage({
            body: `🕰️ ${time} (PK Time)\n\n${poetry}`,
            attachment: fs.createReadStream(tempPath)
          }, threadID, () => {});
        }

        setTimeout(() => fs.unlinkSync(tempPath), 30 * 1000);
      });

      writer.on("error", err => {
        console.error("Image write error:", err);
      });
    } catch (e) {
      console.error("❌ AutoTime Error:", e);
    }
  });

  console.log("✅ AutoTime (Every 2 Hours) started.");
};

module.exports.run = async () => {};
