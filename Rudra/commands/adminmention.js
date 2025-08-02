module.exports.config = {
  name: "adminTrigger",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Replies when someone mentions admin",
  commandCategory: "group",
  usages: "",
  cooldowns: 0
};

const adminUIDs = ["100001854531633"]; // <-- yahan admin UID likho (add more if needed)
const replies = [
  "⚠️ Admin ka naam lene se pehle 3 baar socha karo 😤",
  "😡 Admin ne tumhe poocha bhi nahi, fir kyun tag kiya?",
  "Tag mat karo admin ko, warna bot tumhare dreams me aa jayega 😂",
  "🤬 Admin bzy hai, tum free ho kya?",
  "🤣 Tumhara tag dekh ke admin ne group mute kar diya"
];

module.exports.handleEvent = async function({ event, api }) {
  const mentionIDs = Object.keys(event.mentions || {});
  const isAdminTagged = mentionIDs.some(id => adminUIDs.includes(id));
  
  if (isAdminTagged) {
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(randomReply, event.threadID, event.messageID);
  }
};


module.exports.run = () => {};
