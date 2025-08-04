const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝘔𝘪𝘳𝘳𝘺𝘬𝘢𝘭 (mod)",
  description: "Search and download music from YouTube",
  commandCategory: "media",
  usages: "[search query]",
  cooldowns: 10
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;

  if (senderID !== handleReply.author) {
    return api.sendMessage("❌ Only the person who initiated the search can select a song.", threadID, messageID);
  }

  const choice = parseInt(body);
  if (isNaN(choice) || choice < 1 || choice > handleReply.results.length) {
    return api.sendMessage(`❌ Please reply with a number between 1 and ${handleReply.results.length}`, threadID, messageID);
  }

  const selectedVideo = handleReply.results[choice - 1];
  const processingMsg = await api.sendMessage('🎧 Downloading your music, please wait...', threadID, messageID);

  try {
    const videoUrl = selectedVideo.url || `https://www.youtube.com/watch?v=${selectedVideo.id}`;
    const urlsToTry = [
      `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(videoUrl)}`,
      `https://api.princetechn.com/api/download/ytdl?apikey=prince&url=${encodeURIComponent(videoUrl)}&format=mp3`
    ];

    let downloadRes, audioDownloadUrl;
    for (let url of urlsToTry) {
      try {
        const res = await axios.get(url, { timeout: 30000 });
        const data = res.data;
        if (data?.download) {
          audioDownloadUrl = data.download;
          break;
        } else if (data?.result?.download) {
          audioDownloadUrl = data.result.download;
          break;
        } else if (data?.result?.url) {
          audioDownloadUrl = data.result.url;
          break;
        } else if (data?.url) {
          audioDownloadUrl = data.url;
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!audioDownloadUrl) {
      api.unsendMessage(processingMsg.messageID);
      return api.sendMessage("❌ Failed to get download link. Please try again.", threadID, messageID);
    }

    const audioResponse = await axios.get(audioDownloadUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });

    const cachePath = path.join(__dirname, 'cache');
    fs.ensureDirSync(cachePath);

    const filePath = path.join(cachePath, `music_${Date.now()}.mp3`);
    fs.writeFileSync(filePath, Buffer.from(audioResponse.data));

    const message = {
      body: `🎵 Here's your music!\n\n📌 Title: ${selectedVideo.title}\n⏱ Duration: ${selectedVideo.duration || 'Unknown'}\n👤 Channel: ${selectedVideo.channel || 'Unknown'}`,
      attachment: fs.createReadStream(filePath)
    };

    api.unsendMessage(processingMsg.messageID);
    api.sendMessage(message, threadID, () => fs.unlinkSync(filePath), messageID);
    api.unsendMessage(handleReply.messageID);

  } catch (err) {
    console.error("Download error:", err);
    api.unsendMessage(processingMsg.messageID);
    return api.sendMessage("❌ Failed to download the music. Please try again later.", threadID, messageID);
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args.length) {
    return api.sendMessage("⚠️ Please provide a search query!\n\nExample: music tum hi ho", threadID, messageID);
  }

  const query = args.join(' ');
  const loadingMsg = await api.sendMessage('🔍 Searching for music...', threadID, messageID);

  try {
    const urlsToTry = [
      `https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/search/youtube?apikey=prince&query=${encodeURIComponent(query)}`
    ];

    let results = null;
    for (let url of urlsToTry) {
      try {
        const res = await axios.get(url, { timeout: 30000 });
        const data = res.data;

        results =
          data?.result && Array.isArray(data.result) ? data.result :
          data?.data && Array.isArray(data.data) ? data.data :
          data?.videos && Array.isArray(data.videos) ? data.videos :
          data?.items && Array.isArray(data.items) ? data.items :
          Array.isArray(data) ? data : null;

        if (results && results.length > 0) break;
      } catch (err) {
        continue;
      }
    }

    if (!results || results.length === 0) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage("❌ No music found. Try different keywords.", threadID, messageID);
    }

    results = results.slice(0, 6); // Top 6
    let text = `🎵 Found ${results.length} songs for: "${query}"\n\n`;
    results.forEach((video, i) => {
      text += `${i + 1}. ${video.title || 'Untitled'}\n`;
      text += `⏱ ${video.duration || 'Unknown'} | 👤 ${video.channel || video.author || 'Unknown'}\n`;
      text += `──────────────────────────────\n`;
    });
    text += "\n📩 Reply with the number of the song you want to download.";

    api.unsendMessage(loadingMsg.messageID);
    return api.sendMessage(text, threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          results: results.map(video => ({
            title: video.title || 'Untitled',
            url: video.url || video.link || `https://www.youtube.com/watch?v=${video.id || video.videoId}`,
            duration: video.duration || video.time || 'Unknown',
            channel: video.channel || video.author || video.uploader || 'Unknown',
            thumbnail: video.thumbnail || video.thumb || null
          }))
        });
      }
    }, messageID);

  } catch (err) {
    console.error("Search error:", err);
    api.unsendMessage(loadingMsg.messageID);
    return api.sendMessage("❌ Error during search. Please try again later.", threadID, messageID);
  }
};
