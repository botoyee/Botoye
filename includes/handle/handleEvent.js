const fs = require("fs");
const path = require("path");
const logger = require("../../utils/log.js");
const moment = require("moment");

// Correct path for your project
const approvedFile = path.join(__dirname, "../../commands/Priyanshu/approvedThreads.json");
const pendingFile = path.join(__dirname, "../../commands/Priyanshu/pendingThreads.json");

// Create files if not exist
if (!fs.existsSync(approvedFile)) fs.writeFileSync(approvedFile, JSON.stringify([]));
if (!fs.existsSync(pendingFile)) fs.writeFileSync(pendingFile, JSON.stringify([]));

module.exports = function ({ api, models, Users, Threads, Currencies }) {
  return function ({ event }) {
    const timeStart = Date.now();
    const time = moment.tz("Asia/Kolkata").format("HH:mm:ss L");

    const { userBanned, threadBanned } = global.data;
    const { events } = global.client;
    const { allowInbox, DeveloperMode } = global.config;

    let { senderID, threadID } = event;
    senderID = String(senderID);
    threadID = String(threadID);

    // Blocked users/groups
    if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox === false && senderID === threadID)) return;

    // ✅ Approval check (for groups only)
    if (senderID !== threadID) {
      const approved = JSON.parse(fs.readFileSync(approvedFile));
      const pending = JSON.parse(fs.readFileSync(pendingFile));

      if (!approved.includes(threadID)) {
        if (!pending.includes(threadID)) {
          pending.push(threadID);
          fs.writeFileSync(pendingFile, JSON.stringify(pending, null, 2));
        }

        return api.sendMessage(
          `📛 *Approval Needed To Activate Bot In This Group*\n\n🔒 Contact Admin For Access:\n👉 https://facebook.com/100001854531633`,
          threadID
        );
      }
    }

    // Run event listeners
    for (const [key, value] of events.entries()) {
      if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
        const eventRun = events.get(key);
        try {
          const Obj = { api, event, models, Users, Threads, Currencies };
          eventRun.run(Obj);
          if (DeveloperMode === true)
            logger(global.getText('handleEvent', 'executeEvent', time, eventRun.config.name, threadID, Date.now() - timeStart), '[ Event ]');
        } catch (error) {
          logger(global.getText('handleEvent', 'eventError', eventRun.config.name, JSON.stringify(error)), "error");
        }
      }
    }

    return;
  };
};
