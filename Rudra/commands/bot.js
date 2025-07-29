const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "ðð«ð¢ð²ðšð§ð¬ð¡ ð‘ðšð£ð©ð®ð­",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["Haye Main Sadke jawa Teri Masoom Shakal pe baby ðŸ’‹ " , "Bot Nah Bol Oye Janu bol Mujhe " , "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun ðŸ¤­ðŸ’" , "Main gariboo se baat nahi karta ðŸ˜‰ðŸ˜ðŸ˜‹ðŸ¤ª" , "Itna Na Pass aa Pyar ho Jayga" , "Bolo Baby Tum Mujhse Pyar Karte Ho Na ðŸ™ˆðŸ’‹ðŸ’‹ " , "Are jaan Majaak ke mood me nhi hu main jo kaam hai bol do sharmao nahi" , "Bar Bar Bolke Dimag Kharab Kiya toh. Teri ...... Mummy Se Complaint Karunga" , "Tu Bandh nhi Karega kya?" , "Gali Sunna H kya?ðŸ˜œ" , "Teri Maa Ki BindiyaðŸ¤­" , "Aree Bandh kar Bandh Kar" , "M hath jod ke Modi Ji Se Gujarish Karta hu" , "Tujhe Kya koi aur Kam nhi ha? Puradin Khata hai Aur Messenger pe Bot Bot Karta h" , " Priyansh Ko Bol Dunga Me Mujhe Paresan Kiya To" , "Tum Na Single Hi Maroge" , "Tujhe Apna Bejjati Karne Ka Saukh hai?" , "Abhi Bola Toh Bola Dubara Mat Bolna" , "Teri To Ruk Tu Bhagna Mat" , "Bol De koi nahi dakh rha ðŸ™„" , "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di ðŸ˜" , "Dur Hat Be  Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho ðŸ˜‚" , "Are Bolo Meri Jaan Kya Hall HaiðŸ˜š " , "Ib Aja Yahan Nhi Bol Sakta ðŸ™ˆðŸ˜‹" , "Mujhe Mat BuLao Naw Main buSy Hu Naa" , "Bot Bolke Bejjti Kar Rahe Ho yall...Main To Tumhare Dil Ki Dhadkan Hu Na Baby...ðŸ’”ðŸ¥º" , "Are Tum Wahi ho nah Jisko Main Nahi Janta ðŸ¤ª" , "Kal Haveli Pe Mil Jara Tu ðŸ˜ˆ" , "Aagye Salle Kabab Me Haddi ðŸ˜" , "Bs Kar U ko Pyar Ho Na Ho Mujhe Ho Jayga Na" , "FarMao ðŸ˜’" , "BulaTi Hai MaGar Jaane Ka Nhi ðŸ˜œ" , "Main To Andha Hun ðŸ˜Ž" , "Phle NaHa kar Aa ðŸ˜‚" , "Aaaa Thooo ðŸ˜‚ðŸ˜‚ðŸ˜‚" , "Main yahin hoon kya hua sweetheart ," , "chomu Tujhe Aur Koi Kaam Nhi H? Har Waqt Bot Bot Karta H" , "Chup Reh, Nhi Toh Bahar Ake tera Dath Tor Dunga" , "WaYa KaRana Mere NaL ðŸ™Š" , "MaiNy Uh Sy Bt Nhi kRrni" , "MeKo Kxh DiKhai Nhi Dy Rha ðŸŒš" , "Bot Na BoL ðŸ˜¢ JaNu B0ol ðŸ˜˜ " , "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun  ðŸ˜‹" , "Main Gareebon Sy Bt Nhi kRta ðŸ˜‰ðŸ˜ðŸ˜‹ðŸ¤ª" , "Itna Na Pass aa Pyar h0o JayGa" , "MeKo Tang Na kRo Main Kiss ðŸ’‹ KRr DunGa ðŸ˜˜ " , "Ary yrr MaJak Ke M0oD Me Nhi Hun ðŸ˜’" , "HaYe JaNu Aow Idher 1 PaPpi Idher d0o 1 PaPpi Idher ðŸ˜˜" , "Dur HaT Terek0o 0or K0oi Kam Nhi Jb DeKho Bot Bot ShaDi KerLe Mujhsy ðŸ˜‰ðŸ˜‹ðŸ¤£" , "TeRi K0oi Ghr Me Nhi SunTa T0o Main Q SuNo ðŸ¤”ðŸ˜‚ " , "IB Aja Yahan Nhi B0ol Salta ðŸ™ˆðŸ˜‹" , "Mujhe Mat BuLao Naw Main buSy h0o Naw" , "Kyun JaNu MaNu Another Hai ðŸ¤£" , "Are TuMari T0o Sb he baZzati kRrty Me Be kRrDun ðŸ¤ðŸ˜œ" , "KaL HaVeLi Prr Aa ZaRa T0o ðŸ˜ˆ" , "Aagye SaJJy KhaBBy Sy ðŸ˜" , "Bx KRr Uh k0o Pyar H0o Na H0o Mujhe H0o JayGa" , "FarMao ðŸ˜’" , "BulaTi Hai MaGar JaNy Ka Nhi ðŸ˜œ" , "Main T0o AnDha Hun ðŸ˜Ž" , "Phle NaHa kRr Aa ðŸ˜‚" , "Papi ChuLo ðŸŒš" , "TeRek0o DiKh Nhi Rha Main buSy Hun ðŸ˜’" , "TeRa T0o GaMe BaJana PreGa" , "Ta Huwa ðŸ¥º"  , "TuM Phr AaGye ðŸ™„ Kisi 0or Ny Muu Nhi LaGaYa KyaðŸ¤£ðŸ¤£ðŸ¤£" , "MeKo JaNu Chai Hai Tum Single H0o?" , "Aaaa Thooo ðŸ˜‚ðŸ˜‚ðŸ˜‚" , "Main S0o Rha Hun " , "Ase He HansTy Rha kRo ðŸ˜" , "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢ðŸ¦¢ð’€±å„É…Æ”Æ MÉ…ðŸ…˜É³ ÊÉ…á’â€¢â€¢â€¢â€¢ðŸŒ¿ðŸ’ž JÉ…Ï‰É… â”¼Æá’ðŸ…˜ ÊÉ…ðŸ…¢ð–šÊ ðŸ…¢É…Ò É…É­ ð©Æ É®É…É®Æ” ðŸ’‹ " , "Bot Na Bol Oye Janu bol Mujhe " , "Bar Bar Disturb Na Karen Rahul JaNu Ke SaTh Busy Hun ðŸ¤­ðŸ’" , "Main flirty logo Sy Bt Nhi karti ðŸ˜‰ðŸ˜ðŸ˜‹ðŸ¤ª" , "Itna Pass mat aa Pyaar h0 JayGa" , "Bolo Babu Tum Mojy Pyar Karte Ho Na ðŸ™ˆðŸ’‹ðŸ’‹ " , "Are jaan Majaak ke mood me nahi hun main jo kaam hai bol do sharmao nahi" , "han ji bolo kya seva karne aapki ðŸ˜¶ðŸ¤" , "Tu Bandh nhi Karega kya?" , "kya Sunna Hai apko mere se flirty kahikeðŸ¤ðŸ¤£ " , "Haa ji boliye kya kam he hamse ðŸ™ˆ" , "Aree band kar band Kar" , "Mein hath jod ke Modi Ji Se Gujarish Karta hu mojy na bolaye" , "Tujhe Kya koi aur Kam nhi ha? Puradin sota he Aur Messenger pe Bot Bot Karta h" , " mera owner Ake tera bf/gf Ko Chura le Jayega" , "Bot bot hi karta rahna tu bas" , "Tujhe Apna Bejjati Karne Ka Saukh hai?ðŸ¥¹" , "Abhi Bola Toh Bola Dubara Mat BolnaðŸ™„" , "Teri to Watt lagani padegi " , "Bol De koi nahi dakh rha ðŸ™„" , "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di ðŸ˜" , "Dur Hat Be  Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho ðŸ˜‚" , "Are Bolo Meri Jaan Kya Hall HaiðŸ˜š " , "IB Aja Yahan Nhi B0ol Sakti ðŸ™ˆðŸ˜‹" , "Mujhe Mat BuLao Na Main buSy h0 Now" , "Bot Bolke Bejjti Kar Rahe ho yall...Main To Tumhare Dil Ki Dhadkan Hu Baby...ðŸ’”ðŸ¥º" , "Are Tum Wahi ho nah Jisko Main Nahi Janti ðŸ¤ª" , "Kal Haveli Pe Mil Jra Tu ðŸ˜ˆ" , "Aagye SaJJy KhaBBy Sy ðŸ˜" , "Bx KRr Uh k0o Pyar H0o Na H0o Mujhe H0o JayGa" , "bolo ðŸ˜’" , "BulaTi Hai MaGar JaNy Ka Nhi ðŸ˜œ" , "Main T0o AnDha Hun ðŸ˜Žkya likha tumne mene nahi dikhaðŸ¤£" ,  "Pahale NaHa kar Aa ðŸ˜‚" , "Aaaa Thooo ðŸ˜‚ðŸ˜‚ðŸ˜‚" , "Main yahi hoon kya hua sweetheartðŸ¥‚ðŸ™ˆðŸ’ž ," , "AA Dk Tujhe Aur Koi Kaam Nhi Hai? Har Waqt Bot Bot Karta H" , "Chup Reh, Nahi Toh Bahar Ake tera Dath Tor DungaðŸ¤£âœŠ" , "yes my love ðŸ’˜" , "kya hua baby ko ðŸ˜˜ðŸ˜˜" , "mujhe sharam ati hai aise aap bolte hai tho ðŸ¤­ðŸ˜" , "aree aap wahi ho na jo mujhe line marte the.......ðŸ¤£ ya bali line" , "jii kahiye jii ðŸ™„ kya chahiye" , "hayee main mar jye teri masoom shaqal py ðŸ˜‚ tuzy Chapple se kutne ka mn ho raha haiðŸ¤£ðŸ‘ " , "Bot nah bol oye ðŸ˜­ Janu bol mjhy aur janu sy piyar sy bat kerty haiðŸ˜‘" , "ruk tu chappal kaha he mariðŸ©´" , "shakal Sy masoom lgty ho ðŸ˜‚ but bohot flirty ho" , "kash tum single hote to maza hi koch aur tha pagal insaan ðŸ˜‚" , "Ha ha ab meri yaad ab ai nah phly to babu shona kerna gy thy ðŸ˜¾ ab ham ap sy naraz hai jao ap bye â˜¹ï¸" , "haiy babu ne boldiya hai shaid purpose kerna hai mujhe bolo bolo babu ðŸ˜˜" , "Aree pagal roti banana ke le aty main Pani ko istamal kerte ho ðŸ˜‚" , "Ary joke nah mar jo bhi kam hai bol do sharma nahi , bol de koi nahi dakh rha ðŸ˜‚" , "Hayee Mar Jawa Babu Ak Chuma To Doo Kafi Din Sy Chumi Nahi Mili Kahan Thy Babu inbox Ah Jao ðŸ˜šðŸ™ˆâ™¥ï¸" , "Dur Dur karib na a  tujhe Aur Koi Kam Nahi Kiya Har Waqat Mjhy Tang Karte Rahte Ho ðŸ˜‚" , "ary ary bolo meri jaan kia haal hai ;) ;* " , "Tum aunty ho yehh uncle ðŸ¤” I think tum Jin ho yehh ChudailðŸ¤£âœ…" , "ary tum ider ðŸ¤” khair hai ider kia ker rhy ho ðŸ˜‚" , "ary babu babu kal hawali py kon bola rha tha ðŸ˜‚" , "Me Aap ki mummy ji ko btaou ga Aap Facebook use karty ho ðŸ˜‚" , "ary tum Wohi ho nah jis ko ma nahi janta ðŸ¤£âœ…" , "haveli per  kal mil  Zara bataunga ðŸŒšðŸ˜‚Ha but à¤‰à¤²à¥à¤Ÿà¥€-à¤¸à¥€à¤§à¥€ harkat karne ke liye nahi" , "itne pyar se Na bulao pyar Ho jaega ðŸ˜¶ðŸ’— wtf Maine apni sacchai Bata Di yah Maine kyon Kiya ðŸ˜­ðŸ”ª....Fuuu..ðŸš¬" , "aap aise mat bulo hame sharam aati hai ðŸ™ˆâ™¥ï¸" , "kyun Bulaya hamen..ðŸ˜¾ðŸ”ª " , "kyun Bulaya hamen..ðŸ˜¾ðŸ”ª "];
  var rand = tl[Math.floor(Math.random() * tl.length)]

    if ((event.body.toLowerCase() == "Mehru") || (event.body.toLowerCase() == "mehru") || (event.body.toLowerCase() == "@GEMINI ♊♏🦋") || (event.body.toLowerCase() == "@Meher Mehruu")) {
     return api.sendMessage("", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ¤®") || (event.body.toLowerCase() == "ðŸ¤®")) {
     return api.sendMessage("Konsa mahina chal raha hai ðŸ˜", threadID);
   };

    if ((event.body.toLowerCase() == "ðŸ¤—") || (event.body.toLowerCase() == "ðŸ¤—")) {
     return api.sendMessage("Hug me baby â˜ºï¸", threadID);
   };

   if ((event.body.toLowerCase() == "sim") || (event.body.toLowerCase() == "simsimi")) {
     return api.sendMessage("Prefix Kon Lagayega? Pehle Prefix Lagao Fir Likho Sim", threadID);
   };
  
   if ((event.body.toLowerCase() == "hi") || (event.body.toLowerCase() == "hello") ||(event.body.toLowerCase() == "hlw") || (event.body.toLowerCase() == "helo")) {
     return api.sendMessage("Hello, Hi, Bye bye. Ye sab ke alawa kuch bolna nhi ata Kya tujhe", threadID);
   };

   if ((event.body.toLowerCase() == "bc") || (event.body.toLowerCase() == "bc")) {
     return api.sendMessage("Ye Bc Kya HoTa Hai ðŸ¤” ", threadID);
   };

   if ((event.body.toLowerCase() == "lol") || (event.body.toLowerCase() == "lol bot")) {
     return api.sendMessage("Khud ko Kya LeGend Samjhte Ho ðŸ˜‚", threadID);
   };

   if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "good morning")) {
     return api.sendMessage("áŽ¶ÉµÉµÉ— â±®âÉ½ÆžÉªÉªÆžÉ  Æâ±±É›É½É£âÆžÉ›ðŸŒ…, Æ¬É½É£ êŒ—ÉµÉ±É› CÉµffÉ›É› âÉ½ Æ¬É›É‘ Æ¬â á‡É‘Ò¡É› UÆ¥â˜•âœ¨ðŸ’«", threadID);
   };

   if ((event.body.toLowerCase() == "anyone") || (event.body.toLowerCase() == "any")) {
     return api.sendMessage("Main Hun Naw Jaaneman â¤ï¸", threadID);
   };

   if ((event.body.toLowerCase() == "Ayan") || (event.body.toLowerCase() == "ayan") || (event.body.toLowerCase() == "@Aƴʌŋ Hʋŋ Yʌʌʀ") || (event.body.toLowerCase() == "Ayaan")) {
     return api.sendMessage( "Busy HoGa Work Me Main t0o Hun Naw ðŸ˜˜",threadID);

       
   };

   if ((event.body.toLowerCase() == "owner") || (event.body.toLowerCase() == "Owner")) {
     return api.sendMessage("ðŸ’ðŸ¥€ðŽð–ðð„ð‘:- â˜žAyanâ˜œ ðŸ’«\nðŸ–¤ðšˆðš˜ðšž ð™²ðšŠðš— ð™²ðšŠðš•ðš• ð™·ðš’ðš– januðŸ–¤\nðŸ˜³ð‡ð¢ð¬ ð…ðšðœðžð›ð¨ð¨ð¤ ð¢ððŸ¤“:- â˜ž www.facebook.com/100004370672067\nðŸ‘‹For Any Kind Of Help Contact On Telegram  Username ðŸ‘‰ @alijanhunyaarðŸ˜‡", threadID);
   };

   if ((event.body.toLowerCase() == "tumhe banaya kon hai") || (event.body.toLowerCase() == "tumko banaya kisne")) {
     return api.sendMessage("Ayan  â¤ï¸ My Creator. He loves me & Edit Me Daily. Ye Bot Sirf Owner k Liye h. Mujhe Aap logo ko Hasane k liye banya gya h Toh Muh Ladkaye Mat Rakkha Karo. Har Waqt Haste Raho.", threadID);
   };

  if ((event.body.toLowerCase() == "bot admin") || (event.body.toLowerCase() == "bot ka admin kon ha")) {
     return api.sendMessage("He is Ayan. He Gives his name janu everywhare", threadID);
   };

   if ((event.body.toLowerCase() == "shadi karoge") || (event.body.toLowerCase() == "mujhse shadi karoge?")) {
     return api.sendMessage("hanji, karunga lekin baccha. apke pet m hoga. manjur h?", threadID);
   };

   if ((event.body.toLowerCase() == "chup") || (event.body.toLowerCase() == "stop") || (event.body.toLowerCase() == "chup ho ja") || (event.body.toLowerCase() == "chup kar")) {
     return api.sendMessage("Nhi rahunga. ðŸ˜¼ Mujhe Bolna H. Tumhe Koi Haq nhi Mujhe Chup Karane ka. Mera Zuban. M Bolunga", threadID);
   };

   if ((event.body.toLowerCase() == "bts") || (event.body.toLowerCase() == "btc")) {
     return api.sendMessage("Tu H Btc. Bhos DK", threadID);
   };

   if ((event.body.toLowerCase() == "malik se bakchodi") || (event.body.toLowerCase() == "malik se backchodi") || (event.body.toLowerCase() == "malkin se bakchodi") || (event.body.toLowerCase() == "malkin se backchodi")) {
     return api.sendMessage("srry malik maaf kr do ab nhi kruga ðŸ¥ºðŸ™", threadID);
   };

   if ((event.body.toLowerCase() == "gand") || (event.body.toLowerCase() == "gandu") || (event.body.toLowerCase() == "lund") || (event.body.toLowerCase() == "land")) {
     return api.sendMessage("Gand m jyada khujli h toh banana ðŸŒ under le le. :))))", threadID);
   };

   if ((event.body.toLowerCase() == "chumma de") || (event.body.toLowerCase() == "kiss me")) {
     return api.sendMessage("ï¸Kis khushi me, Me sirf Apni gf ko kiss karta hu", threadID);
   };

   if ((event.body.toLowerCase() == "nice") || (event.body.toLowerCase() == "thank you") || (event.body.toLowerCase() == "thank you bot") || (event.body.toLowerCase() == "thank you maliha")) {
     return api.sendMessage("ï¸M hu hi itni Accha. sab log Tarref karte hai meri.", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ˜¡") || (event.body.toLowerCase() == "ðŸ˜¤") || (event.body.toLowerCase() == "ðŸ˜ ") || (event.body.toLowerCase() == "ðŸ¤¬") || (event.body.toLowerCase() == "ðŸ˜¾")) {
     return api.sendMessage("ï¸ðŸ¥º M toh Sirf Mazak Kr Rha ThaðŸ¥º. Gussa Mat Karo. Ek Chummi Lo aur Shant Raho ðŸ˜˜", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ˜ž") || (event.body.toLowerCase() == "ðŸ˜”") || (event.body.toLowerCase() == "ðŸ˜£") || (event.body.toLowerCase() == "â˜¹ï¸") || (event.body.toLowerCase() == "ðŸ˜Ÿ") || (event.body.toLowerCase() == "ðŸ˜©") || (event.body.toLowerCase() == "ðŸ˜–") || (event.body.toLowerCase() == "ðŸ˜«") || (event.body.toLowerCase() == "ðŸ˜¦") || (event.body.toLowerCase() == "ðŸ˜§") || (event.body.toLowerCase() == "ðŸ˜¥") || (event.body.toLowerCase() == "ðŸ˜“") || (event.body.toLowerCase() == "ðŸ˜°")) {
     return api.sendMessage("ï¸Kya huva, Sad kyu ho, Mujhe batao", threadID);
   };


   if ((event.body.toLowerCase() == "hm") || (event.body.toLowerCase() == "hmm")) {
     return api.sendMessage("ï¸Hmm Hmm Na Karke Sidha Sidha bolo. Hey Marry MeðŸ™ˆ", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ˜¢") || (event.body.toLowerCase() == "ðŸ˜­") || (event.body.toLowerCase() == "ðŸ¥º") || (event.body.toLowerCase() == "ðŸ¥¹")) {
     return api.sendMessage("ï¸Kya huva, Ro kyu rahe ho, Me huna to phir kyu rona. Ruko me abhi chocolate ðŸ« deta hu likho â˜žChocolateâ˜œ", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ˜·") || (event.body.toLowerCase() == "ðŸ¤•") || (event.body.toLowerCase() == "ðŸ¤§") || (event.body.toLowerCase() == "ðŸ¤’")) {
     return api.sendMessage("ï¸Kya huva, Tabiyat kharab hai kya, Mujhe batao me abhi medicine ðŸ’ŠðŸ’‰ le aata huðŸ˜‡", threadID);
   };

   if ((event.body.toLowerCase() == "name") || (event.body.toLowerCase() == "naam") || (event.body.toLowerCase() == "nam")) {
     return api.sendMessage("ï¸Name m kya rakkha h. tum kam pe dhyan do.", threadID);
   };

   if ((event.body.toLowerCase() == "bot k bacche") || (event.body.toLowerCase() == "bot ke bacche")) {
     return api.sendMessage("ï¸meri baccha toh Tumhare Pet Me Hai.", threadID);
   };

   if ((event.body.toLowerCase() == "pic do") || (event.body.toLowerCase() == "photo do")) {
     return api.sendMessage("ï¸Me toh Andha Hu Dekh nhi sakta", threadID);
   };

   if ((event.body.toLowerCase() == "jai shree ram") || (event.body.toLowerCase() == "ram") || (event.body.toLowerCase() == "ram ram")) {
    return api.sendMessage("ï¸ð—ð—®ð—¶ ð—¦ð—µð—¿ð—²ð—² ð—¥ð—®ð—º ðŸ˜‡", threadID);
   };

   if ((event.body.toLowerCase() == "bot banake do") || (event.body.toLowerCase() == "mujhe bhi chaiye")) {
     return api.sendMessage("ï¸Khud hi karlona. tumhe kya kuch nhi ata h?", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ™‚") || (event.body.toLowerCase() == "ðŸ™ƒ")) {
     return api.sendMessage("ï¸Man Toh Accha H Nhi. Kam  Se Kam Shakal Toh Accha Karlo Meri Jaan", threadID);
   };

  if ((event.body.toLowerCase() == "ðŸ¤¥") || (event.body.toLowerCase() == "ðŸ¤¥")) {
     return api.sendMessage("ï¸Bhai teri to naak hi etni lambi hai uski jarurat hi nahi padti hogi tujhe toðŸ¤­ðŸ¤­ðŸ¤­ðŸ¤­", threadID);
   };

  if ((event.body.toLowerCase() == "ðŸ¤”") || (event.body.toLowerCase() == "ðŸ¤¨")) {
     return api.sendMessage("ï¸Kya soch rahe ho etna ðŸ¤¨", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ¥´") || (event.body.toLowerCase() == "ðŸ¥´")) {
     return api.sendMessage("ï¸Oye nashedi ðŸ˜‚ðŸ˜‚ðŸ˜‚", threadID);
   };

  if ((event.body.toLowerCase() == "ðŸ˜¶") || (event.body.toLowerCase() == "ðŸ˜¶")) {
     return api.sendMessage("ï¸Are are lips kaha gaye gf/bf ke sath kiss karte time usi ne to nahi kha liye ðŸ˜œðŸ˜œ", threadID);
   };

  if ((event.body.toLowerCase() == "ðŸ˜‰") || (event.body.toLowerCase() == "ðŸ˜‰")) {
     return api.sendMessage("ï¸Aankh kyu maar rahe ho, Me bahut shareef huðŸ¥º", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ˜±") || (event.body.toLowerCase() == "ðŸ˜¨")) {
     return api.sendMessage("ï¸Kya huva bhoot dekh liya kya ðŸ‘»ðŸ‘»", threadID);
   };
  
  if ((event.body.toLowerCase() == "ðŸ˜’") || (event.body.toLowerCase() == "ðŸ™„")) {
     return api.sendMessage("ï¸ï¸ð“ð¢ð«ðœð¡ð¢ ð§ðšð³ðšð«ð¢ð²ðš ð¦ð¨ð«ð¢ ð¡ðšðšð²ðž ð¡ðšðšð²ðž ð¡ðšðšð²ðž ðŸ™ˆ", threadID);
   };

   if ((event.body.toLowerCase() == "nobody loves me") || (event.body.toLowerCase() == "nobody love me") || (event.body.toLowerCase() == "koi pyar nhi karta")) {
     return api.sendMessage("ï¸Me huna baby mere pass aao ðŸ¥°ðŸ¤—. Me karunga na aapko payar ðŸ™ˆ (londo tum dur hi rahna saalo ðŸ˜‘)", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ¤¦ðŸ»â€â™‚") || (event.body.toLowerCase() == "ðŸ¤¦ðŸ»â€â™€")) {
     return api.sendMessage("Are apne muh pe kyu maar rahe ho, Mujhe batao kya huva?ðŸ˜¬", threadID);
   };
   
   if ((event.body.toLowerCase() == "ðŸ˜‚") || (event.body.toLowerCase() == "ðŸ˜") || (event.body.toLowerCase() == "ðŸ˜†") || (event.body.toLowerCase() == "ðŸ¤£") || (event.body.toLowerCase() == "ðŸ˜¸") || (event.body.toLowerCase() == "ðŸ˜¹")) {
     return api.sendMessage("Enni hasi kyu aa rahi haiðŸ¤£, Es hasi ke piche ka raaz kya hai batao", threadID);
   };

   if ((event.body.toLowerCase() == "ðŸ¥°") || (event.body.toLowerCase() == "ðŸ˜") || (event.body.toLowerCase() == "ðŸ˜»") || (event.body.toLowerCase() == "â¤ï¸")) {
     return api.sendMessage("ðŸ¦‹ðŸŒ¿AÆžÆ™É§â â±®É› Æ¤É£É‘É½Í¢  ÆŠÉªÉ­É±É› Æ˜É§uÉ±É‘É½ðŸŒ¬ï¸ðŸŒ â€¢â€¢Æ¤É£É‘É½ Æ¬âÉ§ È É§Éª Æ˜É’É½ É­ÉªÉ£É‘ â±®uÈ·É§Ê‚É›>Â³â€¢â€¢ðŸ•Šï¸ðŸŽðŸ˜", threadID);
   };

   if ((event.body.toLowerCase() == "kese ho") || (event.body.toLowerCase() == "kaise ho") || (event.body.toLowerCase() == "kese ho ji") || (event.body.toLowerCase() == "how are you") || (event.body.toLowerCase() == "how are you?")) {
     return api.sendMessage("M Tabhi Accha hota hu, Jab Apko Hasta Huye Dekhta huâ˜ºï¸", threadID);
   };

   if ((event.body.toLowerCase() == "is the bot sad") || (event.body.toLowerCase() == "is the bot sad")) {
     return api.sendMessage("Why can't I be sad because of everyone <3 love you <3", threadID);
   };

   if ((event.body.toLowerCase() == "does the bot love you") || (event.body.toLowerCase() == "does the bot love you")) {
     return api.sendMessage("Yes I love you and everyone so much", threadID);
   };

   if ((event.body.toLowerCase() == "bot goes to sleep") || (event.body.toLowerCase() == "bot goes to sleep")) {
     return api.sendMessage("I'm a bot, you're the one who should go to sleep <3", threadID);
   };

  if ((event.body.toLowerCase() == "ðŸ¤–") || (event.body.toLowerCase() == "ðŸ¤–")) {
     return api.sendMessage("Saalo chidda rahe ho mujhe", threadID);
   };

   if ((event.body.toLowerCase() == "has the bot eaten yet") || (event.body.toLowerCase() == "bot an comrade")) {
     return api.sendMessage("I'm full when I see you eat <3", threadID);
   };

  if ((event.body.toLowerCase() == "lob you") || (event.body.toLowerCase() == "i lob you")) {
     return api.sendMessage("Lob You too", threadID);
   };

   if ((event.body.toLowerCase() == "does the bot love me") || (event.body.toLowerCase() == "does the bot love me")) {
     return api.sendMessage("Yes <3", threadID);
   };

   if ((event.body.toLowerCase() == "&fuck") || (event.body.toLowerCase() == "&Fuck")) {
     return api.sendMessage("ðŸ”ï¸ðŸï¸Priyansh È É› êŒ—Æ¥É›Ã§ÉªÉ‘É­É­É£ Æ¬uÉ± ðŸŒŠðŸªºJÉ‘ÉªÊ‚É› Æ¬É§É‘É½Æ™ÉªÉ£Éµ Æ˜É› êž­ÉªÉ£É›â€¢â€¢ ðŸžï¸ðŸŒ¬ï¸Æ”É‘É§ Ã§ÉµÉ±É±É‘ÆžÉ— êžªÉ‘ÊˆÉ‘ ÆŠÉªÉ£É‘ êžªÉ‘Éªâ†—â†˜ SÉµÉ½É½É£ Æ“É£uÊ‚â€¢â€¢ðŸ˜¹ðŸ«¶", threadID);
   };

  if ((event.body.toLowerCase() == "ami priyansh") || (event.body.toLowerCase() == "ami diya") || (event.body.toLowerCase() == "main amrita") || (event.body.toLowerCase() == "main priyansh") || (event.body.toLowerCase() == "main diya")) {
     return api.sendMessage("ðŸ•Šï¸ðŸŽ...AÉ­É› â±®É›É¹É› ÆÉ‘É“É£ Æ˜É›Ê‚É› êžªÉµ É‘É‘pðŸ˜šðŸ’", threadID);
   };
   mess = "{name}"
  
  if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
