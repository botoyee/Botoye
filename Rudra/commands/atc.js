module.exports.config = {
  name: "atc",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Arunã i GPT",
  description: "Apply code from buildtooldev and pastebin",
  commandCategory: "Admin",
  usages: "[drop or text]",
  cooldowns: 0,
  dependencies: {
    "pastebin-api": "",
    "cheerio": "",
    "axios": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs");
  const cheerio = require("cheerio");
  const moment = require("moment-timezone");
  const { join, resolve } = require("path");
  const { threadID, messageID, messageReply, type } = event;

  const name = args[0];
  let text = "";

  if (type === "message_reply") {
    text = messageReply.body;
  }

  if (!text && !name) {
    return api.sendMessage(`⚠️ | G BABU KIA HUA?`, threadID, messageID);
  }

  // ➕ PASTEBIN upload logic
  if (!text && name) {
    return fs.readFile(`${__dirname}/${args[0]}.js`, "utf-8", async (err, data) => {
      if (err) return api.sendMessage(`❌ | Babu, "${args[0]}" Command Nahi Mila Apke Bot Me.`, threadID, messageID);

      const PasteClient = require("pastebin-api");
      const client = new PasteClient("R02n6-INPJxqCQ5VtLkAbPjuKGARHhb");

      async function paste(name) {
        const url = await client.createPaste({
          code: data,
          format: "javascript",
          name: name,
          expiresIn: "1H"
        });
        const id = url.split("/")[3];
        return `https://pastebin.com/raw/` + id;
      }

      const link = await pastePin(args[1] || "noname");
      const time = moment().tz("Asia/Kolkata").format("DD/MM/YYYY - hh:mm A");

      // Fetch admin name
      const info = await api.getUserInfo(senderID);
      const adminName = info[senderID].name || "Admin";

      const msg = `🔰 FILE UPLOADED TO PASTEBIN\n` +
        `\n📁 File: ${args[0]}.js` +
        `\n🔗 Link: ${link}` +
        `\n⏰ Time: ${time}` +
        `\n👤 Sent By: ${adminName}\n`;

      return api.sendMessage(msg, threadID, messageID);
    });
  }

  // ➕ Pastebin Download & Apply
  if (/^(https:\/\/pastebin\.com\/)(.*)/.test(args[0])) {
    const url = args[0].replace("https://pastebin.com/", "https://pastebin.com/raw/");

    if (!url) return api.sendMessage(`❌ | No valid link found.`, threadID, messageID);

    axios.get(url).then(res => {
      fs.writeFile(`${__dirname}/${args[1]}.js`, data, "utf-8", function (err) {
        if (err) return api.sendMessage(`❌ | Failed to apply code: ${args[0]}.js`, threadID, messageID);

        return api.sendMessage(`✅ | Code applied: ${args[1]}.js\nUse command to activate.`, threadID, messageID);
      });
    });
  }

  // ➕ BuildTool or TinyURL
  if (url[0].includes("buildtool") || url[0].includes("tinyurl.com")) {
    try {
      const response = await axios.get(messageReply.body);
      const load = cheerio.load(response.data);
      load("language-javascript").each((index, el) => {
        if (index !== 1) return;
        const code = load(el).text();
        fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8", (err) => {
          if (err) return api.sendMessage(`❌ | Error writing ${args[0]}.js`, threadID, messageID);

          return api.sendMessage(`✅ | Code added: ${args[0]}.js\nUse Load command to activate.`, threadID, messageID);
        });
      });
    } catch (e) {
      return api.sendMessage(`❌ | Error fetching link.`, threadID, messageID);
    }
    return;
  }

  // ➕ Google Drive raw download
  if (url[0].includes("drive.google.com")) {
    const id = url.match(/[-\w]{25,}/);
    const path = resolve(__dirname, `${args[0]}.js`);
    try {
      await axios({
        method: "GET",
        url: `https://drive.google.com/u/0/uc?id=${id}&export=download`,
        data: "",
        responseType: "stream"
      }).then(res => {
        res.data.pipe(fs.createWriteStream(path)).on("close", () => {
          return api.sendMessage(`✅ | Code added: ${args[0]}.js\n🛠 Change file to .txt if any error.`, threadID, messageID);
        });
      });
    } catch (e) {
      return api.sendMessage(`❌ | Failed to apply: ${args[0]}.js`, threadID, messageID);
    }
  }
};
