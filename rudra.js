const fs = require("fs");
const login = require("fca-unofficial"); // or your custom fork
const path = require("path");
const CFonts = require("cfonts");

console.clear();

CFonts.say("RUDRA", {
  font: "block",
  align: "center",
  colors: ["cyan", "blue"],
});

console.log("🔁 Loading appstate...");

let appState;
try {
  appState = require("./appstate.json");
} catch (err) {
  console.error("❌ appstate.json not found!");
  process.exit(1);
}

login({ appState }, async (err, api) => {
  if (err) {
    console.error("❌ Login failed:", err);
    return;
  }

  try {
    const userID = api.getCurrentUserID();
    const userInfo = await api.getUserInfo(userID);
    const userName = userInfo[userID]?.name || "Unknown User";

    console.log(`✅ Logged in as ${userName} (UID: ${userID})`);

    api.setOptions({
      listenEvents: true,
      forceLogin: true,
      updatePresence: true
    });

    const modulesPath = path.join(__dirname, "modules", "commands");
    const files = fs.readdirSync(modulesPath);

    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const modulePath = path.join(modulesPath, file);
      try {
        require(modulePath);
        console.log(`🔷 Loaded module: ${file}`);
      } catch (modErr) {
        console.warn(`❗ Couldn't load module ${file}:`, modErr.message);
      }
    });

    console.log("🚀 All modules attempted to load.");
    console.log("💡 Bot is now active.");

    // Start listening
    const listen = require("./listen.js"); // make sure this exists
    listen(api);

  } catch (error) {
    console.error("❌ Unexpected error during init:", error);
  }
});
