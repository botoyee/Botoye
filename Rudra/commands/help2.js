const fs = require("fs");

module.exports.config = {
	name: "help2",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Ayan Ali - UID: https://facebook.com/61565142011404",
	description: "Beginner's Guide To All Bot Commands",
	commandCategory: "System",
	usages: "[ listbox ]",
	cooldowns: 7,
	envConfig: {
		autoUnsend: true,
		delayUnsend: 500
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
		"helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
		"user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

	if (!body || typeof body == "undefined" || body.indexOf("help2") != 0) return;
	const splitBody = body.slice(body.indexOf("help2")).trim().split(/\s+/);
	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};

module.exports.run = function({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	if (!command) {
		const arrayInfo = [];
		const page = parseInt(args[0]) || 1;
    	const numberOfOnePage = 9999;
    	let i = 0;
    	let msg = "";

		for (var [name, value] of (commands)) {
			let styledName = `🌟 ${name} [${value.config.commandCategory || "Other"}]`;
			arrayInfo.push(styledName);
		}

    	arrayInfo.sort();
    	const startSlice = numberOfOnePage * page - numberOfOnePage;
    	i = startSlice;
    	const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    	for (let item of returnArray) msg += `『 ${++i} 』${prefix}${item}\n`;

    	const heading = `╔══🌐 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗟𝗜𝗦𝗧 🌐══╗`;
    	const text = `\nPage (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})`;

    	const imgPath = __dirname + "/noprefix/ayanhelp.jpg";
    	const attachment = fs.existsSync(imgPath) ? fs.createReadStream(imgPath) : null;

    	return api.sendMessage({
			body: heading + "\n\n" + msg + text,
			attachment
		}, threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
				return api.unsendMessage(info.messageID);
			}
		}, messageID);
	}

	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};
