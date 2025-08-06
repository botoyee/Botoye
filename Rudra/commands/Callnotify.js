const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "dpz",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Sends 50 random DP pics based on your search",
  commandCategory: "image",
  usages: ".dpz [your search term]",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    api.sendMessage("🔍 Searching for DPs...", event.threadID, event.messageID);

    const searchQuery = args.join(" ");
    
    if (!searchQuery) {
      return api.sendMessage("❌ Please specify what DPs you want (e.g., '.dpz girls stylish' or '.dpz boys attitude')", event.threadID, event.messageID);
    }

    const apiResponse = await axios.get(`https://api.princetechn.com/api/search/googleimage?apikey=prince&query=${encodeURIComponent(searchQuery)}`, {
      timeout: 15000
    });
    
    if (!apiResponse.data?.results || apiResponse.data.results.length === 0) {
      return api.sendMessage(`😢 No DPs found for "${searchQuery}". Try different words.`, event.threadID, event.messageID);
    }

    const results = apiResponse.data.results;
    const random50 = results
      .filter(url => url.match(/\.(jpeg|jpg|png)$/i))
      .sort(() => 0.5 - Math.random())
      .slice(0, 50);

    if (random50.length === 0) {
      return api.sendMessage(`😢 No valid DPs found for "${searchQuery}". Try different keywords.`, event.threadID, event.messageID);
    }

    const images = [];
    const tempFiles = [];

    for (let i = 0; i < random50.length; i++) {
      try {
        const imgPath = path.join(__dirname, `cache/dpz_${Date.now()}_${i}.jpg`);
        const response = await axios.get(random50[i], {
          responseType: "arraybuffer",
          timeout: 10000
        });
        
        if (response.headers['content-type'].startsWith('image/')) {
          await fs.writeFile(imgPath, response.data);
          images.push(fs.createReadStream(imgPath));
          tempFiles.push(imgPath);
        }
      } catch (error) {
        console.error(`Error downloading image ${i}:`, error.message);
      }
    }

    if (images.length === 0) {
      return api.sendMessage("😢 Failed to download any DPs. Please try again later.", event.threadID, event.messageID);
    }

    await api.sendMessage({
      body: `🖼️ Here are ${images.length} DPs for "${searchQuery}":`,
      attachment: images
    }, event.threadID);

    for (const file of tempFiles) {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (cleanupError) {
        console.error("Error deleting file:", file, cleanupError);
      }
    }

  } catch (err) {
    console.error("Error in DPZ command:", err);
    api.sendMessage(`❌ Error fetching DPs for "${searchQuery}". Please try again later.`, event.threadID, event.messageID);
  }
};
