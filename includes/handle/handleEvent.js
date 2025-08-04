module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const fs = require("fs-extra");

  return async function ({ event }) {
    const { threadID, messageID } = event;
    const client = global.client;
    const _module = global._module;
    const { handleEvent } = client;

    if (handleEvent.length !== 0) {
      for (const value of handleEvent) {
        try {
          // ✅ FIX: Run even if eventType is undefined (normal messages)
          if (!value.config.eventType || value.config.eventType.includes(event.logMessageType)) {
            const data = {};
            const threadData = client.threadData.get(threadID) || {};
            if (typeof threadData.data === "object") data.thread = threadData.data;
            if (typeof threadData.settings === "object") data.threadSettings = threadData.settings;
            if (typeof client.userData.get(event.senderID) === "object")
              data.user = client.userData.get(event.senderID).data || {};

            value.handleEvent({ event, api, models, Users, Threads, Currencies, data });
          }
        } catch (err) {
          console.error(`❌ Failed to execute handleEvent for module: ${value.config.name}\n`, err);
        }
      }
    }

    if (global.client.handleReply.length !== 0) {
      const handleReplyData = global.client.handleReply;
      const indexOfHandle = handleReplyData.findIndex(
        item => item.messageID === messageID && item.threadID === threadID
      );

      if (indexOfHandle < 0) return;
      const data = handleReplyData[indexOfHandle];

      const module = _module.get(data.name);

      if (!module) return;

      try {
        const threadData = client.threadData.get(threadID) || {};
        const dataObj = {};
        if (typeof threadData.data === "object") dataObj.thread = threadData.data;
        if (typeof threadData.settings === "object") dataObj.threadSettings = threadData.settings;
        if (typeof client.userData.get(event.senderID) === "object")
          dataObj.user = client.userData.get(event.senderID).data || {};

        module.handleReply({ api, event, models, Users, Threads, Currencies, handleReply: data, data: dataObj });
      } catch (err) {
        console.error(`❌ Failed to execute handleReply for module: ${data.name}\n`, err);
      }
    }
  };
};
