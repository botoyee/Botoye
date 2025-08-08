const { spawn } = require("child_process");
const axios = require("axios");
const express = require("express");
const path = require("path");
const fs = require("fs");
const logger = require("./utils/log");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 8080;

// Serve static files (CSS, JS, images if needed)
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Status API (multi-user info)
app.get("/status", (req, res) => {
    res.json({
        botStatus: global.botStatus || "unknown",
        restarts: global.countRestart || 0,
        uptime: process.uptime(),
        users: global.activeUsers || [],
        lastUpdate: new Date().toISOString()
    });
});

app.listen(port, () => {
    logger(`Server running on port ${port}...`, "[ SERVER ]");
}).on("error", (err) => {
    logger(`Server error: ${err.message}`, "[ SERVER ]");
});

/////////////////////////////////////////////////////////
//========= Start bot with auto-restart on crash =======//
/////////////////////////////////////////////////////////

global.countRestart = global.countRestart || 0;
global.activeUsers = [];
global.botStatus = "starting";

function startBot(message) {
    if (message) logger(message, "[ BOT ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "rudra.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("spawn", () => {
        global.botStatus = "running";
    });

    child.on("close", (codeExit) => {
        global.botStatus = "stopped";
        if (codeExit !== 0 && global.countRestart < 5) {
            global.countRestart++;
            logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ BOT ]");
            startBot();
        } else {
            logger(`Bot stopped after ${global.countRestart} restarts.`, "[ BOT ]");
        }
    });

    child.on("error", (error) => {
        logger(`Bot error: ${error.message}`, "[ BOT ]");
    });
}

////////////////////////////////////////////////
//========= Check update from GitHub =========//
////////////////////////////////////////////////

axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
    .then((res) => {
        logger(`Bot: ${res.data.name}`, "[ UPDATE ]");
        logger(`Version: ${res.data.version}`, "[ UPDATE ]");
        logger(res.data.description, "[ UPDATE ]");
    })
    .catch((err) => {
        logger(`Update check failed: ${err.message}`, "[ UPDATE ]");
    });

// Start the bot
startBot();
