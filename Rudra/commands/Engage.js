module.exports.config = {
  name: "engage",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Create fun engagement wishes between two members",
  commandCategory: "fun",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  },
  cooldowns: 5
};

module.exports.run = async function ({ Users, api, event }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const pathImg = __dirname + "/cache/engage-bg.png";
  const pathAvt1 = __dirname + "/cache/avt1.png";
  const pathAvt2 = __dirname + "/cache/avt2.png";

  const threadInfo = await api.getThreadInfo(event.threadID);
  const senderID = event.senderID;
  const botID = api.getCurrentUserID();

  const allMembers = threadInfo.userInfo.filter(u => u.id !== senderID && u.id !== botID);
  const randomUser = allMembers[Math.floor(Math.random() * allMembers.length)];
  const senderName = await Users.getNameUser(senderID);
  const receiverName = await Users.getNameUser(randomUser.id);

  const wishes = [
    "Tumhari muskurahat meri sabse badi khushi hai 😊",
    "Tumhara har din khubsurat ho 💖",
    "Tum jaise log dil chura lete hain 💘",
    "Ek smile bhej do... din ban jaayega 💫",
    "Tumhare bina group adhoora lagta hai 😢",
    "Har subah tumhari yaadon se hoti hai ☀️",
    "Tum perfect ho... just saying 😌",
    "Kash ek cup chai tumhare sath ho ☕❤️"
  ];

  const duas = [
    "🤲 Mubarak ho! Allah Pak aap dono ko hamesha salamat rakhe 💞",
    "💐 Khush raho dono, har lamha mohabbat se bhara ho ❤️",
    "✨ Dua hai Allah aapki jodi ko nazar se bachaye aur barkat ata farmaye 🕊️",
    "🫶 Allah kare yeh rishta aur gehra ho jaaye, Ameen 🤍",
    "🌹 Har dua mein aap dono ka naam ho, itni khushiyan milein InshaAllah ☀️",
    "💑 Allah Pak tum dono ke darmiyan mohabbat ko qayam rakhe 💫",
    "🥰 Dua hai ke tum dono ek dusre ki muskurahat ban jao hamesha ke liye",
    "👑 Aap dono ki jodi ko kisi ki nazar na lage, Ameen 💝",
    "🌙 Jese chand aur raat — waise hi tum dono ek doosre ke saath! Allah ka karam sada rahe",
    "🎊 Mubarak ho! Aap dono ka rishta hamesha barkat se bhara rahe 💖"
  ];

  const wish = wishes[Math.floor(Math.random() * wishes.length)];
  const dua = duas[Math.floor(Math.random() * duas.length)];

  // Get avatars
  const avt1 = (
    await axios.get(
      `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(avt1, "utf-8"));

  const avt2 = (
    await axios.get(
      `https://graph.facebook.com/${randomUser.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(avt2, "utf-8"));

  // Create canvas
  const bg = createCanvas(1000, 400);
  const ctx = bg.getContext("2d");

  // Background color
  ctx.fillStyle = "#fff0f5";
  ctx.fillRect(0, 0, 1000, 400);

  // Draw avatars
  const img1 = await loadImage(pathAvt1);
  const img2 = await loadImage(pathAvt2);
  ctx.drawImage(img1, 150, 50, 250, 250);
  ctx.drawImage(img2, 600, 50, 250, 250);

  // Text
  ctx.font = "28px Arial";
  ctx.fillStyle = "#d81b60";
  ctx.fillText(`${senderName} ➤ ${receiverName}`, 340, 330);
  ctx.font = "22px sans-serif";
  ctx.fillStyle = "#6a1b9a";
  ctx.fillText(`💌 "${wish}"`, 320, 370);

  const buffer = bg.toBuffer();
  fs.writeFileSync(pathImg, buffer);
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  return api.sendMessage({
    body: `💍 *Engagement Confirmed!*\n\n❤️ ${senderName} ne ${receiverName} ko ek pyaari si wish bheji hai!\n💌 "${wish}"\n\n🌸 Dua: ${dua}`,
    attachment: fs.createReadStream(pathImg),
    mentions: [
      { tag: senderName, id: senderID },
      { tag: receiverName, id: randomUser.id }
    ]
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
