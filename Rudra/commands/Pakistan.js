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

module.exports.handleEvent = function({ api, event }) {
	const { threadID, messageID, body } = event;
	if (!body) return;
	if (body.includes("🇵🇰")) {
		const msg = {
			body:
`‎🇵🇰✦ 𝙋𝘼𝙆𝙄𝙎𝙏𝘼𝙉 𝙕𝙄𝙉𝘿𝘼𝘽𝘼𝘿 ✦🇵🇰

کَـــــــــبھی وادیوں میں گُونجتا ہے میرا نَـــــــــام،  
کَـــــــــبھی پرچم کو چُــــــــومے میرا سَـــــــــلام۔  
یَـــــــــہ وَطن مِیری پہچان ہے، مِیرا فَـــــــــخر ہے،  
آزادی مِیری رُوح ہے، جِسے چاہے ہر دل و جَـــــــــاں! 💚🤍

‎𝗔𝗭𝗔𝗗𝗜 𝗠𝗨𝗕𝗔𝗥𝗔𝗞 𝗛𝗢 💚 𝗣𝗔𝗞𝗜𝗦𝗧𝗔𝗡 𝗭𝗜𝗡𝗗𝗔𝗕𝗔𝗗 🇵🇰`,
			attachment: fs.createReadStream(__dirname + "/noprefix/baja.mp3")
		};
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("🇵🇰", event.messageID, () => {}, true);
	}
};

module.exports.run = function() {};
