module.exports.config = {
  name: "adduser",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput (fixed by ChatGPT)",
  description: "Add user to the group by Facebook ID or profile link",
  commandCategory: "group",
  usages: "[uid/profile link]",
  cooldowns: 5
};

const axios = require("axios");

async function getUID(url, api) {
  try {
    // Ensure the URL starts with https://
    if (!url.startsWith("http")) url = "https://" + url;

    // Get the redirected URL
    let data = await api.httpGet(url);
    let redirectRegex = /for \(;;\);{"redirect":"(.*?)"}/.exec(data);
    if (redirectRegex) {
      let redirectURL = redirectRegex[1].replace(/\\/g, "");
      data = await api.httpGet(redirectURL);
    }

    // Get user ID
    let uidMatch = /"userID":"(\d+)"/.exec(data);
    let nameMatch = /"title":"(.*?)"/.exec(data);

    const id = uidMatch ? uidMatch[1] : null;
    const name = nameMatch ? JSON.parse(`{"title":"${nameMatch[1]}"}`).title : null;

    return [id ? +id : null, name || null, false];
  } catch (err) {
    return [null, null, true];
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const send = msg => api.sendMessage(msg, threadID, messageID);
  const botID = api.getCurrentUserID();

  const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
  const participants = participantIDs.map(e => parseInt(e));
  const admins = adminIDs.map(e => parseInt(e.id));

  if (!args[0]) return send("❌ Please provide a user ID or Facebook profile link.");

  let id, name, failed;

  if (!isNaN(args[0])) {
    id = parseInt(args[0]);
    name = "Facebook User";
    failed = false;
  } else {
    [id, name, failed] = await getUID(args[0], api);
    if (failed && id != null) return send(id);
    if (failed && id == null) return send("❌ Could not find the Facebook ID from the link.");
  }

  if (participants.includes(id)) {
    return send(`⚠️ ${name || "User"} is already in the group.`);
  }

  try {
    await api.addUserToGroup(id, threadID);
  } catch (err) {
    return send(`❌ Unable to add ${name || "user"} to the group.`);
  }

  if (approvalMode === true && !admins.includes(botID)) {
    return send(`⚠️ Added ${name || "user"}, but you need to approve them manually.`);
  }

  return send(`✅ Added ${name || "user"} to the group successfully.`);
};
