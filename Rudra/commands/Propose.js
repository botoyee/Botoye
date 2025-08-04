module.exports.config = {
  name: "purpose",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "AZIZ",
  description: "Create image with custom text",
  commandCategory: "general",
  usages: "purpose [text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const pathImg = __dirname + '/cache/markngu.png';
  const text = args.join(" ");

  if (!text) return api.sendMessage("⚠️ Enter your text to mark!", event.threadID, event.messageID);

  try {
    // Download background image
    const response = await axios.get("https://i.imgur.com/GvrPI6v.jpeg", { responseType: 'arraybuffer' });
    fs.writeFileSync(pathImg, Buffer.from(response.data, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Set initial font
    let fontSize = 100;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "#0000FF";
    ctx.textAlign = "start";

    // Reduce font size if too wide
    while (ctx.measureText(text).width > 2250) {
      fontSize--;
      ctx.font = `bold ${fontSize}px Arial`;
    }

    const lines = await this.wrapText(ctx, text, 800);
    ctx.fillText(lines.join('\n'), 620, 370);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
  } catch (error) {
    console.error("❌ Error in purpose command:", error);
    return api.sendMessage("❌ Failed to create image. Try again later.", event.threadID, event.messageID);
  }
};
