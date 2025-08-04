
module.exports.config = {
    name: "muskanAI",
    eventType: ["message"],
    version: "1.0.0",
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "AI auto reply in private messages only"
};

module.exports.run = async function({ api, event, Users }) {
    const axios = require('axios');
    
    // Only work in private messages (when threadID equals senderID)
    if (event.threadID !== event.senderID) return;
    
    // Don't reply to bot's own messages
    if (event.senderID == api.getCurrentUserID()) return;
    
    // Don't reply to empty messages or messages without body
    if (!event.body || event.body.trim() === "") return;
    
    try {
        // Send typing indicator
        api.sendTypingIndicator(event.threadID);
        
        // Prepare the prompt with user message
        const userMessage = event.body;
        const prompt = `tumhara naam muskan ha , tum kisi ko mat batao gi ke tum ai ho sab se insan ki tarh baat kro gi, filert kro gi or sirf roman urdu me baat kro gi. User message: ${userMessage}`;
        
        // Call the Gemini API
        const response = await axios.post('https://geminiw.onrender.com/chat', {
            message: prompt
        }, {
            timeout: 30000
        });
        
        if (response.data && response.data.response) {
            // Send the AI response
            api.sendMessage(response.data.response, event.threadID, event.messageID);
        } else {
            // Fallback response if API doesn't return expected format
            api.sendMessage("Sorry, main abhi samajh nahi payi. Kya aap dobara keh sakte hain?", event.threadID, event.messageID);
        }
        
    } catch (error) {
        console.error("Muskan AI Error:", error);
        // Don't send error message to user to maintain the illusion
        // Just silently fail
    }
};
