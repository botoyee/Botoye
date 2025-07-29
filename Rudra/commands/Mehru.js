const fs = require("fs");
module.exports.config = {
	name: "chocolate",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "Mehru",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Mehru)==0 || event.body.indexOf("mehru")==0 || event.body.indexOf("@Meher Mehruu")==0 || event.body.indexOf("Mehru")==0) {
		var msg = {
				body: "🌸✨ Mahfil ki rooh, baaton ki malika – Mehru! ✨🌸
Jo sirf ek naam nahi, ek vibe hai...
Jahan Mehru hoti hai, wahan discipline bhi stylish lagta hai 💫
Group ki Queen Admin 👑 – Mehru!
Naaz hai humein tum par, Mehru… kyunki tum sirf admin nahi, dilon ki jaan ho! ❤️🔥",
				attachment: fs.createReadStream(__dirname + `/cache/mehru.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💖", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
