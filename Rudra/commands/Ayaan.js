module.exports.config = {
    name: "owner",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "... - Long LTD",
    description: "War In Chatbox",
    ",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
 var mention = Object.keys(event.mentions)[0];
    
 let name =  event.mentions[mention];
    var arraytag = [];
        arraytag.push({id: mention});
    var a = function (a) { api.(a, event.threadID); }
a("📘✨ ** ✨📘

(◕‿◕)➤ ★彡[Shah]彡★ (💀 Masoom😎)
👑 𝑨𝒈𝒆 : 22
💘 𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑 : 𝑵𝒐𝒏𝒆 😌
🏡 𝑭𝒓𝒐𝒎 : 𝑾𝒂𝒅𝒊𝒆 𝑳𝒐𝒗𝒆𝒓𝒔 ✨
🎓 𝑺𝒕𝒖𝒅𝒚 : BS Psychology👨‍💻
📘 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 : https://www.facebook.com/61553565459843
📞 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 : 𝒕𝒂𝒎𝒊𝒛 𝒔𝒆 𝒃𝒂𝒂𝒕 𝒌𝒓, 𝒄𝒉𝒂𝒍 𝒏𝒆𝒌𝒂𝒍 ⚠️

🖤 
" hye" 😈💔🔥");


}
