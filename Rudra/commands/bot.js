/**
* @author Zeeshan Altaf
* @warn Do not edit code or edit credits
* @Dont Change This Credits Otherwisw Your Bot Lol
*/
const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ali Jan",
  description: "Bot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Karachi").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["laanat bhi kya cheez hai adress nah bhi likhon mustahiq afraad tak pahonch jati hai🤣" , "woh jo karorron mein aik hai na! woh mein khud he ho" , "Kisi ko sachey dil se chaaho to poori kaayenaat is ki shadi kisi aur se krwane mein lag jati hai🥺🥺🥺" , "Aao dard banttay hain Tum darwazay mein ungli do Phir mil kar cheekhain maartay hain🙈🙈" , "Tairay jaaane ke baad waqt tham sa gaya tha Baad mein pata chala ke Ghari ka cell khatam hogaya tha🤣🙈" , "Aisa lagta hai chay din ghar walay sirf yeh sochte rehtay hain ke Itwaar walay din mujh se kya kya kaam karwanay hain🥵🙄😂" , "Mein naay aaj dua ki Ya Allah mere ghar walon ki pareshaaniya khatam kar phir yaad aaya kahin mein hi nah faut ho jao🤣🤣😂" , "Shukar hai larkiyan qurbani ka janwar lainay nahi jati warna pink colour ka bakra aur light green colour ki gaaye kahan se aati🤣😂" "Khush rehna chahtay hain top pehle dil ki sunen phir dimagh ki Aur is ke baad woh karen Jo aap ki biwi kehti hai🙈🙉🙉😜" , "Meri ghaltion ko dar guzar kar diya karen Ukhaar to waisay aap mera kuch nahi satke😁" , "Tum bhi kunware hum bhi kunware Fitte mun tumahray fitte mun hamaray🙈🙈" , "Or Sunao Ali jan se shadi kara do apki🙈" , "pata nhi kaisy logo ko sacha piyaar mil kata ha mujy to jhootha bhi nhi milta 🥺🥺" , "Ghr me izaat aa jaty hain bot bot karny 😅😅" , " hN ji mere na hony waly janu aap ne yaad kara 🙈🙈 " "mungh phali me dana nhi Ali Jan ko shor kr jana nhi😅😅😅" , "Rishty ke lye 1 dabaye shadi k lye 2 dabaye agr aap shadi shuda hai or dosri shadi krna chahty hai to apni pehli bivi ka gala dabayenb🙉🙉🙉🙈😅" , "Tumahari zulfon mein uljha hwa hai Mohalle ka suljha hwa larka Ali Jan " , "Agr tumhara piyaar sacha hota to aaj humara bhi bacha hota🙉😅" , "tum bas mu banati rehna Ali jan ko koi or pata le gi 🤣😅" , "Me larkion SE bt ni krta" , "Mjhse shadi krogi" , "Ib ib kia bol rha idr bol mery samne" , "Aurat zaat SE ghabraya hua Hun" , "Dil garden garden horha" , "Me galli ni Dunga" , "G Meri Jan" , "Bkwas na kr" , "Toba toba"];
var rand = tl[Math.floor(Math.random() * tl.length)]

    if ((event.body.toLowerCase() == "😁") || (event.body.toLowerCase() == "😁😁")) {
     return api.sendMessage("Hass hass ke danT dikhana band kr, toothpaste ka ad lagta tu 😂🪥", threadID);
   };

   if ((event.body.toLowerCase() == "😆") || (event.body.toLowerCase() == "😆😆")) {
     return api.sendMessage("Pagal laugh kr rha jese light ka bill tu bharta ho 😂💡", threadID);
   };

   if ((event.body.toLowerCase() == "😅") || (event.body.toLowerCase() == "😅😅")) {
     return api.sendMessage("Pasina nikal rha ya chori pakri gai? 😅🤣", threadID);
   };

   if ((event.body.toLowerCase() == "😂") || (event.body.toLowerCase() == "🤣")) {
     return api.sendMessage("Hans hans ke lungi gili kr di be 😂👙", threadID);
   };

   if ((event.body.toLowerCase() == "😭") || (event.body.toLowerCase() == "😭😭")) {
     return api.sendMessage("Rona band kr, warna log samjhein gey mehngaai ka asar hai 🥲💸", threadID);
   };

   if ((event.body.toLowerCase() == "😉") || (event.body.toLowerCase() == "😉😉")) {
     return api.sendMessage("Aankh maarna chor de flirtu, yahan sab tere jese expert hain 😏💃", threadID);
   };

   if ((event.body.toLowerCase() == "😙") || (event.body.toLowerCase() == "😘")) {
     return api.sendMessage("Aeeyy hoye kissi na dia 😘, zara repeat to kr k dikha mujhe bhi do 😜", threadID);
   };

   if ((event.body.toLowerCase() == "🥰") || (event.body.toLowerCase() == "😍")) {
     return api.sendMessage("Itna pyar mujhe koi ex bhi nhi krta tha 🥰🔥", threadID);
   };

   if ((event.body.toLowerCase() == "🥳")) {
     return api.sendMessage("Party warti lag rhi ha, mujhe bhi bula lo na biryani khani ha 😋🎉", threadID);
   };

   if ((event.body.toLowerCase() == "🙃")) {
     return api.sendMessage("Seedha muh leke ao, ulta banda sirf TikTok pe acha lagta hai 😝📱", threadID);
   };

   if ((event.body.toLowerCase() == "🙂")) {
     return api.sendMessage("Yeh wali smile dekh k lagta ha chappal andar chhupa rakhi hai 👡🙂", threadID);
   };

   if ((event.body.toLowerCase() == "🥺")) {
     return api.sendMessage("Itni masoomiyat! Mujhe toh apne gunah yaad aa gaye 🥺🫶", threadID);
   };

   if ((event.body.toLowerCase() == "😑")) {
     return api.sendMessage("Yeh muh dekh k lagta ha roti banai aur jal gai 😂🍞", threadID);
   };

   if ((event.body.toLowerCase() == "🤫") || (event.body.toLowerCase() == "🫣")) {
     return api.sendMessage("Chup rehna chahty ho ya kiss chhupa rahe ho 😏🫢", threadID);
   };

   if ((event.body.toLowerCase() == "😒") || (event.body.toLowerCase() == "🙄")) {
     return api.sendMessage("Yeh wala muh bana k mummy se chappal zarur khai ho gi 😒🩴", threadID);
   };

   if ((event.body.toLowerCase() == "😡") || (event.body.toLowerCase() == "🤬")) {
     return api.sendMessage("Itna gussa? Lagta hai chai mein cheeni kam thi ☕😤", threadID);
   };

   if ((event.body.toLowerCase() == "😥") || (event.body.toLowerCase() == "😢") || (event.body.toLowerCase() == "☹️")) {
     return api.sendMessage("Udaas na ho meri jaan, warna teri smile ban karwa dun ga 😘🥀", threadID);
   };

   if ((event.body.toLowerCase() == "😕") || (event.body.toLowerCase() == "😰")) {
     return api.sendMessage("Confused mat ho, dil de do sab saaf ho jaye ga 🫶😂", threadID);
   };

   if ((event.body.toLowerCase() == "👻")) {
     return api.sendMessage("Bhoooot bhi tujhe dekh k darr jaaye 😂👻", threadID);
   };

   if ((event.body.toLowerCase() == "😎")) {
     return api.sendMessage("Style maar raha? Tera yeh swag to sabzi mandi mein bhi nhi bikta 😎🧅", threadID);
   };

   if ((event.body.toLowerCase() == "🙈") || (event.body.toLowerCase() == "🙊")) {
     return api.sendMessage("Sharam ati ha? Ab to screenshot le ke sabko dikhaonga 😹📸", threadID);
   };

   if ((event.body.toLowerCase() == "♥️") || (event.body.toLowerCase() == "💋")) {
     return api.sendMessage("Itna pyar? Shadi ki date bhi fix kr lo ab 😘💍", threadID);
   };

   if ((event.body.toLowerCase() == "👀")) {
     return api.sendMessage("Aankhein phaad k kya dekh raha? Muh pe kuch laga ha kya? 👀😝", threadID);
   };

   if ((event.body.toLowerCase() == "👋")) {
     return api.sendMessage("Bye bolne se pehle kiss to do 😘👋", threadID);
   };

   if ((event.body.toLowerCase() == "🧸")) {
     return api.sendMessage("Teddy mujhe dedo warna rona aa jaye ga 🧸🥺", threadID);
   };
  
   if ((event.body.toLowerCase() == "Ayna") || (event.body.toLowerCase() == "@Aƴʌŋ Hʋŋ Yʌʌʀ")) {
     return api.sendMessage("Boss is Busy 👀", threadID);
   };
   mess = "{what is your name}"

  if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("Bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
    
