module.exports.config = {
  name: "botreply",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Funny desi replies when someone mentions 'bot', with @mention",
  commandCategory: "fun",
  usages: "auto bot reply",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;
  if (!body) return;

  const lowerCaseMsg = body.toLowerCase();

  if (lowerCaseMsg.includes("bot")) {
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "jaan";

    const replies = [
      "laanat bhi kya cheez hai adress nah bhi likhon mustahiq afraad tak pahonch jati hai🤣",
      "woh jo karorron mein aik hai na! woh mein khud he ho",
      "Kisi ko sachey dil se chaaho to poori kaayenaat is ki shadi kisi aur se krwane mein lag jati hai🥺🥺🥺",
      "Aao dard banttay hain Tum darwazay mein ungli do Phir mil kar cheekhain maartay hain🙈🙈",
      "Tairay jaaane ke baad waqt tham sa gaya tha Baad mein pata chala ke Ghari ka cell khatam hogaya tha🤣🙈",
      "Aisa lagta hai chay din ghar walay sirf yeh sochte rehtay hain ke Itwaar walay din mujh se kya kya kaam karwanay hain🥵🙄😂",
      "Mein naay aaj dua ki Ya Allah mere ghar walon ki pareshaaniya khatam kar phir yaad aaya kahin mein hi nah faut ho jao🤣🤣😂",
      "Shukar hai larkiyan qurbani ka janwar lainay nahi jati warna pink colour ka bakra aur light green colour ki gaaye kahan se aati🤣😂",
      "Khush rehna chahtay hain to pehle dil ki sunen phir dimagh ki Aur is ke baad woh karen Jo aap ki biwi kehti hai🙈🙉🙉😜",
      "Meri ghaltion ko dar guzar kar diya karen Ukhaar to waisay aap mera kuch nahi satke😁",
      "Tum bhi kunware hum bhi kunware Fitte mun tumahray fitte mun hamaray🙈🙈",
      "Or Sunao mere owner se shadi kara do apki🙈",
      "pata nhi kaisy logo ko sacha piyaar mil kata ha mujy to jhootha bhi nhi milta 🥺🥺",
      "Ghr me izzat aa jaty hain bot bot karny 😅😅",
      "hN ji mere na hony waly janu aap ne yaad kara 🙈🙈",
      "mungh phali me dana nhi Ayan ko shor kr jana nhi😅😅😅",
      "Rishty ke lye 1 dabaye shadi k lye 2 dabaye agr aap shadi shuda hai or dosri shadi krna chahty hai to apni pehli bivi ka gala dabayen🙉🙉🙉🙈😅",
      "Tumahari zulfon mein uljha hwa hai Mohalle ka suljha hwa larka Ayan",
      "Agr tumhara piyaar sacha hota to aaj humara bhi bacha hota🙉😅",
      "tum bas mu banati rehna Ayan ko koi or pata le gi 🤣😅",

      // Kashida Urdu Font (Lambi Font Style)
      "جِــــــــس دِن مَــــــــیں پَیــــــــدا ہُــــــــوا تَھــــــــا اُس دِن دُھــــــــــوپ بَھـــــــــی شَـــــــــرما کَــــــــے چُھــــــــپ گَئــــــــی تَھــــــــی 😎🌞",
      "تِــــــــیــــــــری بَاتــــــــیں سُن کَــــــــے تَــــــــو دیــــــــــواریں بَھــــــــی ہَــــــــنس دِیــــــــتی ہَیــــــــں، بَــــــــندہ تَــــــــو پِــــــــھر بَھــــــــی گَــــــــوشت کَــــــــا ہَــــــــے 😂",
      "مِــــــــیرے تَــــــــو خَــــــــواب بَھــــــــی خَــــــــالی بَرتَـــــــــنُوں کِــــــــی طَــــــــرح بَجتَــــــــے ہَیــــــــں 🍲😒",
      "لُــــــــوگ کَـــــــــہتے ہَیــــــــں کِـــــــــہ مَــــــــیں پَــــــــاگَل ہُــــــــوں، اُنہِــــــــیں کِــــــــیا پَـــــــــتا پَــــــــاگَل پَــــــــن بَھــــــــی اِیــــــــک فَـــــــــن ہَــــــــے 🎨🤪",
      "کَــــــــبھی کَـــــــــبھی دِل کَــــــــرتَـــــــــا ہَــــــــے سَب چُھـــــــــوڑ چَھــــــــاڑ کَــــــــے سُــــــــو جَــــــــاؤں، پَــــــــر یَـــــــــاد آتَـــــــــا ہَــــــــے کِـــــــــہ رَات کَـــــــــا کھَـــــــــانا بَاقِـــــــــی ہَــــــــے 🍛😴",
      "تُـــــــــم جَیــــــــسے لُـــــــــوگ مِـــــــــل جَائِــــــــیں، تَـــــــــو ڈاکــــــــٹَر ہَـــــــــنس کَــــــــے دَوا بَــــــــدل دِیــــــــتا ہَـــــــــے 💊😂",
      "کِسِـــــــــی نَے کَہــــــــا مَــــــــحبَت مَــــــــیں صَـــــــــبَر ضَـــــــــروری ہَــــــــے، ہَــــــــم نَے صَـــــــــبَر کِیــــــــا، اَب تَــــــــک سِــــــــنگل ہَــــــــیں 😭❤️",
      "مِــــــــیرے خَــــــــواب بَھــــــــی اَب یَــــــــہ کَہتَــــــــے ہَیــــــــں: بَھائِــــــــی نِیــــــــند پُــــــــوری کَــــــــر لُــــــــو، کَامــــــــیابِــــــــی بَــــــــعد مَــــــــیں دِیــــــــکھ لَــــــــیں گَے 🛏️🥱",
      "دُنــــــــیا کِــــــــی بَھــــــــیڑ مَــــــــیں صِـــــــــرف دُو چِــــــــیزیں قِــــــــیمَتِــــــــی لَـــــــــگتِــــــــی ہَیــــــــں: سُــــــــونا اَور بَیــــــــوِی کِــــــــی خَــــــــاموشِــــــــی 😅🙊",
      "جِــــــــس دِن مِیــــــــرا دِمَــــــــاغ چَـــــــــلا نَــــــــا، اُس دِن سَب کَــــــــا نَــــــــاک بَــــــــند ہَــــــــوگا… کِیُـــــــــوں کِہ مَــــــــیں کھَــــــــانے مَــــــــیں لَــــــــوکی بَــــــــنا رَہَــــــــا ہُــــــــوں 🥒🤭"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    return api.sendMessage({
      body: `@${userName}, ${randomReply}`,
      mentions: [{
        tag: `@${userName}`,
        id: senderID
      }]
    }, threadID, messageID);
  }
};

module.exports.run = () => {};
