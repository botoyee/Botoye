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

  var tl = ["Main samajhdar hoon, tumhare jese nahi. 🤓", "Meri yaadon ka bojh uthane walon ki kamar toot jati hai. 🧠📦", "Tumhara pyaar gali ke kutte jesa hai – har kisi se chipak jata hai. 🐕😒", "Main sirf tumhari hoon, par tum bazar ke samose ho. 🥟🙄", "Shohr ho? Shohr toh izzat deta hai, tu toh sirf tension deta hai. 😤🗯️", "Mujhe yaad mat karo, meri bad-dua tez lagti hai. 🧿😌", "Mohabbat mat karna, warna chappal bhi roye gi. 🩴💔", "Supari toh nikaali, ab tu bhi nikal ja zindagi se. 🚪🥴", "Pehli fursat mein nahi, pehli laat mein nikal. 🦶😂", "Tere jaise logon ke liye toh dadi ke nuskhay bhi fail hain. 🧓📜", "Tera I love you bhi jesa botal wala cold drink – sirf gas aur drama. 🥤🎭", "Tumhara dil haandi jesa hai, jisme har koi chamach chala gaya. 🍲😒", "Tere bina zindagi sukoon bhari lagti hai – jese bijli ka bill kam aaye. 😌🧾", "Pyaar toh kiya tha, par ab lagta hai mohallay ka joke ban gaya. 😂💘", "Tumse acha toh rickshaw wala hai – kam se kam sahi jagah le jata hai. 🚗💨", "Tera pyaar bhi halwai ki mithai jesa – sirf dikhawa. 🍬🙅‍♀️", "Ap se kon pyar karega? Jise khud pe dukh lena ho. 🥲💔", "Main bakwas nahi karti, sidha chappal utar leti hoon. 🩴😠", "Tere jese logon ko toh maa bhi 'sharam kar beta' keh ke thak gayi hoti. 🤦‍♀️😒", "Tera attitude jesa bhutta – jala hua aur bekar. 🌽🔥", "Main tere dil mein nahi, teri badnami mein famous hoon. 📢👀", "Mera pyaar toh asli tha, par tu toh sirf free ka drama tha. 🎭💸", "Dil toh tera patang jesa hai – har kisi se kat jata hai. 🪁💔", "Main toh baat karne ayi thi, tu toh tamasha ban gaya. 🎪🤹‍♂️", "Shohr ho ya shor, farq toh karo. 🤯🧏‍♀️", "Aankh mari thi, dil nahi. Tu khud hi baazi le gaya. 😉🃏", "Bakwaas band kar, warna chammach se setting karni padegi. 🥄😡", "Pyaar ho gaya tha, ab nuskha dhoond rahi hoon ilaj ka. 📚🧪", "Tu pyaar nahi, munh ka chhalla hai – na nigla jaye, na thooka jaye. 😵🥵", "Tujhse pyaar karna aisa hai jaise loot maar mein khushi dhoondhna. 🪓💘", "Tu meri zindagi ka woh mehmaan hai jo bina bulaye chala bhi nahi jata. 🧳🚫", "Tujhse milke laga meri kismat ne mujhse badla liya. 🤡😭", "Pyari samajh gayi haan, par akal abhi thodi kam hai. 🧏‍♀️🤷‍♂️", "Ye dukh khatam isliye nahi hote kyunki tu har din naya shuru karta hai. 😤🔁", "Tum bas meri BV ho, par harkatein chachi jesi. 🧓💍", "Shohr ho? Shohr ka matlab sirf naam ka aadmi nahi hota. 🙄💢", "Meri yaad aa rahi hai? Waise bhi sab kuch mera hi chahiye hota hai tujhe. 😒📦", "Bakwas na kar, nahi toh chappal ke sath live aungi. 🩴📺", "Chal nikal, warna mohalle wale dekh lenge. 🚪👀", "I love you too – par apni aukaat me reh. 💘🙃", "Aap se pyar karega? Jise dard mein sukoon milta ho. 🥲🔥", "Munh se supari nikaal kar bol, warna samajhungi jaamun kha ke aaya hai. 🥥😆", "Main ladkiyon se baat nahi karta – unka level hi kuch aur hota hai. 💁‍♀️💅", "Mujhse shaadi karegi? Jhoot bolne ka bhi ek limit hota hai. 💍❌", "Ib ib kya bol raha hai? Saaf saaf bol, kan mein jaala nahi hai. 🐝👂", "Aurat zaat se nahi, teri harkaton se ghabraya hoon. 😳🚫", "Dil garden garden ho raha hai – lekin mali kaam chor nikla. 🌸🧑‍🌾", "Main gali nahi dunga, seedha nikal dunga zindagi se. 🛑🚶‍♀️", "Ji meri jaan – acting bandh kar, TV nahi hoon. 🎭📺", "Bakwas na kar – patience ka quota khatam ho gaya. ⚠️😤", "Toba toba – tu toh level se bhi neeche nikla. 😇🤦‍♀️"];
  var rand = tl[Math.floor(Math.random() * tl.length)]

    if ((event.body.toLowerCase() == "Mehru") || (event.body.toLowerCase() == "mehru") || (event.body.toLowerCase() == "@GEMINI ♊♏🦋") || (event.body.toLowerCase() == "@Meher Mehruu")) {
     return api.sendMessage("Admin Mehru sirf naam nahi, ek level hai 💫
Jiski presence se hi group mein discipline aa jata hai 😌👑", threadID);
   };

   if ((event.body.toLowerCase() == "") || (event.body.toLowerCase() == "ðŸ¤®")) {
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
