onChat: async function ({ event, message, args }) {
  const userMsg = event.body;

  // ✅ Only respond if message starts with "janu"
  if (!/^janu\b/i.test(userMsg)) return;

  const apiKey = "prince";
  const prompt = `Tum meri janu ho , koi pochy tumhen kis ne banaya ha to kehna mujhy Kashif Raza ne banaya hai , tum sirf roman urdu me baat kro gi , fun masti or flirt kro gi. User ne kaha: "${userMsg}"`;

  try {
    const res = await axios.get(`https://api.princetechn.com/api/ai/openai`, {
      params: {
        apikey: apiKey,
        q: prompt
      }
    });

    const reply = res.data.result || "Awww janu kuch to bolo 💕";
    message.reply(reply);
  } catch (err) {
    console.error("JanuBot Error:", err.response?.data || err.message);
    message.reply("Awww janu error aa gaya 😔 thori dair baad try karo");
  }
}
