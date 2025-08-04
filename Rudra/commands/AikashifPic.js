const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
 config: {
  name: "kashif",
  aliases: [],
  version: "1.0",
  author: "Kashif Raza",
  countDown: 5,
  role: 0,
  shortDescription: "Generate AI photo",
  longDescription: "AI photo generator using prompt",
  category: "image",
  guide: {
   en: "{pn} [prompt]\nExample: {pn} a beautiful pakistani girl"
  }
 },

 onStart: async function ({ message, args, api, event }) {
  const prompt = args.join(" ");
  if (!prompt)
   return message.reply("📸 *Kya banana hai?*\nExample: /kashif a beautiful girl");

  const apiKey = "prince";
  const url = `https://api.princetechn.com/api/ai/sd?apikey=${apiKey}&prompt=${encodeURIComponent(prompt)}`;

  try {
   const res = await axios.get(url, { responseType: "arraybuffer" });
   const path = __dirname + `/cache/kashif_${event.senderID}.jpg`;
   fs.writeFileSync(path, res.data);

   message.reply({
    body: `🧠 *AI ne banaya:*\n"${prompt}"`,
    attachment: fs.createReadStream(path)
   }, () => fs.unlinkSync(path));
  } catch (e) {
   console.error(e);
   message.reply("😓 *Image generate nahi ho saki. Thori dair baad try karo.*");
  }
 }
};
