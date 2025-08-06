const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "music",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Your Name",
  description: "Fixed Music Search & Download",
  commandCategory: "media",
  usages: ".music [song]",
  cooldowns: 5
};

// Enhanced with proper headers and multiple fallback APIs
const API_ENDPOINTS = [
  {
    url: "https://api.princetechn.com/api/search/yts",
    params: { apikey: "prince", query: "" },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "application/json",
      "Origin": "https://www.youtube.com",
      "Referer": "https://www.youtube.com/"
    }
  },
  {
    url: "https://yt-api.p.rapidapi.com/search",
    params: { query: "" },
    headers: {
      "X-RapidAPI-Key": "your-rapidapi-key",
      "X-RapidAPI-Host": "yt-api.p.rapidapi.com"
    }
  }
];

module.exports.run = async function({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query) return api.sendMessage("🎵 Please enter a song name", event.threadID);

    api.setMessageReaction("🔍", event.messageID, () => {}, true);

    // Try all API endpoints until one works
    let results;
    for (const endpoint of API_ENDPOINTS) {
      try {
        const fullUrl = `${endpoint.url}?${new URLSearchParams({...endpoint.params, query}).toString()}`;
        console.log(`Trying API: ${fullUrl}`);
        
        const res = await axios.get(fullUrl, {
          headers: endpoint.headers,
          timeout: 10000
        });

        if (res.data?.results?.length || res.data?.result?.length) {
          results = res.data.results || res.data.result;
          break;
        }
      } catch (e) {
        console.log(`API Failed: ${endpoint.url}`, e.message);
      }
    }

    if (!results?.length) {
      return api.sendMessage(
        `🔴 No results found for "${query}"\n\nPossible fixes:\n1. Try different keywords\n2. Use English song titles\n3. Check spelling\n\nDebug: All APIs failed`,
        event.threadID
      );
    }

    const list = results.slice(0, 6);
    let msg = "🎧 Results:\n\n";
    list.forEach((item, i) => {
      msg += `${i+1}. ${item.title} (${item.duration || 'N/A'})\n`;
    });
    msg += "\nReply 1-6 to download";

    global.musicCache = { ...global.musicCache, [event.senderID]: list };
    
    return api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) return console.error(err);
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "music_select"
      });
    });

  } catch (err) {
    console.error("Full Error:", err);
    return api.sendMessage(
      `⚠️ Critical Error:\n\nStatus: ${err.response?.status || "Unknown"}\nMessage: ${err.message}`,
      event.threadID
    );
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  try {
    if (handleReply.author !== event.senderID) return;
    
    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > 6) {
      return api.sendMessage("❌ Invalid choice. Reply with 1-6", event.threadID);
    }

    const cache = global.musicCache?.[event.senderID];
    if (!cache) return api.sendMessage("⌛ Session expired. Search again", event.threadID);

    const video = cache[choice-1];
    if (!video?.url) return api.sendMessage("❌ Invalid video data", event.threadID);

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    // Try multiple download sources
    const downloadSources = [
      `https://api.princetechn.com/api/download/yta?apikey=prince&url=${encodeURIComponent(video.url)}`,
      `https://ytdl-api.p.rapidapi.com/download?url=${encodeURIComponent(video.url)}`
    ];

    let song;
    for (const source of downloadSources) {
      try {
        const res = await axios.get(source, { timeout: 15000 });
        if (res.data?.result) {
          song = res.data.result;
          break;
        }
      } catch (e) {
        console.log(`Download source failed: ${source}`);
      }
    }

    if (!song?.download_url) {
      return api.sendMessage("❌ All download sources failed", event.threadID);
    }

    const time = Date.now();
    const paths = {
      audio: path.join(__dirname, `cache/music_${time}.mp3`),
      thumb: path.join(__dirname, `cache/thumb_${time}.jpg`)
    };

    const [audio, thumb] = await Promise.all([
      axios.get(song.download_url, { responseType: "arraybuffer", timeout: 30000 }),
      axios.get(song.thumbnail || 'https://i.ytimg.com/vi/default.jpg', { responseType: "arraybuffer" })
    ]);

    await Promise.all([
      fs.writeFile(paths.audio, audio.data),
      fs.writeFile(paths.thumb, thumb.data)
    ]);

    await api.sendMessage({
      body: `🎶 ${song.title || 'Unknown Track'}\n⏱ ${song.duration || 'N/A'}`,
      attachment: fs.createReadStream(paths.thumb)
    }, event.threadID);

    await api.sendMessage({
      attachment: fs.createReadStream(paths.audio)
    }, event.threadID);

    // Cleanup
    Object.values(paths).forEach(p => fs.unlink(p, () => {}));
    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (err) {
    console.error("Download Error:", err);
    api.sendMessage(`⚠️ Download failed: ${err.message}`, event.threadID);
  }
};
