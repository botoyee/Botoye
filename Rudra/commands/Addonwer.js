module.exports.config = {
  name: "owneradd",
  version: "1.0.0",
  hasPermission: 2, // sirf owner ya admin
  credits: "Ayan Ali",
  description: "Sirf un groups me owner ko add kare jahan wo already added nahi hai.",
  commandCategory: "admin",
  usages: "/owneradd",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const OWNER_UID = "100001854531633";
  let added = 0, alreadyPresent = 0, failed = 0;

  try {
    const threads = await api.getThreadList(100, 2); // Sirf group chats (type: 2)

    for (const thread of threads) {
      try {
        const info = await api.getThreadInfo(thread.threadID);

        // Check karo ke owner already added hai ya nahi
        if (info.participantIDs.includes(OWNER_UID)) {
          alreadyPresent++;
          continue; // skip this group
        }

        // Try to add owner
        await api.addUserToGroup(OWNER_UID, thread.threadID);
        added++;

      } catch (err) {
        failed++;
      }
    }

    return api.sendMessage(
      `📋 *Owner Add Report*\n\n✅ Added: ${added}\n🔁 Already Present: ${alreadyPresent}\n❌ Failed: ${failed}`,
      event.threadID
    );

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ Error while checking groups or adding owner.", event.threadID);
  }
};
