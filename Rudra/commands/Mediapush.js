// ✅ Voice + Media Push to All Groups // 🔧 Rewritten based on sendnoti logic

const fs = require("fs"); const request = require("request");

module.exports.config = { name: "mediapush", version: "2.0.0", hasPermssion: 2, credits: "Modified by Technical Solution", description: "Send media (image/video/voice) to all groups", commandCategory: "system", usages: "Reply to media or attach it", cooldowns: 5, };

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => { let msg = {}, attachment = []; msg.body = body; for (let eachAtm of atm) { await new Promise(async (resolve) => { try { let response = await request.get(eachAtm.url), pathName = response.uri.pathname, ext = pathName.substring(pathName.lastIndexOf(".") + 1), path = __dirname + /cache/${eachAtm.filename}.${ext}; response .pipe(fs.createWriteStream(path)) .on("close", () => { attachment.push(fs.createReadStream(path)); atmDir.push(path); resolve(); }); } catch (e) { console.log(e); } }); } msg.attachment = attachment; resolve(msg); });

module.exports.run = async function ({ api, event, args, Users }) { const moment = require("moment-timezone"); var gio = moment.tz("Asia/Karachi").format("DD/MM/YYYY - HH:mm:ss"); const { threadID, senderID, messageReply } = event;

if (!event.attachments[0] && (!messageReply || !messageReply.attachments[0])) { return api.sendMessage("❌ | Reply any media to send to all groups.", threadID); }

const name = await Users.getNameUser(senderID); const msgBody = 🌀 Media Push by Admin 🌀\n────────────\n⏰ Time: ${gio}\n👤 Admin: ${name}\n────────────\n📩 Attached Media:;

let msg = await getAtm( messageReply ? messageReply.attachments : event.attachments, msgBody );

let allThread = global.data.allThreadID || []; let can = 0, canNot = 0;

await new Promise((resolveMain) => { allThread.forEach((group, idx, arr) => { try { api.sendMessage(msg, group, (err) => { if (err) canNot++; else can++; if (idx === arr.length - 1) { atmDir.forEach(each => fs.unlinkSync(each)); atmDir = []; resolveMain(); } }); } catch (e) { console.log(e); } }); });

return api.sendMessage(✅ | Sent to ${can} groups, failed on ${canNot}., threadID); };

