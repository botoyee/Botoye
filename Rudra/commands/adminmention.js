module.exports.config = {
  name: "adminTrigger",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Replies when someone mentions admin",
  commandCategory: "group",
  usages: "",
  cooldowns: 0
};

const adminUIDs = ["100001854531633"]; // <-- Yahan apne admin UID add karo

const flirtyReplies = [
  "Aye haye! Itna pyaar se tag kiya? Dil le gaye aap 😘",
  "Tag toh kiya hai, ab reply ka intezar bhi hoga na handsome/beautiful? 😉",
  "Tum tag karo, main ignore karun? Itna zulm mat karo jaaneman 😅",
  "Aap mujhe yaad karte ho ya sirf tag kar ke bhool jaate ho? 😜",
  "Lagta hai kisi ka dil phir se Muskan pe aa gaya 😏",
  "Itna cute tag mila, ab dil na de to kya karein? 😍",
  "Tumhara tag aaya, aur meri smile auto-on ho gayi 😊",
  "Tum sirf message bhejte ho, dil bhejna kab ka plan hai? 💌",
  "Mujhe tag karna tumhara nasha ban gaya hai kya? 😄",
  "Agar har tag me itna pyaar ho to main har waqt online rehna shuru kar doon kya? 🥰"
];

module.exports.handleEvent = async function({ event, api }) {
  const mentionIDs = Object.keys(event.mentions || {});
  const isAdminTagged = mentionIDs.some(id => adminUIDs.includes(id));

  if (isAdminTagged) {
    const randomReply = flirtyReplies[Math.floor(Math.random() * flirtyReplies.length)];
    return api.sendMessage(randomReply, event.threadID, event.messageID);
  }
};

module.exports.run = () => {};
