
const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "enhancer",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "Auto upload image to Imgur then enhance it",
    commandCategory: "image",
    usages: "enhancer [reply to image]",
    cooldowns: 10,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    
    // Check if user replied to an image
    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage('⚠️ Please reply to an image to enhance it!', threadID, messageID);
    }
    
    const imageUrl = messageReply.attachments[0].url;
    
    // Send processing message
    const processingMsg = await api.sendMessage('🔄 Uploading to Imgur and enhancing image, please wait...', threadID, messageID);
    
    try {
        // Step 1: Upload to Imgur using your existing API
        const res = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`);
        const apiUrl = res.data.csb;
        
        const uploadRes = await axios.get(`${apiUrl}/nazrul/imgur?link=${encodeURIComponent(imageUrl)}`, {
            timeout: 30000
        });
        
        const uploaded = uploadRes.data.uploaded;
        
        if (!uploaded || !uploaded.image) {
            api.unsendMessage(processingMsg.messageID);
            return api.sendMessage('❌ Failed to upload image to Imgur. Please try again.', threadID, messageID);
        }
        
        const imgurLink = uploaded.image;
        
        // Step 2: Enhance the image using the Imgur link
        // You can change this URL to whatever enhancer API you want to use
        const enhancedImg = await axios.get(`https://api.popcat.xyz/clown?image=${imgurLink}`, { 
            responseType: "arraybuffer",
            timeout: 30000
        });
        
        // Step 3: Save and send the enhanced image
        const cachePath = __dirname + `/cache/enhanced_${Date.now()}.png`;
        fs.writeFileSync(cachePath, Buffer.from(enhancedImg.data, "utf-8"));
        
        // Delete processing message
        api.unsendMessage(processingMsg.messageID);
        
        // Send the enhanced image
        return api.sendMessage({
            body: `✅ Image enhanced successfully!\n🔗 Original Imgur link: ${imgurLink}`,
            attachment: fs.createReadStream(cachePath)
        }, threadID, () => fs.unlinkSync(cachePath), messageID);
        
    } catch (error) {
        console.error("Error in enhancer:", error);
        api.unsendMessage(processingMsg.messageID);
        
        let errorMsg = '❌ An error occurred while processing the image.';
        
        if (error.code === 'ECONNABORTED') {
            errorMsg += ' Request timed out.';
        } else if (error.response) {
            errorMsg += ` Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMsg += ' Network error.';
        }
        
        return api.sendMessage(errorMsg + ' Please try again later.', threadID, messageID);
    }
};
