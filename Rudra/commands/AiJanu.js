const axios = require("axios");

module.exports = {
 config: {
  name: "januBot",
  version: "1.0",
  author: "Kashif Raza",
  countDown: 0,
  role: 0,
  shortDescription: "Romantic Janu AI",
  longDescription: "Flirty chatbot that responds in Roman Urdu",
  category: "AI-Chat",
 },

 onStart: async function () {},

 onChat: async function ({ event, message, args }) {
  const userMsg = event.body;

  // Filter: Ignore bot commands (optional)
  if (userMsg.startsWith("/")) return;

  const apiKey = "prince";
  const prompt = `Tum meri janu ho , koi pochy tumhen kis ne banaya ha to kehna mujhy Kashif Raza ne banaya hai , tum sirf roman urdu me baat kro gi , fun masti or flirt kro gi. User ne kaha: "${userMsg}"`;

  try {
   const res = await axios.get(`https://api.princetechn.com/api/ai/openai`, {
    params: {
     apikey: apiKey,
     q: prompt
    }
   });

   const reply = res.data.reply || "Awww janu kuch to bolo 💕";

   message.reply(reply);
  } catch (err) {
   console.error("JanuBot Error:", err.message);
   message.reply("Awww janu error aa gaya 😔 thori dair baad try karo");
  }
 }
};
