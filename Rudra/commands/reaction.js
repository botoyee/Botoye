module.exports.config = {
  name: "autoreact",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali",
  description: "Auto reacts to messages based on type & emotion",
  commandCategory: "Auto",
  usages: "Just works automatically",
  cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event }) {
  const { messageID, body, threadID, attachments } = event;
  if (!body && attachments.length === 0) return;

  const react = (emoji) => api.setMessageReaction(emoji, messageID, (err) => {}, true);

  const text = body ? body.toLowerCase() : "";

  // Reaction types
  const sadWords = ["udaas", "tanha", "toota", "akela", "zindagi", "rona", "mar gya", "chhor diya"];
  const funnyWords = ["haha", "lol", "pagal", "crazy", "chod", "mazaak", "lmao", "ghanta"];
  const emojiOnly = /^[\p{Emoji}\s]+$/u; // emoji regex

  if (attachments.length > 0) {
    const type = attachments[0].type;

    if (type === "photo") return react("❤️");
    if (type === "audio") return react("🔊");
    if (type === "video") return react("🔥");
    if (type === "animated_image") return react("🤣"); // GIFs
  }

  // Sad words
  for (const word of sadWords) {
    if (text.includes(word)) return react("😢");
  }

  // Funny words
  for (const word of funnyWords) {
    if (text.includes(word)) return react("😂");
  }

  // Emoji-only message reaction
  if (emojiOnly.test(body.trim())) {
    const emojiReacts = ["😎", "🧡", "😮", "🥰"];
    const randomEmoji = emojiReacts[Math.floor(Math.random() * emojiReacts.length)];
    return react(randomEmoji);
  }

  // Default fallback
  return react("👍");
};

module.exports.run = function () {};