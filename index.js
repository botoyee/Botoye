const { spawn } = require("child_process");
const axios = require("axios");
const os = require("os");
const path = require("path");
const express = require("express");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 8080;

// Global Logs Array
global.botLogs = [];

// Custom Logger
function logger(msg, tag = "[Bot]") {
    const logMsg = `${tag} ${msg}`;
    console.log(logMsg);
    global.botLogs.push(logMsg);
    if (global.botLogs.length > 50) global.botLogs.shift();
}

// Serve the panel HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API for status
app.get("/api/status", (req, res) => {
    const uptime = process.uptime();
    const cpuLoad = os.loadavg()[0].toFixed(2);
    const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + " MB";

    res.json({
        status: "✅ Running",
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        cpu: cpuLoad,
        ram: ramUsage,
        logs: global.botLogs
    });
});

// Start server
app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ MirryKal ]");
}).on("error", (err) => {
    if (err.code === "EACCES") {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ MirryKal ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Rudra ]");
    }
});

/////////////////////////////////////////////////////////
//========= Start bot with auto-restart on crash =======//
/////////////////////////////////////////////////////////

global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ MirryKal ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "rudra.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 5) {
            global.countRestart++;
            logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Rudra ]");
            startBot();
        } else {
            logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Rudra ]");
        }
    });

    child.on("error", (error) => {
        logger(`An error occurred: ${JSON.stringify(error)}`, "[ Rudra ]");
    });
}

////////////////////////////////////////////////
//========= Check update from GitHub =========//
////////////////////////////////////////////////

axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
    .then((res) => {
        logger(res.data.name, "[ Rudra ]");
        logger(`Version: ${res.data.version}`, "[ Rudra ]");
        logger(res.data.description, "[ Rudra ]");
    })
    .catch((err) => {
        logger(`Failed to fetch update info: ${err.message}`, "[ Rudra ]");
    });

// Start the bot
startBot();
