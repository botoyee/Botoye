const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Cache for storing search results per user
const searchCache = new Map();

module.exports.config = {
  name: "music",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Modified by ChatGPT | API by PrinceTech",
  description: "Search and download music from YouTube",
  commandCategory: "media",
  usages: ".music [song name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage(
        "❌ Please provide a song name. Example: .music tum hi ho",
        event.threadID,
        event.messageID
      );
    }

    // Show searching indicator
    api.setMessageReaction("🔍", event.messageID, () => {}, true);

    const searchUrl = `https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(query)}`;
    const res = await axios.get(searchUrl, { timeout: 15000 });

    if (!res.data?.result?.length) {
      return api.sendMessage(
        "😢 No results found for your search.",
        event.threadID,
        event.messageID
      );
    }

    const list = res.data.result.slice(0, 6); // Get top 6 results
    let msg = "🎵 Search results:\n\n";
    list.forEach((vid, i) => {
      msg += `${i + 1}. ${vid.title} (${vid.duration})\n`;
    });
    msg += "\n💬 Reply with the number (1-6) to download the song";

    // Store results in cache
    searchCache.set(event.senderID, list);

    return api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) {
        console.error("Error sending message:", err);
        return;
      }
      
      // Register reply handler
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "music_select"
      });
    });

  } catch (error) {
    console.error("Music search error:", error);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    return api.sendMessage(
      "❌ Error searching for music. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    // Verify this reply is for our command
    if (handleReply.author !== event.senderID) return;
    if (handleReply.type !== "music_select") return;

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > 6) {
      return api.sendMessage(
        "❌ Please reply with a number between 1 and 6.",
        event.threadID,
        event.messageID
      );
    }

    const cachedResults = searchCache.get(event.senderID);
    if (!cachedResults) {
      return api.sendMessage(
        "❌ Search expired. Please search again.",
        event.threadID,
        event.messageID
      );
    }

    const video = cachedResults[choice - 1];
    if (!video?.url) {
      return api.sendMessage(
        "❌ Invalid video selection.",
        event.threadID,
        event.messageID
      );
    }

    // Show downloading indicator
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const downloadUrl = `https://api.princetechn.com/api/download/yta?apikey=prince&url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(downloadUrl, { timeout: 20000 });

    if (!res.data?.result?.download_url) {
      return api.sendMessage(
        "❌ Failed to get download link. The video may be restricted.",
        event.threadID,
        event.messageID
      );
    }

    const song = res.data.result;
    const timestamp = Date.now();
    const filePath = path.join(__dirname, `cache/${timestamp}_music.mp3`);
    const thumbPath = path.join(__dirname, `cache/${timestamp}_thumb.jpg`);

    // Download files in parallel
    const [audioRes, thumbRes] = await Promise.all([
      axios.get(song.download_url, { responseType: "arraybuffer", timeout: 30000 }),
      axios.get(song.thumbnail, { responseType: "arraybuffer", timeout: 15000 })
    ]);

    await Promise.all([
      fs.writeFile(filePath, audioRes.data),
      fs.writeFile(thumbPath, thumbRes.data)
    ]);

    // Send results
    await api.sendMessage({
      body: `🎧 ${song.title}\n⏱ Duration: ${song.duration}`,
      attachment: fs.createReadStream(thumbPath)
    }, event.threadID);

    await api.sendMessage({
      body: `🎶 Here's your song: ${song.title}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID);

    // Cleanup
    fs.unlink(filePath, () => {});
    fs.unlink(thumbPath, () => {});
    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (error) {
    console.error("Music download error:", error);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    api.sendMessage(
      "❌ Error downloading music. Please try another song.",
      event.threadID,
      event.messageID
    );
  }
};
