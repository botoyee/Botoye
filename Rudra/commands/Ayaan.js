module.exports.config = {
    name: "owner",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "... - Long LTD",
    description: "War In Chatbox",
    commandCategory: "Noprefix",
    usages: "noprefix",
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
    var a = function (a) { api.sendMessage(a, event.threadID); }
a("📘✨ *OWNER INFO* ✨📘

(◕‿◕)➤ 𝑨𝒚𝑨𝑵 (💀 𝑩𝒂𝒅 𝑩𝒐𝒚 𝑽𝒊𝒃𝒆𝒔 😎)
👑 𝑨𝒈𝒆 : 22
💘 𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑 : 𝑵𝒐𝒏𝒆, 𝑩𝒆𝒄𝒂𝒖𝒔𝒆 𝑰 𝑨𝒎 𝑬𝒏𝒐𝒖𝒈𝒉 😌
🏡 𝑭𝒓𝒐𝒎 : 𝑾𝒂𝒅𝒊𝒆 𝑳𝒐𝒗𝒆𝒓𝒔 ✨
🎓 𝑺𝒕𝒖𝒅𝒚 : 𝑪𝒐𝒎𝒑𝒖𝒕𝒆𝒓 𝑷𝒓𝒐𝒈𝒓𝒂𝒎𝒎𝒊𝒏𝒈 👨‍💻
📘 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 : https://www.facebook.com/100004370672067
📞 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 : 𝒕𝒂𝒎𝒊𝒛 𝒔𝒆 𝒃𝒂𝒂𝒕 𝒌𝒓, 𝒄𝒉𝒂𝒍 𝒏𝒆𝒌𝒂𝒍 ⚠️

🖤 
"𝑻𝒖 𝒘𝒂𝒇𝒂 𝒌𝒊 𝒃𝒂𝒂𝒕 𝒌𝒂𝒓𝒕𝒂 𝒉𝒂𝒊,  
𝑯𝒂𝒎 𝒕𝒐 𝒕𝒂𝒒𝒅𝒊𝒓𝒐𝒏 𝒌𝒐 𝒃𝒉𝒊 𝒄𝒉𝒉𝒐𝒓 𝒅𝒆𝒕𝒆 𝒉𝒂𝒊𝒏!" 😈💔🔥");


}