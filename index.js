const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { Octokit } = require("@octokit/rest");
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// GitHub client setup
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'Rudra Dashboard v1.0',
  request: { timeout: 5000 }
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Global variables
global.countRestart = global.countRestart || 0;
global.runningBots = global.runningBots || {};

///////////////////////////////////////////////////////////
//========= Website/Dashboard Routes ====================//
///////////////////////////////////////////////////////////

// Serve the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// API endpoint to get all users
app.get('/api/users', (req, res) => {
    try {
        const users = [];
        if (fs.existsSync(path.join(__dirname, 'users'))) {
            const userDirs = fs.readdirSync(path.join(__dirname, 'users'));
            
            userDirs.forEach(uid => {
                const configPath = path.join(__dirname, 'users', uid, 'config.json');
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    users.push({
                        uid,
                        botName: config.botName,
                        prefix: config.prefix,
                        adminUID: config.adminUID,
                        status: getBotStatus(uid)
                    });
                }
            });
        }
        res.json(users);
    } catch (err) {
        logger(`Error getting users: ${err.message}`, "[ Dashboard ]");
        res.status(500).json({ error: err.message });
    }
});

// API endpoint to register/update a user
app.post('/api/register', async (req, res) => {
    try {
        const { appstate, prefix, botName, adminUID } = req.body;
        
        if (!adminUID || !appstate || !botName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Save locally
        const userDir = path.join(__dirname, 'users', adminUID);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        const config = {
            appstate: JSON.parse(appstate),
            prefix,
            botName,
            adminUID,
            updatedAt: new Date().toISOString()
        };

        const localConfigPath = path.join(userDir, 'config.json');
        fs.writeFileSync(localConfigPath, JSON.stringify(config, null, 2));
        
        // 2. Push to GitHub (non-blocking)
        pushToGitHub(adminUID, config).catch(err => {
            logger(`GitHub backup failed: ${err.message}`, "[ GitHub ]");
        });

        // 3. Start bot
        startBotForUser(adminUID);

        res.json({ 
            success: true,
            message: "Configuration saved successfully"
        });
    } catch (err) {
        logger(`Error registering user: ${err.message}`, "[ Dashboard ]");
        res.status(500).json({ error: err.message });
    }
});

/////////////////////////////////////////////////////////
//========= Bot Management Functions ==================//
/////////////////////////////////////////////////////////

function startBotForUser(uid) {
    const userDir = path.join(__dirname, 'users', uid);
    const configPath = path.join(userDir, 'config.json');
    
    if (!fs.existsSync(configPath)) {
        logger(`No config found for user ${uid}`, "[ Bot Manager ]");
        return;
    }

    // Stop existing bot if running
    if (global.runningBots[uid]) {
        global.runningBots[uid].kill();
        logger(`Restarting bot for user ${uid}`, "[ Bot Manager ]");
    } else {
        logger(`Starting bot for user ${uid}`, "[ Bot Manager ]");
    }

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "rudra.js"], {
        cwd: userDir,
        stdio: "inherit",
        shell: true,
        env: {
            ...process.env,
            USER_CONFIG: configPath
        }
    });

    global.runningBots[uid] = child;

    child.on("close", (codeExit) => {
        if (codeExit !== 0) {
            logger(`Bot for user ${uid} exited with code ${codeExit}. Restarting...`, "[ Bot Manager ]");
            setTimeout(() => startBotForUser(uid), 5000);
        } else {
            logger(`Bot for user ${uid} stopped normally.`, "[ Bot Manager ]");
            delete global.runningBots[uid];
        }
    });

    child.on("error", (error) => {
        logger(`Error in bot for user ${uid}: ${JSON.stringify(error)}`, "[ Bot Manager ]");
    });
}

function getBotStatus(uid) {
    return global.runningBots && global.runningBots[uid] ? "running" : "stopped";
}

// Original bot starter (single instance)
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

/////////////////////////////////////////////////////////
//========= GitHub Backup Functions ===================//
/////////////////////////////////////////////////////////

async function pushToGitHub(uid, config) {
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'your-github-username';
    const repoName = process.env.GITHUB_REPO_NAME || 'your-private-repo-name';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const filePath = `user-configs/${uid}.json`;
    
    try {
        // Get file SHA if exists
        let sha;
        try {
            const { data } = await octokit.repos.getContent({
                owner: repoOwner,
                repo: repoName,
                path: filePath,
                ref: branch
            });
            sha = data.sha;
        } catch (e) {
            if (e.status !== 404) throw e;
        }

        // Create/update file
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: `Update config for ${uid} at ${new Date().toISOString()}`,
            content: Buffer.from(JSON.stringify(config, null, 2)).toString('base64'),
            sha: sha,
            branch: branch
        });
        
        logger(`Successfully pushed config for ${uid} to GitHub`, "[ GitHub ]");
    } catch (error) {
        throw new Error(`GitHub API error: ${error.message}`);
    }
}

/////////////////////////////////////////////////////////
//========= Startup and Maintenance ==================//
/////////////////////////////////////////////////////////

// Start the server
app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Dashboard ]");
    
    // Start all registered user bots
    if (fs.existsSync(path.join(__dirname, 'users'))) {
        const userDirs = fs.readdirSync(path.join(__dirname, 'users'));
        userDirs.forEach(uid => {
            startBotForUser(uid);
        });
    }
    
    // Start the original single bot instance
    startBot("Starting main bot instance...");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Dashboard ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Dashboard ]");
    }
});

// Check for updates
axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
    .then((res) => {
        logger(res.data.name, "[ Rudra ]");
        logger(`Version: ${res.data.version}`, "[ Rudra ]");
        logger(res.data.description, "[ Rudra ]");
    })
    .catch((err) => {
        logger(`Failed to fetch update info: ${err.message}`, "[ Rudra ]");
    });

// System monitoring
setInterval(() => {
    global.systemStats = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        loadavg: require('os').loadavg(),
        activeBots: Object.keys(global.runningBots).length
    };
}, 5000);
