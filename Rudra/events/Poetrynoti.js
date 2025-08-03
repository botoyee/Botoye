const schedule = require("node-schedule");

module.exports.config = {
  name: "shayari",
  version: "1.0.0",
  credits: "Kashif Raza",
  description: "Auto sends sad/romantic Urdu shayari every night at 11 PM",
};

const shayariList = [
  "💔 *ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے...*",
  "🥀 *وہ جو وفا کی بات کرتے تھے، وہی دغا دے گئے...*",
  "🖤 *یاد کرتے ہیں تمہیں خاموشی سے، یہ اور بات ہے تمہیں خبر نہ ہو...*",
  "😢 *ہم نے تو ہر بات بھلا دی ان کی، پر دل ہے کہ مانتا ہی نہیں...*",
  "🌙 *چاندنی راتوں میں تیری یاد بہت آتی ہے...*",
  "💘 *تم ملے تو لگا دنیا حسین ہے...*",
  "🔥 *عشق میں ہم نے کیا پایا؟ بس بے سکونی اور تنہائی...*",
  "😭 *بے وفا تجھ سے کیا گلہ کریں، خود ہی محبت غلط کر بیٹھے...*",
  "💫 *کاش تم سمجھتے ہماری خاموشی کو بھی...*",
  "🌧️ *بارش کی بوندوں میں بھی ہم نے تیرا نام سنا ہے...*"
];

module.exports.run = async function({ api }) {
  // Schedule for 11 PM Pakistan time (UTC+5)
  schedule.scheduleJob('0 18 * * *', async function () {
    try {
      const threads = await api.getThreadList(25, null, ["INBOX"]);
      const msg = shayariList[Math.floor(Math.random() * shayariList.length)];

      for (const thread of threads) {
        if (thread.isGroup && thread.name) {
          api.sendMessage(`🌙 *Shayari Time*\n\n${msg}`, thread.threadID);
        }
      }
    } catch (e) {
      console.log("Shayari Event Error:", e);
    }
  });
};
