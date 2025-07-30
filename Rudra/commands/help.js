const fs = require("fs");

module.exports.config = {
  name: "help",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Modified by Ayan Ali",
  description: "Show all command list or command details",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 1,
};

module.exports.languages = {
  en: {
    moduleInfo: `🌟 𝘾𝙊𝙈𝙈𝘼𝙉𝘿: %1 🌟\n━━━━━━━━━━━━━━\n📌 𝗗𝗲𝘀𝗰: %2\n📎 𝗨𝘀𝗮𝗴𝗲: %3\n📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4\n⏱ 𝗪𝗮𝗶𝘁: %5s\n🔐 𝗣𝗲𝗿𝗺: %6\n\n👨‍💻 𝗖𝗿𝗲𝗱𝗶𝘁: %7`,
    helpList: `✨ Bot me %1 commands hain. Use: "%2help [command]" for details.`,
    user: "User",
    adminGroup: "Group Admin",
    adminBot: "Bot Admin"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || !body.startsWith("help")) return;

  const splitBody = body.trim().split(/\s+/);
  if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase()])) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  return api.sendMessage({
    body: getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages || "")}`,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermssion == 0 ? getText("user") :
      command.config.hasPermssion == 1 ? getText("adminGroup") : getText("adminBot"),
      command.config.credits
    ),
    attachment: fs.createReadStream(__dirname + `/cache/ayanhelp.jpg`)
  }, threadID, messageID);
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const page = parseInt(args[0]) || 1;
  const itemsPerPage = 20;
  let commandList = Array.from(commands.keys()).sort();
  const totalPages = Math.ceil(commandList.length / itemsPerPage);

  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());
    return api.sendMessage({
      body: getText("moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${(command.config.usages || "")}`,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermssion == 0 ? getText("user") :
        command.config.hasPermssion == 1 ? getText("adminGroup") : getText("adminBot"),
        command.config.credits
      ),
      attachment: fs.createReadStream(__dirname + `/cache/ayanhelp.jpg`)
    }, threadID, messageID);
  }

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const displayCommands = commandList.slice(start, end).map((cmd, index) =>
    `『${start + index + 1}』 ➤ ${prefix}${cmd}`).join("\n");

  const header = `╭─────────────⭓\n  ✨ 𝙔𝙊𝙐𝙍 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝙈𝙀𝙉𝙐 ✨\n╰─────────────⭓`;
  const footer = `\n\n📄 Page: ${page}/${totalPages}  |  Total: ${commandList.length} cmds\n🔗 Owner: Ayan Ali\n🌐 fb.com/61565142011404`;

  return api.sendMessage({
    body: `${header}\n${displayCommands}${footer}`,
    attachment: fs.createReadStream(__dirname + `/noprefix/ayanhelp.jpg`)
  }, threadID, messageID);
};
