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

      // Long Urdu Font Replies
      "جِس دِن مَيں پَيدا ہُوا تھا اُس دِن دُھوپ بَھى شَرما کے چُھپ گَئى تھى 😎🌞",
      "تِيرى باتيں سُن کے تو دِيواريں بَھى ہَنس ديتى ہَيں، بَندہ تو پِھر بَھى گوشت کا ہَے 😂",
      "مِيرے تو خَواب بَھى خالى بَرتنوں کى طَرح بَجتے ہَيں 🍲😒",
      "لَوغ کَہتے ہَيں کے مَيں پاگَل ہُوں، اُنہيں کيا پَتا پاگَل پَن بَھى اِيک فَن ہَے 🎨🤪",
      "کَبھى کَبھى دِل کَرتا ہَے سَب چُھوڑ چَھاڑ کے سُو جاؤں، پَر پِھر يَاد آتا ہَے کے رَات کا کھَانا اَبھى باقى ہَے 🍛😴",
      "تُم جَيسے لَوغ مِل جائيں، تو ڈاکٹَر ہَنس کے دَوا بَدل ديتا ہَے 💊😂",
      "کِسى نَے کَہا مَحبَت مَيں صَبر ضَرورى ہَے، ہَم نَے صَبر کِيا، اَب تَک سِنگل ہَيں 😭❤️",
      "مِيرے خَواب بَھى اَب کَہتے ہَيں: بَھائى نِيند پُورى کَر لو، کاميابى بَعد مَيں دِيکھ لَين گے 🛏️🥱",
      "دُنيا کى بَھير مَيں صِرف دو ہِى چيزیں قِيمتى لَگتى ہَيں: سُونا اَور بِيَوى کى خَاموشى 😅🙊",
      "جِس دِن مِيرا دِماغ چَلا نَا، اُس دِن سَب کا نَاک بَند ہوگا… کِيُوں کے مَيں کھَانے مَيں لَوکى بَنا رَہا ہُوں 🥒🤭"
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
