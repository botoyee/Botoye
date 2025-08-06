const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "dpz",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Modified by ChatGPT | API by PrinceTech",
  description: "Sends 20 random boys stylish DP pics",
  commandCategory: "image",
  usages: ".dpz boys stylish dpz",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event }) {
  try {
    const res = await axios.get(`https://api.princetechn.com/api/search/googleimage?apikey=prince&query=boys+stylish+dp`);
    
    const results = res.data.results;

    if (!results || results.length === 0) {
      return api.sendMessage("😢 Koi DP nahi mili. Baad mein try karo.", event.threadID, event.messageID);
    }

    const random20 = results.sort(() => 0.5 - Math.random()).slice(0, 20);
    const images = [];

    for (let i = 0; i < random20.length; i++) {
      const imgPath = path.join(__dirname, `cache/dpz${i}.jpg`);
      const imgData = (await axios.get(random20[i], { responseType: "arraybuffer" })).data;
      fs.writeFileSync(imgPath, imgData);
      images.push(fs.createReadStream(imgPath));
    }

    api.sendMessage(
      {
        body: "🖼️ 20 Stylish Boys DPs",
        attachment: images,
      },
      event.threadID,
      () => {
        // Cleanup
        for (let i = 0; i < random20.length; i++) {
          const imgPath = path.join(__dirname, `cache/dpz${i}.jpg`);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
      },
      event.messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Error aagaya DPZ command mein.", event.threadID, event.messageID);
  }
};
