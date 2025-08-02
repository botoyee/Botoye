module.exports.config = {
  name: "owneradd", // <-- yahan change
  version: "1.0.0",
  hasPermission: 2,
  credits: "Ayan Ali",
  description: "Add owner to all joined groups",
  commandCategory: "admin",
  usages: "/owneradd", // <-- yahan bhi change
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const OWNER_UID = "100001854531633";
  let added = 0, failed = 0;

  try {
    const threads = await api.getThreadList(100, 2); // type 2 = groups

    for (const thread of threads) {
      try {
        await api.addUserToGroup(OWNER_UID, thread.threadID);
        added++;
      } catch (e) {
        failed++;
      }
    }

    return api.sendMessage(
      `👤 Owner Add Report:\n\n✅ Success: ${added} groups\n❌ Failed: ${failed}`,
      event.threadID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Error occurred while adding owner.", event.threadID);
  }
};
