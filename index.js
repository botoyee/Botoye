// index.js
const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

// ========== Storage for appstate uploads ==========
const upload = multer({ dest: "uploads/" });
if (!fs.existsSync("appstate")) fs.mkdirSync("appstate");

// Serve Panel Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Upload AppState Route
app.post("/upload", upload.single("appstate"), (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) return res.status(400).send("User ID required");

    const newPath = path.join(__dirname, "appstate", `${userid}.json`);
    fs.renameSync(req.file.path, newPath);
    res.send(`✅ Appstate saved for user: ${userid}`);
  } catch (err) {
    res.status(500).send("❌ Upload failed: " + err.message);
  }
});

// Start the server
app.listen(port, () => {
  logger(`Server running on port ${port}...`, "[ Panel ]");
});

// ========== Start Bot with Auto Restart ==========
global.countRestart = global.countRestart || 0;

function startBot(message) {
  if (message) logger(message, "[ Bot ]");

  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "rudra.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (codeExit) => {
    if (codeExit !== 0 && global.countRestart < 5) {
      global.countRestart++;
      logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Bot ]");
      startBot();
    } else {
      logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Bot ]");
    }
  });

  child.on("error", (error) => {
    logger(`Bot error: ${JSON.stringify(error)}`, "[ Bot ]");
  });
}

// Check GitHub Updates
axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
  .then(res => {
    logger(res.data.name, "[ Update ]");
    logger(`Version: ${res.data.version}`, "[ Update ]");
    logger(res.data.description, "[ Update ]");
  })
  .catch(err => {
    logger(`Failed to fetch update info: ${err.message}`, "[ Update ]");
  });

// Start Bot
startBot();
