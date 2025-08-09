const fs = require("fs");
module.exports.config = {
	name: "Pakistan",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Kashif x Ayan",
	description: "Azadi Mubarak ho 🇵🇰",
	commandCategory: "no prefix",
	usages: "🇵🇰",
	cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
	const { threadID, messageID, body } = event;
	if (!body) return;
	if (body.includes("🇵🇰")) {
		const text = `🌺🌺#وہ__جو__کہتے_ہیں_خاک_ھے_پاکستان💚❤💚

#ان_سے__کہنا_تم__سب__کا__باپ__ھے__پاکستان💚🌹💚
💞

🇵🇰🇵🇰PAKISTAN_ZINDABAD🇵🇰🇵🇰   
🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰🇵🇰`;

		// Send text message first
		api.sendMessage(text, threadID, () => {
			// After 2 seconds, send the audio
			setTimeout(() => {
				api.sendMessage({
					attachment: fs.createReadStream(__dirname + "/noprefix/baja.mp3")
				}, threadID);
			}, 2000); // 2000 milliseconds = 2 seconds
		}, messageID);

		api.setMessageReaction("🇵🇰", event.messageID, () => {}, true);
	}
};

module.exports.run = function() {};
