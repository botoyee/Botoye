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
    "🥺": "Aese aankhon se mat dekho, main to waise hi kamzor dil ki hoon 🥹❤️",
    "🥲": "loty nhi baby 😘😘",
    "😥": "🥺🥺🥺",
    "😟": "tya hua ex ki yaad aa rhi h 😳🙉",
    "😿": "🥹😢😢",
    "😪": "😢🥹😢🥹😢",

    // Funny
    "🤣": "Ziyda na hans pagl lag rhy ho 😝",
    "😂": "aby dant to saf kr lety 😝",
    "😅": "Itna sharma rahi ho, lagta hai crush online aa gaya 😅💕",
    "😆": "tera mu teda ku ho gya h😳😅",
    "😄": "🤬",
    "😹": "😹😹😹",
    "😜": "Zaban bahar, dimag ghar pe chhoda kya? 😜🤣",
    "😛": "aly aly doggy lag rhy 🐕",
    "🤪": "aby teri ankh choti ku ho gai h 😂",
    "🤭": "",

    // Love / Romantic
    "😍": "𝘛𝘦𝘳𝘢 𝘋𝘦𝘬𝘩𝘯𝘢 𝘣𝘩𝘪 𝘦𝘬 𝘮𝘢𝘥𝘩𝘰𝘴𝘩𝘪 𝘩𝘢𝘪...\n😍 𝘛𝘦𝘳𝘪 𝘈𝘢𝘯𝘬𝘩𝘰𝘯 𝘮𝘦𝘪𝘯 𝘱𝘺𝘢𝘳 𝘩𝘪 𝘱𝘺𝘢𝘳 𝘩𝘢𝘪.",
    "😘": "ummma 😘😘",
    "🥰": "aly aly monkey jaisi shakl pr Dil rakh kr khush ho rhy ho 😂",
    "😙": "chi chi ghnda 😝",
    "❤️": "🥰🥰🥰",

    // Flirty / Fun
    "😉": "ankh mat maar thrki ankh phor don gi 🤬",
    "😏": "Aese mat dekh... pyaar ho jayega 😏❤️",
    "😇": "nasha charh gya 😳",
    "🙂": "BaBy Fake sMiLe 🥺 tya hUa h🥺",
    "🙃": "naughty seedha ho ja 🙈",
    "😐": "kya hua ex ko kisi or ke sath dekh liya 😹😅",
    "😶": "tera naak or mu kidr ha bey 😂",
    "😑": "👻",
    "🙁": "tya hua mu ku ltkaya h😝l🥺",
    "🤐": "ho gai bolti band nikal gai hawa 😂😅",
    "🫣": "Itni sharam? Pehli baar to flirt nahi kar rahi na? 🫣😉",

    // Angry / Annoyed
    "😡": "Gusy me pyary lagty ho 😘🙈",
    "😠": "ina ghusa na kr 🥰😍",
    "🤬": "tya hua baby 🥺🥺",
    "😤": "hehehe naak se dhunha nikal rha 😹",
    "🙄": "Uff attitude... Queen banne ka irada hai kya? 🙄👑",
    "😒": "Mood off hai? Chalo chaye pilata hun ☕😒",

    // Awkward / Shock / Sick
    "😳": "shock na ho jana sirf u ki ho 🙈",
    "🤮": "konsa maheena ha bey 😂",
    "🤧": "ghnda 🤮",

    // Party / Sleepy / Others
    "🥳": "pa pa na kr bey 😡",
    "🫤": "tya hua 🫤🫤🫤",
    "👀": "Aankhein to meri DP me hi chipki hui hain 👀🔥",
    "🙈": "Ankhein chhupa ke kya karogi? Main to dil me hoon 🙈💘",
    "🙊": "bo bol shrma nhi 😹👀",
    "🙉": "😉😉😉",
    "💀": "Mar gayi kya hansi se ya mujhe dekh ke? 💀😂",
    "🍼": "dudo 😍",
    "😎": "Style maar rahi ho ya aankhon se meri tasveer chura rahi ho? 😎🔥",
    "😴": "Soya hua chehra bhi itna pyara? Mera dream bhi tu hi hai 😴💭",
    "🥵": "Garmi tujh se hai ya mausam badal gaya hai? 🥵❤️‍🔥",
    "🤤": "Tharki nazar... kis pe gir gayi ab? 🤤😂",
    "😚": "Oye hoye! Ye flying kiss mujhe mili kya? 😚💋",
    "😌": "Sukoon mila? Main yaad aayi thi na 😌🌸",
    "🤡": "Clown wali harkatein mat karo, circus me bhej dungi 🤡😆",
    "🥴": "Nasha chadh gaya? Ishq ka ya meri DP ka? 🥴📸",
    "🤔": "Soch rahi ho ya plan bana rahi ho chori ka? 🤔🫢"
  };

  for (const emo in replyMap) {
    if (emoji.includes(emo)) {
      const response = replyMap[emo];
      if (response && response.length > 0) {
        return api.sendMessage(response, threadID, messageID);
      }
    }
  }

  const fallback = [
    "" ];
  const randomReply = fallback[Math.floor(Math.random() * fallback.length)];
  return api.sendMessage(randomReply, threadID, messageID);
};

module.exports.run = function () {};

