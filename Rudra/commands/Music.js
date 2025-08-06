const axios = require("axios"); const fs = require("fs-extra"); const path = require("path");

let searchCache = {};

module.exports.config = { name: "music", version: "1.0.0", hasPermssion: 0, credits: "Modified by ChatGPT | API by PrinceTech", description: "Search and download music from YouTube", commandCategory: "media", usages: ".music [song name]", cooldowns: 5, };

module.exports.run = async function ({ api, event, args }) { const query = args.join(" "); if (!query) return api.sendMessage("❌ Please provide a song name. Example: .music tum hi ho", event.threadID, event.messageID);

try { const res = await axios.get(https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(query)}); if (!res.data || !res.data.result || res.data.result.length === 0) return api.sendMessage("😢 No results found.", event.threadID, event.messageID);

const list = res.data.result.slice(0, 6); // top 6 results
let msg = "🎵 Search results:\n";
list.forEach((vid, i) => {
  msg += `${i + 1}. ${vid.title} (${vid.duration})\n`;
});
msg += "\n💬 Reply with the number of the song to download.";

searchCache[event.senderID] = list;
return api.sendMessage(msg, event.threadID, (err, info) => {
  global.client.handleReply.push({
    name: module.exports.config.name,
    messageID: info.messageID,
    author: event.senderID,
    type: "music_select"
  });
});

} catch (e) { console.error(e); return api.sendMessage("❌ Error fetching music. Try again later.", event.threadID, event.messageID); } };

module.exports.handleReply = async function ({ api, event, handleReply }) { if (handleReply.author !== event.senderID) return; const choice = parseInt(event.body); if (isNaN(choice) || choice < 1 || choice > searchCache[event.senderID].length) return api.sendMessage("❌ Invalid selection.", event.threadID, event.messageID);

const video = searchCache[event.senderID][choice - 1]; const videoUrl = video.url;

try { const res = await axios.get(https://api.princetechn.com/api/download/yta?apikey=prince&url=${encodeURIComponent(videoUrl)}); const song = res.data.result; if (!song.download_url) return api.sendMessage("❌ Failed to get download link.", event.threadID);

const filePath = path.join(__dirname, `cache/${event.senderID}_music.mp3`);
const thumbPath = path.join(__dirname, `cache/${event.senderID}_thumb.jpg`);

// Download audio
const audio = await axios.get(song.download_url, { responseType: "arraybuffer" });
await fs.writeFile(filePath, audio.data);

// Download thumbnail
const thumb = await axios.get(song.thumbnail, { responseType: "arraybuffer" });
await fs.writeFile(thumbPath, thumb.data);

await api.sendMessage({
  body: `🎧 ${song.title}\n⏱ Duration: ${song.duration}`,
  attachment: fs.createReadStream(thumbPath)
}, event.threadID, async () => {
  await api.sendMessage({
    body: `🎶 Here's your song:`,
    attachment: fs.createReadStream(filePath)
  }, event.threadID);

  // Cleanup
  fs.unlinkSync(filePath);
  fs.unlinkSync(thumbPath);
});

} catch (e) { console.error(e); api.sendMessage("❌ Error downloading music.", event.threadID); } };

