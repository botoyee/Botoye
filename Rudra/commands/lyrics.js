const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createReadStream, unlinkSync, writeFileSync } = fs;

module.exports.config = {
    name: "lyrics",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mirrykal",
    description: "Song ke lyrics fetch kare",
    commandCategory: "media",
    usages: "+lyrics [song name or query]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const searchQuery = args.join(" "); // User ka search query liya

    if (!searchQuery) {
        return api.sendMessage("❗ please lyrics search karne ke liye song ka naam provide kare. Usage: `.lyrics [song name]`", threadID, messageID);
    }

    let imagePath = "";

    try {
        // Step 1: PrinceTech API se lyrics details fetch kare
        api.sendMessage(`🎵 "${searchQuery}" ke lyrics search kar raha hoon...`, threadID, messageID);
        const apiUrl = `https://api.princetechn.com/api/search/lyrics?apikey=prince&query=${encodeURIComponent(searchQuery)}`;
        const apiResponse = await axios.get(apiUrl);

        const { status, success, result } = apiResponse.data;

        if (status !== 200 || !success || !result || !result.lyrics) {
            throw new Error(`❌ PrinceTech API se lyrics fetch karne me error: ${apiResponse.data.message || "Koi lyrics nahi mila ya unknown error"}`);
        }

        const { title, artist, image, lyrics } = result;

        // Step 2: Image (thumbnail) download kare aur pehla message bheje
        imagePath = path.join(__dirname, "cache", `lyrics_image_${Date.now()}.jpg`);
        // Agar image URL available nahi hai, toh placeholder use karein
        const imageUrl = image || "https://placehold.co/600x400/FF0000/FFFFFF?text=No+Image"; 
        const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
        writeFileSync(imagePath, imageRes.data);

        await api.sendMessage(
            {
                body: `✅ *Lyrics Found:*\n🎶 Title: ${title}\n🎤 Artist: ${artist}\n\nAb lyrics bhej raha hoon...`,
                attachment: createReadStream(imagePath)
            },
            threadID
        );

        // Step 3: Lyrics doosre message mein bheje
        await api.sendMessage(
            {
                body: `📜 *Lyrics for "${title}" by ${artist}:*\n\n${lyrics}`
            },
            threadID,
            messageID // Original message ke reply mein bheje
        );

    } catch (err) {
        console.error("🔥 Lyrics command error:", err.message || err);
        api.sendMessage(`🚫 Lyrics fetch karne me error aagya. please song ka naam sahi se likhe ya server check kare! Error: ${err.message}`, threadID, messageID);
    } finally {
        // Temporary file delete kare
        if (fs.existsSync(imagePath)) {
            unlinkSync(imagePath);
        }
    }
};
