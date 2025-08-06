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
  cooldowns: 10, // Increased cooldown to prevent rate limiting
};

module.exports.run = async function ({ api, event }) {
  try {
    api.sendMessage("🔍 Searching for stylish DPs...", event.threadID, event.messageID);

    // Step 1: Fetch image URLs from API
    const apiResponse = await axios.get(`https://api.princetechn.com/api/search/googleimage?apikey=prince&query=boys+stylish+dp`, {
      timeout: 15000 // 15 seconds timeout
    });
    
    if (!apiResponse.data?.results || apiResponse.data.results.length === 0) {
      return api.sendMessage("😢 Koi DP nahi mili. Kuch der baad try karo.", event.threadID, event.messageID);
    }

    // Step 2: Process images
    const results = apiResponse.data.results;
    const random20 = results
      .filter(url => url.match(/\.(jpeg|jpg|png)$/i)) // Filter valid image URLs
      .sort(() => 0.5 - Math.random())
      .slice(0, 20);

    if (random20.length === 0) {
      return api.sendMessage("😢 Valid DPs nahi mili. Koi aur query try karo.", event.threadID, event.messageID);
    }

    const images = [];
    const tempFiles = [];

    // Step 3: Download images with error handling
    for (let i = 0; i < random20.length; i++) {
      try {
        const imgPath = path.join(__dirname, `cache/dpz_${Date.now()}_${i}.jpg`);
        const response = await axios.get(random20[i], {
          responseType: "arraybuffer",
          timeout: 10000 // 10 seconds per image
        });
        
        if (response.headers['content-type'].startsWith('image/')) {
          await fs.writeFile(imgPath, response.data);
          images.push(fs.createReadStream(imgPath));
          tempFiles.push(imgPath);
        }
      } catch (error) {
        console.error(`Error downloading image ${i}:`, error.message);
        // Continue with next image if one fails
      }
    }

    if (images.length === 0) {
      return api.sendMessage("😢 Koi bhi DP download nahi ho payi. Internet check karo.", event.threadID, event.messageID);
    }

    // Step 4: Send message with attachments
    await api.sendMessage({
      body: `🖼️ ${images.length} Stylish Boys DPs (${random20.length} requested)`,
      attachment: images
    }, event.threadID);

    // Step 5: Cleanup temp files
    for (const file of tempFiles) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (cleanupError) {
        console.error("Error deleting file:", file, cleanupError);
      }
    }

  } catch (err) {
    console.error("Main error in DPZ command:", err);
    
    let errorMessage = "❌ Error aagaya DPZ command mein. Kuch der baad try karo.";
    if (err.response) {
      errorMessage += `\nAPI Error: ${err.response.status}`;
    } else if (err.code === "ECONNABORTED") {
      errorMessage = "⌛ Response nahi aaya. Internet slow hai?";
    } else if (err.message.includes("ENOTFOUND")) {
      errorMessage = "🌐 API server unreachable. Baad mein try karo.";
    }
    
    api.sendMessage(errorMessage, event.threadID, event.messageID);
  }
};
