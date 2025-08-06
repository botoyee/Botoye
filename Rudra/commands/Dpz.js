module.exports.config = {
  name: "dpz",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Modified by ChatGPT for Kashif Raza",
  description: "Send random boys stylish DP images",
  commandCategory: "Utility",
  usages: ".dpz boys stylish dpz",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");

  const { threadID, messageID } = event;

  try {
    const res = await axios.get("https://api.princetechn.com/api/search/googleimage?apikey=prince&query=boys+stylish+dp");

    if (!res.data || !res.data.length) {
      return api.sendMessage("Kuch bhi nahi mila! 😢 Baad mein try karo.", threadID, messageID);
    }

    // Pick 20 random images
    const shuffled = res.data.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);

    // Download and prepare images
    const images = [];

    for (let i = 0; i < selected.length; i++) {
      const imgRes = await axios.get(selected[i], { responseType: "arraybuffer" });
      const path = __dirname + `/cache/dpz${i}.jpg`;
      fs.writeFileSync(path, imgRes.data);
      images.push(fs.createReadStream(path));
    }

    api.sendMessage({
      body: `🖼️ 20 Stylish Boys DP Images`,
      attachment: images
    }, threadID, () => {
      for (let i = 0; i < 20; i++) {
        fs.unlinkSync(__dirname + `/cache/dpz${i}.jpg`);
      }
    }, messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("Error aagaya 😢 baad mein try karo!", threadID, messageID);
  }
};
