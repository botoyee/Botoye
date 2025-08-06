const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Cache with expiration (1 hour)
const searchCache = new Map();
const CACHE_EXPIRATION = 60 * 60 * 1000; 

module.exports.config = {
  name: "music",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Your Name",
  description: "Search and download high quality music",
  commandCategory: "media",
  usages: ".music [song name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage(
        "🎵 Please enter a song name!\nExample: .music Shape of You",
        event.threadID,
        event.messageID
      );
    }

    api.setMessageReaction("🔍", event.messageID, () => {}, true);

    // Try multiple search APIs if first fails
    const APIs = [
      `https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(query)}`,
      `https://api.somebackup.com/search?q=${encodeURIComponent(query)}`
    ];

    let res;
    for (const apiUrl of APIs) {
      try {
        res = await axios.get(apiUrl, { timeout: 10000 });
        if (res.data?.result?.length) break;
      } catch (e) {
        console.log(`Trying next API...`);
      }
    }

    if (!res?.data?.result?.length) {
      return api.sendMessage(
        `🔎 No results found for "${query}"\n\nTry:\n• Different keywords\n• English song titles\n• Checking spelling`,
        event.threadID,
        event.messageID
      );
    }

    const list = res.data.result.slice(0, 6);
    let msg = "🎧 Search Results:\n\n";
    list.forEach((item, i) => {
      msg += `${i+1}. ${item.title} (${item.duration || 'N/A'})\n`;
    });
    msg += "\nReply with the song number (1-6) to download";

    // Cache with timestamp
    searchCache.set(event.senderID, {
      results: list,
      timestamp: Date.now()
    });

    return api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) return console.error(err);
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "music_select"
      });
    });

  } catch (error) {
    console.error("Search Error:", error);
    api.sendMessage(
      "⚠️ Music service unavailable. Try again later",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    if (handleReply.author !== event.senderID) return;

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > 6) {
      return api.sendMessage(
        "❌ Please reply with a number between 1-6",
        event.threadID,
        event.messageID
      );
    }

    const cacheData = searchCache.get(event.senderID);
    if (!cacheData || Date.now() - cacheData.timestamp > CACHE_EXPIRATION) {
      return api.sendMessage(
        "⌛ Search expired. Please search again",
        event.threadID,
        event.messageID
      );
    }

    const video = cacheData.results[choice-1];
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    // Try multiple download APIs
    const downloadAPIs = [
      `https://api.princetechn.com/api/download/yta?apikey=prince&url=${encodeURIComponent(video.url)}`,
      `https://api.backup.com/download?url=${encodeURIComponent(video.url)}`
    ];

    let songData;
    for (const apiUrl of downloadAPIs) {
      try {
        const res = await axios.get(apiUrl, { timeout: 15000 });
        if (res.data?.result) {
          songData = res.data.result;
          break;
        }
      } catch (e) {
        console.log(`Trying next download API...`);
      }
    }

    if (!songData?.download_url) {
      return api.sendMessage(
        "❌ Couldn't download this song. Try another one",
        event.threadID,
        event.messageID
      );
    }

    const time = Date.now();
    const [audio, thumb] = await Promise.all([
      axios.get(songData.download_url, { responseType: "arraybuffer", timeout: 30000 }),
      axios.get(songData.thumbnail || 'https://i.imgur.com/8QZQZQZ.png', { responseType: "arraybuffer" })
    ]);

    const filePath = path.join(__dirname, `cache/music_${time}.mp3`);
    const thumbPath = path.join(__dirname, `cache/thumb_${time}.jpg`);

    await Promise.all([
      fs.writeFile(filePath, audio.data),
      fs.writeFile(thumbPath, thumb.data)
    ]);

    await api.sendMessage({
      body: `🎶 ${songData.title || 'Unknown Track'}\n⏱ ${songData.duration || 'N/A'}`,
      attachment: fs.createReadStream(thumbPath)
    }, event.threadID);

    await api.sendMessage({
      attachment: fs.createReadStream(filePath)
    }, event.threadID);

    // Cleanup
    [filePath, thumbPath].forEach(file => {
      fs.unlink(file, () => {});
    });

    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (error) {
    console.error("Download Error:", error);
    api.sendMessage(
      "⚠️ Error downloading song. Please try another",
      event.threadID,
      event.messageID
    );
  }
};
