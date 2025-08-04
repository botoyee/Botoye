const axios = require("axios");

module.exports.config = {
  name: "masti",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Search TikTok videos and download by number",
  commandCategory: "media",
  usages: "[search term] or [number after search]",
  cooldowns: 2,
  listenEvents: true
};

let tiktokSearchCache = {};

module.exports.handleEvent = async function ({ event, api }) {
  const { body, senderID, threadID, messageID } = event;
  if (!body || !tiktokSearchCache[senderID]) return;

  const index = parseInt(body.trim());
  if (isNaN(index)) return;

  const results = tiktokSearchCache[senderID];
  const selected = results[index - 1];
  if (!selected) {
    return api.sendMessage("❌ Invalid number selected. Please try again.", threadID, messageID);
  }

  try {
    const res = await axios.get(`https://api.princetechn.com/api/download/tiktok`, {
      params: {
        apikey: "prince",
        url: selected.url
      }
    });

    const { video, title } = res.data.result;

    const fileRes = await axios.get(video, { responseType: 'arraybuffer' });

    api.sendMessage({
      body: `📥 Downloaded: ${title || "TikTok Video"}`,
      attachment: Buffer.from(fileRes.data, "utf-8")
    }, threadID, () => {
      delete tiktokSearchCache[senderID]; // Clear cache after download
    });

  } catch (err) {
    console.error(err);
    api.sendMessage("⚠️ Failed to download video. Try again later.", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args[0]) {
    return api.sendMessage("🔍 Please enter a search query.\nExample: masti princetechnexus", threadID, messageID);
  }

  const query = encodeURIComponent(args.join(" "));

  try {
    const res = await axios.get(`https://api.princetechn.com/api/search/tiktoksearch`, {
      params: {
        apikey: "prince",
        query
      }
    });

    const results = res.data.result.slice(0, 10); // Limit to 10 results
    if (results.length === 0) {
      return api.sendMessage("❌ No results found.", threadID, messageID);
    }

    let msg = "🎬 TikTok Search Results:\n";
    results.forEach((item, i) => {
      msg += `${i + 1}. ${item.title?.slice(0, 50) || "Untitled"}\n`;
    });
    msg += "\n🔢 Reply with the number to download.";

    // Cache results per user
    tiktokSearchCache[senderID] = results;

    return api.sendMessage(msg, threadID, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Failed to fetch search results.", threadID, messageID);
  }
};
