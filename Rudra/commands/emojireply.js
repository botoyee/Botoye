module.exports.config = {
  name: "autoemoji",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Ayan Ali + ChatGPT",
  description: "Auto desi emoji-only reply setup — custom reply ready",
  commandCategory: "fun",
  usages: "Just send emoji",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body) return;

  const emojiOnly = /^[\p{Emoji}\s]+$/u;
  if (!emojiOnly.test(body.trim())) return;

  const emoji = body.trim();
  const replyMap = {
    // Sad
    "😭": "aly aly lo nhi baby btao kya hua ex ki yaad aa rhi ha 😟 🥹🥺🥺🍼",
    "😢": "tya hua meli jan 😢🥺",
    "🥺": "baby tya hua 🥺",
    "🥲": "loty nhi baby 😘😘",
    "😥": "🥺🥺🥺",
    "😟": "tya hua ex ki yaad aa rhi h 😳🙉",
    "😿": "🥹😢😢",
    "😪": "😢🥹😢🥹😢",

    // Funny
    "🤣": "Ziyda na hans pagl lag rhy ho 😝",
    "😂": "aby dant to saf kr lety 😝",
    "😅": "teri tind se pani ku tapk rha bey 😂",
    "😆": "tera mu teda ku ho gya h😳😅",
    "😄": "🤬",
    "😹": "😹😹😹",
    "😜": "teri zaban aesy latak rhi ha jaisy phata hua pajama 😹",
    "😛": "aly aly doggy lag rhy 🐕",
    "🤪": "aby teri ankh choti ku ho gai h 😂",
    "🤭": "",

    // Love / Romantic
    "😍": "𝘛𝘦𝘳𝘢 𝘋𝘦𝘬𝘩𝘯𝘢 𝘣𝘩𝘪 𝘦𝘬 𝘮𝘢𝘥𝘩𝘰𝘴𝘩𝘪 𝘩𝘢𝘪...\n😍 𝘛𝘦𝘳𝘪 𝘈𝘢𝘯𝘬𝘩𝘰𝘯 𝘮𝘦𝘪𝘯 𝘱𝘺𝘢𝘳 𝘩𝘪 𝘱𝘺𝘢𝘳 𝘩𝘢𝘪.",
    "😘": "ummma 😘😘",
    "🥰": "aly aly monkey jaisi shakl pr Dil rakh kr khush ho rhy ho 😂",
    "😙": "chi chi ghnda 😝",
    "❤️": "🥰🥰🥰",
    "💋": "😘🙈🙈",

    // Flirty / Fun
    "😉": "ankh mat maar thrki ankh phor don gi 🤬",
    "😏": "baat na kr mu to seedha kr begum 😅",
    "😇": "nasha charh gya 😳",
    "🙂": "BaBy Fake sMiLe 🥺 tya hUa h🥺",
    "🙃": "naughty seedha ho ja 🙈",
    "😐": "kya hua ex ko kisi or ke sath dekh liya 😹😅",
    "😶": "tera naak or mu kidr ha bey 😂",
    "😑": "👻",
    "🙁": "tya hua mu ku ltkaya h😝l🥺",
    "🤐": "ho gai bolti band nikal gai hawa 😂😅",
    "🫣": "chupky chupky se Dekhty ho koi to wajh hogi 🙈🙈",

    // Angry / Annoyed
    "😡": "Gusy me pyary lagty ho 😘🙈",
    "😠": "ina ghusa na kr 🥰😍",
    "🤬": "tya hua baby 🥺🥺",
    "😤": "hehehe naak se dhunha nikal rha 😹",
    "🙄": "oper Teri pHophi nAsreen ha kya 😹😂",
    "😒": "jana tya hua 🤕",

    // Awkward / Shock / Sick
    "😳": "shock na ho jana sirf u ki ho 🙈",
    "🤮": "konsa maheena ha bey 😂",
    "🤧": "ghnda 🤮",
    "🤕": "",

    // Party / Sleepy / Others
    "🥳": "pa pa na kr bey 😡",
    "🫤": "tya hua 🫤🫤🫤",
    "👀": "👀👀👀",
    "🙈": "hye hye beshrm ko aj shrm aa gai 😹😂",
    "🙊": "bo bol shrma nhi 😹👀",
    "🙉": "😉😉😉",
    "💀": "mat darao baby🥺🥺🥺",
    "🍼": "dudo 😍",

    // Country
    "Pakistan": "Pakistan ZindabAd ❤️"
  };

  for (const emo in replyMap) {
    if (emoji.includes(emo)) {
      const response = replyMap[emo];
      if (response && response.length > 0) {
        return api.sendMessage(response, threadID, messageID);
      }
    }
  }

  // Default reply if emoji not found or blank
  const fallback = [
    "Zaroorat se zyada cute mat bano 🥲",
    "Sirf emoji? Dil ki baat toh bol 😏",
    "Emoji daala, dil chura liya 💘",
    "Yeh kaunsa secret code bheja? 😹"
  ];
  const randomReply = fallback[Math.floor(Math.random() * fallback.length)];
  return api.sendMessage(randomReply, threadID, messageID);
};

module.exports.run = function () {};


