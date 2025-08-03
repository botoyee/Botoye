const axios = require('axios');
const fs = require('fs-extra');
const Canvas = require('canvas');
const path = require('path');

module.exports.config = {
  name: "engagement",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan x Kashif",
  description: "Create an engagement card",
  commandCategory: "love",
  usages: "@tag",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  const mention = Object.keys(event.mentions);
  if (mention.length != 1)
    return api.sendMessage("💍 Kisi aik ko hi tag karo jisse tumhara Engagement ho...", event.threadID);

  const one = event.senderID;
  const two = mention[0];
  const oneName = event.senderID == event.senderID ? "Aap" : event.senderID;
  const twoName = event.mentions[two];

  const oneAvatar = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${global.config.ACCESS_TOKEN}`, { responseType: 'arraybuffer' });
  const twoAvatar = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${global.config.ACCESS_TOKEN}`, { responseType: 'arraybuffer' });

  fs.writeFileSync(__dirname + `/cache/one.png`, Buffer.from(oneAvatar.data, 'utf-8'));
  fs.writeFileSync(__dirname + `/cache/two.png`, Buffer.from(twoAvatar.data, 'utf-8'));

  const canvas = Canvas.createCanvas(800, 500);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage("https://i.imgur.com/Jj9wzDQ.jpg"); // Romantic engagement background
  const oneImg = await Canvas.loadImage(__dirname + `/cache/one.png`);
  const twoImg = await Canvas.loadImage(__dirname + `/cache/two.png`);

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(oneImg, 150, 130, 200, 200);
  ctx.drawImage(twoImg, 450, 130, 200, 200);

  ctx.font = "bold 35px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("💍 Engagement Mubarak 💍", 220, 70);
  ctx.font = "bold 25px Arial";
  ctx.fillText(`${event.senderID}`, 170, 360);
  ctx.fillText(`${event.mentions[two]}`, 470, 360);

  const final = __dirname + `/cache/engage.png`;
  const buffer = canvas.toBuffer();
  fs.writeFileSync(final, buffer);

  return api.sendMessage({
    body: `💘 *Engagement Confirmed!*\n\n🎉 Mubarak ho ${event.mentions[two]} aur aap dono ko!`,
    attachment: fs.createReadStream(final),
    mentions: [{
      tag: event.mentions[two],
      id: two
    }]
  }, event.threadID, () => {
    fs.unlinkSync(__dirname + `/cache/one.png`);
    fs.unlinkSync(__dirname + `/cache/two.png`);
    fs.unlinkSync(final);
  });
    }
