const moment = require("moment-timezone");

module.exports.config = {
  name: "quranayah",
  version: "1.0.0",
  credits: "Kashif Raza",
  description: "Daily random Quranic ayah with Urdu translation"
};

module.exports.run = async function ({ api }) {
  const allAyat = [
    {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      urdu: "بے شک ہر تنگی کے ساتھ آسانی ہے۔",
      reference: "سورہ الشرح - 6"
    },
    {
      arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
      urdu: "اللہ آسمانوں اور زمین کا نور ہے۔",
      reference: "سورہ نور - 35"
    },
    {
      arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
      urdu: "اور میری کامیابی صرف اللہ کی مدد سے ہے۔",
      reference: "سورہ ہود - 88"
    },
    {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      urdu: "تو بے شک تنگی کے ساتھ آسانی ہے۔",
      reference: "سورہ الشرح - 5"
    },
    {
      arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      urdu: "بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔",
      reference: "سورہ البقرہ - 153"
    },
    {
      arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
      urdu: "بے شک اللہ بخشنے والا مہربان ہے۔",
      reference: "سورہ البقرہ - 173"
    },
    {
      arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      urdu: "اور کہہ دیجیے: اے میرے رب! میرے علم میں اضافہ فرما۔",
      reference: "سورہ طه - 114"
    },
    {
      arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      urdu: "اللہ کی رحمت سے مایوس نہ ہو۔",
      reference: "سورہ الزمر - 53"
    },
    {
      arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
      urdu: "بے شک اللہ توکل کرنے والوں سے محبت کرتا ہے۔",
      reference: "سورہ آل عمران - 159"
    },
    {
      arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
      urdu: "پس تم میرا ذکر کرو، میں تمہارا ذکر کروں گا۔",
      reference: "سورہ البقرہ - 152"
    }
  ];

  const currentHour = moment().tz("Asia/Karachi").hour();
  const isMorning = currentHour >= 5 && currentHour < 10;

  if (!isMorning) return;

  const randomAyah = allAyat[Math.floor(Math.random() * allAyat.length)];

  const message = `📖 *قرآنی آیت برائے آج* 📖\n\n🕋 *${randomAyah.arabic}*\n\n📝 ${randomAyah.urdu}\n📚 ${randomAyah.reference}`;

  const threads = await api.getThreadList(100, null, ["INBOX"]);
  for (const thread of threads) {
    api.sendMessage(message, thread.threadID);
  }
};
