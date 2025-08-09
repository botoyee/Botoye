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
		const text = `🕊️🤍 𒆜 پــاکــســتــا ن 🇵🇰 ز نــد ہ بــا د 💚🌙 𒆜\n
خــو ن ســے ســیــنــچــی هــے یــہ خــوشــبــو بــهـری مــٹــی هــم نــے،\n
جــا ں لــٹــا کــر بــهـی ســنــبــا لــی هــے یــہ بــســتــی هــم نــے۔\n\n
چــا نــد تــا رے کــا یــہ پــر چــم هــے هــمــا ری پــهـچــا ن،\n
ا س کــے ســا ئــے مــیں هــے مــحــفــو ظ هــر د ل، هــر جــا ن۔\n\n
اے وطــن! تــیــری فــضــا ؤ ں مــیں هــے جــنــت کــا ســکــو ن،\n
تــیــرے قــدمــو ں پــے نــثــا ر هــو مــیــری جــا ن، مــیــرا خــو ن۔\n\n
پــا کــســتــا ن ر هــے آ بــا د تــا قــیــا مــت یــو نــهـی،\n
هــر د عــا مــیں یــهـی نــغــمــہ، پــا کــســتــا ن ز نــد ه بــا د! 🇵🇰💚\n\n
آ ز ا د ی مــبــا ر ک! 🎉✨`;

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
