
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "music",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
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
    const processingMsg = await api.sendMessage('🎵 Downloading your music, please wait...', threadID, messageID);
    
    try {
        // Use the download API - try different endpoints
        let downloadUrl;
        let downloadRes;
        const videoUrl = selectedVideo.url || selectedVideo.link || `https://www.youtube.com/watch?v=${selectedVideo.id || selectedVideo.videoId}`;
        
        try {
            // Try ytmp3 endpoint first
            downloadUrl = `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(videoUrl)}`;
            downloadRes = await axios.get(downloadUrl, { timeout: 60000 });
        } catch (downloadError) {
            console.log("ytmp3 endpoint failed, trying ytdl...");
            try {
                // Try ytdl endpoint as backup
                downloadUrl = `https://api.princetechn.com/api/download/ytdl?apikey=prince&url=${encodeURIComponent(videoUrl)}&format=mp3`;
                downloadRes = await axios.get(downloadUrl, { timeout: 60000 });
            } catch (secondError) {
                console.log("Both download endpoints failed:", secondError.message);
                api.unsendMessage(processingMsg.messageID);
                return api.sendMessage('❌ Download service temporarily unavailable. Please try again later.', threadID, messageID);
            }
        }
        
        console.log("Download API Response:", JSON.stringify(downloadRes.data, null, 2)); // Debug log
        console.log("Download URL used:", downloadUrl);
        
        // Handle different possible response structures for download URL
        let audioDownloadUrl;
        if (downloadRes.data && downloadRes.data.success === true && downloadRes.data.download) {
            audioDownloadUrl = downloadRes.data.download;
        } else if (downloadRes.data && downloadRes.data.download) {
            audioDownloadUrl = downloadRes.data.download;
        } else if (downloadRes.data && downloadRes.data.url) {
            audioDownloadUrl = downloadRes.data.url;
        } else if (downloadRes.data && downloadRes.data.result && downloadRes.data.result.download) {
            audioDownloadUrl = downloadRes.data.result.download;
        } else if (downloadRes.data && downloadRes.data.result && downloadRes.data.result.url) {
            audioDownloadUrl = downloadRes.data.result.url;
        } else {
            console.log("Could not find download URL in response:", downloadRes.data);
            api.unsendMessage(processingMsg.messageID);
            return api.sendMessage(`❌ Failed to get download link: ${downloadRes.data?.message || downloadRes.data?.error || 'Unknown error'}`, threadID, messageID);
        }
        
        // Download the audio file
        const audioResponse = await axios.get(audioDownloadUrl, {
            responseType: 'arraybuffer',
            timeout: 120000,
            maxContentLength: 50 * 1024 * 1024 // 50MB limit
        });
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }
        
        // Save the audio file
        const fileName = `music_${Date.now()}.mp3`;
        const filePath = path.join(cacheDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(audioResponse.data));
        
        // Download thumbnail if available
        let thumbnailPath = null;
        if (selectedVideo.thumbnail) {
            try {
                const thumbnailResponse = await axios.get(selectedVideo.thumbnail, {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                
                const thumbnailFileName = `thumb_${Date.now()}.jpg`;
                thumbnailPath = path.join(cacheDir, thumbnailFileName);
                fs.writeFileSync(thumbnailPath, Buffer.from(thumbnailResponse.data));
            } catch (thumbError) {
                console.log("Thumbnail download failed:", thumbError.message);
            }
        }
        
        // Prepare message
        const attachments = [fs.createReadStream(filePath)];
        if (thumbnailPath) {
            attachments.push(fs.createReadStream(thumbnailPath));
        }
        
        const message = {
            body: `🎵 Here's your music!\n\n📝 Title: ${selectedVideo.title}\n⏱️ Duration: ${selectedVideo.duration || 'Unknown'}\n👤 Channel: ${selectedVideo.channel || 'Unknown'}`,
            attachment: attachments
        };
        
        api.unsendMessage(processingMsg.messageID);
        api.sendMessage(message, threadID, () => {
            // Clean up files
            fs.unlinkSync(filePath);
            if (thumbnailPath && fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }, messageID);
        
        // Clean up the search results
        api.unsendMessage(handleReply.messageID);
        
    } catch (error) {
        console.error("Download error:", error);
        api.unsendMessage(processingMsg.messageID);
        return api.sendMessage('❌ Failed to download the audio. Please try again later.', threadID, messageID);
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (!args.length) {
        return api.sendMessage('⚠️ Please provide a search query!\n\nUsage: music <search term>\nExample: music love song', threadID, messageID);
    }
    
    const query = args.join(' ');
    const searchingMsg = await api.sendMessage('🔍 Searching for music, please wait...', threadID, messageID);
    
    try {
        // Use the search API - Try the correct YTS API endpoint
        let searchUrl = `https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(query)}`;
        let searchRes;
        
        try {
            searchRes = await axios.get(searchUrl, { timeout: 30000 });
        } catch (apiError) {
            console.log("Primary API failed, trying alternative format...");
            // Try alternative URL format if first fails
            searchUrl = `https://api.princetechn.com/api/search/youtube?apikey=prince&query=${encodeURIComponent(query)}`;
            searchRes = await axios.get(searchUrl, { timeout: 30000 });
        }
        
        console.log("Search API Response:", JSON.stringify(searchRes.data, null, 2)); // Debug log
        console.log("API URL used:", searchUrl);
        
        // Handle different possible response structures
        let results;
        if (searchRes.data && searchRes.data.success === true && searchRes.data.result && Array.isArray(searchRes.data.result)) {
            results = searchRes.data.result;
        } else if (searchRes.data && searchRes.data.result && Array.isArray(searchRes.data.result)) {
            results = searchRes.data.result;
        } else if (searchRes.data && Array.isArray(searchRes.data)) {
            results = searchRes.data;
        } else if (searchRes.data && searchRes.data.data && Array.isArray(searchRes.data.data)) {
            results = searchRes.data.data;
        } else if (searchRes.data && searchRes.data.videos && Array.isArray(searchRes.data.videos)) {
            results = searchRes.data.videos;
        } else if (searchRes.data && searchRes.data.items && Array.isArray(searchRes.data.items)) {
            results = searchRes.data.items;
        } else {
            console.log("Unexpected API response structure:", searchRes.data);
            console.log("API might be returning error or different format");
            api.unsendMessage(searchingMsg.messageID);
            return api.sendMessage(`❌ API Error: ${searchRes.data?.message || searchRes.data?.error || 'No music found'}. Please try different keywords.`, threadID, messageID);
        }
        
        if (!results || results.length === 0) {
            api.unsendMessage(searchingMsg.messageID);
            return api.sendMessage('❌ No music found for your search query. Please try different keywords.', threadID, messageID);
        }
        
        results = results.slice(0, 6); // Limit to 6 results
        let message = `🎵 Found ${results.length} songs for "${query}":\n\n`;
        
        results.forEach((video, index) => {
            message += `${index + 1}. 🎵 ${video.title || video.name || 'Unknown Title'}\n`;
            message += `⏱️ Duration: ${video.duration || video.time || 'Unknown'}\n`;
            message += `👤 Channel: ${video.channel || video.author || video.uploader || 'Unknown'}\n`;
            message += `────────────────\n`;
        });
        
        message += '\n📝 Reply with the number of the song you want to download!';
        
        api.unsendMessage(searchingMsg.messageID);
        return api.sendMessage(message, threadID, (error, info) => {
            if (!error) {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    results: results.map(video => ({
                        title: video.title || video.name || 'Unknown Title',
                        url: video.url || video.link || `https://www.youtube.com/watch?v=${video.id || video.videoId}`,
                        duration: video.duration || video.time || 'Unknown',
                        channel: video.channel || video.author || video.uploader || 'Unknown',
                        thumbnail: video.thumbnail || video.thumb || video.image
                    }))
                });
            }
        }, messageID);
        
    } catch (error) {
        console.error("Search error:", error);
        api.unsendMessage(searchingMsg.messageID);
        return api.sendMessage('❌ An error occurred while searching. Please try again later.', threadID, messageID);
    }
};
