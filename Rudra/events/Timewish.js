module.exports = async function timeWish(api) {
  const threadID = "YOUR_THREAD_ID"; // replace with your group/thread ID

  setInterval(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
    const hour = now.getHours();

    let message = "";

    if (hour === 7) {
      message = "🌞 *Good Morning!* \n\n“Start your day with Bismillah and faith. Allah is with you.”";
    } else if (hour === 12) {
      message = "🌤️ *Good Afternoon!* \n\n“May your day be filled with barakah and peace.”";
    } else if (hour === 18) {
      message = "🌙 *Good Evening!* \n\n“Don’t forget to thank Allah for this day.”";
    }

    if (message) {
      api.sendMessage(message, threadID);
    }
  }, 60 * 1000); // check every minute
};
