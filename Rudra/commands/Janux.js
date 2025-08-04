
const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "janux",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "Search and download videos",
    commandCategory: "media",
    usages: "janux <search query>",
    cooldowns: 10,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, body } = event;
    
    if (handleReply.author != event.senderID) return;
    
    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > handleReply.results.length) {
        return api.sendMessage('⚠️ Please reply with a valid number from the list!', threadID, messageID);
    }
    
    // Remove the handleReply
    api.unsendMessage(handleReply.messageID);
    
    const selectedVideo = handleReply.results[choice - 1];
    const processingMsg = await api.sendMessage('🔄 Downloading video, please wait...', threadID, messageID);
    
    try {
        // Use the download API
        const videoUrl = selectedVideo.url || selectedVideo.link || selectedVideo.video_url;
        if (!videoUrl) {
            api.unsendMessage(processingMsg.messageID);
            return api.sendMessage('❌ Video URL not found. Please try again.', threadID, messageID);
        }
        
        const downloadUrl = `https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=${encodeURIComponent(videoUrl)}`;
        const downloadRes = await axios.get(downloadUrl, { timeout: 60000 });
        
        console.log("Download API Response:", JSON.stringify(downloadRes.data, null, 2)); // Debug log
        
        let videoDownloadUrl;
        if (downloadRes.data && downloadRes.data.url) {
            videoDownloadUrl = downloadRes.data.url;
        } else if (downloadRes.data && downloadRes.data.download_url) {
            videoDownloadUrl = downloadRes.data.download_url;
        } else if (downloadRes.data && downloadRes.data.result && downloadRes.data.result.url) {
            videoDownloadUrl = downloadRes.data.result.url;
        } else {
            api.unsendMessage(processingMsg.messageID);
            return api.sendMessage('❌ Failed to get download link. Please try again.', threadID, messageID);
        }
        
        // Download the video file
        const videoResponse = await axios.get(videoDownloadUrl, {
            responseType: 'arraybuffer',
            timeout: 120000,
            maxContentLength: 50 * 1024 * 1024 // 50MB limit
        });
        
        // Save the video
        const cachePath = __dirname + `/cache/janux_${Date.now()}.mp4`;
        fs.writeFileSync(cachePath, Buffer.from(videoResponse.data));
        
        // Check file size (Facebook has 25MB limit)
        const stats = fs.statSync(cachePath);
        if (stats.size > 25 * 1024 * 1024) {
            fs.unlinkSync(cachePath);
            api.unsendMessage(processingMsg.messageID);
            return api.sendMessage('❌ Video file is too large (>25MB). Cannot send via Facebook.', threadID, messageID);
        }
        
        // Send the video
        api.unsendMessage(processingMsg.messageID);
        return api.sendMessage({
            body: `✅ Video downloaded successfully!\n📹 Title: ${selectedVideo.title}\n⏱️ Duration: ${selectedVideo.duration || 'Unknown'}`,
            attachment: fs.createReadStream(cachePath)
        }, threadID, () => fs.unlinkSync(cachePath), messageID);
        
    } catch (error) {
        console.error("Error downloading video:", error);
        api.unsendMessage(processingMsg.messageID);
        
        let errorMsg = '❌ Failed to download video.';
        if (error.code === 'ECONNABORTED') {
            errorMsg += ' Request timed out.';
        } else if (error.response?.status) {
            errorMsg += ` Server error: ${error.response.status}`;
        }
        
        return api.sendMessage(errorMsg + ' Please try again later.', threadID, messageID);
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (!args.length) {
        return api.sendMessage('⚠️ Please provide a search query!\n\nUsage: janux <search term>\nExample: janux funny videos', threadID, messageID);
    }
    
    const query = args.join(' ');
    const searchingMsg = await api.sendMessage('🔍 Searching for videos, please wait...', threadID, messageID);
    
    try {
        // Use the search API
        const searchUrl = `https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=${encodeURIComponent(query)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 30000 });
        
        console.log("API Response:", JSON.stringify(searchRes.data, null, 2)); // Debug log
        
        // Handle different possible response structures
        let results;
        if (searchRes.data && searchRes.data.result && Array.isArray(searchRes.data.result)) {
            results = searchRes.data.result;
        } else if (searchRes.data && Array.isArray(searchRes.data)) {
            results = searchRes.data;
        } else if (searchRes.data && searchRes.data.data && Array.isArray(searchRes.data.data)) {
            results = searchRes.data.data;
        } else {
            console.log("Unexpected API response structure:", searchRes.data);
            api.unsendMessage(searchingMsg.messageID);
            return api.sendMessage('❌ No videos found for your search query. Please try different keywords.', threadID, messageID);
        }
        
        if (!results || results.length === 0) {
            api.unsendMessage(searchingMsg.messageID);
            return api.sendMessage('❌ No videos found for your search query. Please try different keywords.', threadID, messageID);
        }
        
        results = results.slice(0, 6); // Limit to 6 results
        let message = `🔍 Found ${results.length} videos for "${query}":\n\n`;
        
        results.forEach((video, index) => {
            message += `${index + 1}. 📹 ${video.title || video.name || 'Unknown Title'}\n`;
            message += `⏱️ Duration: ${video.duration || video.time || 'Unknown'}\n`;
            message += `👀 Views: ${video.views || video.view_count || 'Unknown'}\n`;
            message += `────────────────\n`;
        });
        
        message += '\n💬 Reply with the number (1-' + results.length + ') to download that video!';
        
        api.unsendMessage(searchingMsg.messageID);
        
        return api.sendMessage(message, threadID, (error, info) => {
            if (!error) {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    results: results
                });
            }
        }, messageID);
        
    } catch (error) {
        console.error("Error in janux search:", error);
        api.unsendMessage(searchingMsg.messageID);
        
        let errorMsg = '❌ Failed to search for videos.';
        if (error.code === 'ECONNABORTED') {
            errorMsg += ' Request timed out.';
        } else if (error.response?.status) {
            errorMsg += ` Server error: ${error.response.status}`;
        }
        
        return api.sendMessage(errorMsg + ' Please try again later.', threadID, messageID);
    }
};
