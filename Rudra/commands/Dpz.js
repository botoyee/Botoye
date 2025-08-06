const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "dpz",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Kashif Raza + Modified by ChatGPT",
  description: "Sends 50 random DP pics in batches of 10",
  commandCategory: "image",
  usages: ".dpz [your search term]",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    api.sendMessage("🔍 Searching for DPs...", event.threadID, event.messageID);

    const searchQuery = args.join(" ");
    if (!searchQuery) {
      return api.sendMessage("❌ Please specify what DPs you want (e.g., '.dpz girls stylish')", event.threadID, event.messageID);
    }

    const apiResponse = await axios.get(`https://api.princetechn.com/api/search/googleimage?apikey=prince&query=${encodeURIComponent(searchQuery)}`, {
      timeout: 15000
    });

    if (!apiResponse.data?.results || apiResponse.data.results.length === 0) {
      return api.sendMessage(`😢 No DPs found for "${searchQuery}". Try other words.`, event.threadID, event.messageID);
    }

    const results = apiResponse.data.results;
    const selected = results
      .filter(url => url.match(/\.(jpeg|jpg|png)$/i))
      .sort(() => 0.5 - Math.random())
      .slice(0, 50);

    if (selected.length === 0) {
      return api.sendMessage(`😢 No valid DPs found for "${searchQuery}".`, event.threadID, event.messageID);
    }

    const allImages = [];
    const tempFiles = [];

    for (let i = 0; i < selected.length; i++) {
      try {
        const imgPath = path.join(__dirname, `cache/dpz_${Date.now()}_${i}.jpg`);
        const response = await axios.get(selected[i], {
          responseType: "arraybuffer",
          timeout: 10000
        });

        if (response.headers['content-type'].startsWith('image/')) {
          await fs.writeFile(imgPath, response.data);
          allImages.push(fs.createReadStream(imgPath));
          tempFiles.push(imgPath);
        }
      } catch (error) {
        console.error(`Error downloading image ${i + 1}:`, error.message);
      }
    }

    if (allImages.length === 0) {
      return api.sendMessage("😢 Failed to download any DPs. Try again later.", event.threadID, event.messageID);
    }

    // ✅ Split into chunks of 10 and send
    const chunkSize = 10;
    for (let i = 0; i < allImages.length; i += chunkSize) {
      const batch = allImages.slice(i, i + chunkSize);
      await api.sendMessage({
        body: `🖼️ Sending DPs ${i + 1} to ${Math.min(i + chunkSize, allImages.length)} of ${allImages.length} for "${searchQuery}"`,
        attachment: batch
      }, event.threadID);
      await new Promise(res => setTimeout(res, 1000)); // 1s delay between batches
    }

    // 🧹 Cleanup
    for (const file of tempFiles) {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (cleanupError) {
        console.error("Error deleting file:", file, cleanupError);
      }
    }

  } catch (err) {
    console.error("DPZ Command Error:", err);
    api.sendMessage(`❌ Error occurred while fetching DPs for "${searchQuery}".`, event.threadID, event.messageID);
  }
};
