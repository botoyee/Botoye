module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    const moment = require("moment");
    const fs = require("fs");
    const approvedPath = __dirname + "/../../Priyanshu/approvedThreads.json";
    const pendingPath = __dirname + "/../../Priyanshu/pendingdThreads.json";

    // Create files if not exist
    if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([]));
    if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));

    return function ({ event }) {
        const timeStart = Date.now();
        const time = moment.tz("Asia/Kolkata").format("HH:mm:ss L");
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;

        var { senderID, threadID, isGroup } = event;
        senderID = String(senderID);
        threadID = String(threadID);

        // block banned users/groups
        if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == false && senderID == threadID) return;

        // approval logic
        const approved = JSON.parse(fs.readFileSync(approvedPath));
        const pending = JSON.parse(fs.readFileSync(pendingPath));

        if (!approved.includes(threadID)) {
            // Add to pending list if not already there
            if (!pending.includes(threadID)) {
                pending.push(threadID);
                fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
            }

            // Send approval needed message
            return api.sendMessage(
                `🛑 Approval needed to activate in this group.\nContact to admin for approval:\nFacebook.com/100001854531633`,
                threadID
            );
        }

        // Run handleEvent listeners
        for (const [key, value] of events.entries()) {
            if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
                const eventRun = events.get(key);
                try {
                    const Obj = {
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies
                    };
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
}
