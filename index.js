const { spawn } = require("child_process");
const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require("./utils/log");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/api/register', (req, res) => {
    try {
        const { appstate, prefix, botName, adminUID } = req.body;
        
        if (!adminUID || !appstate || !botName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create user directory if it doesn't exist
        const userDir = path.join(__dirname, 'users', adminUID);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Save/update config
        const config = {
            appstate: JSON.parse(appstate),
            prefix,
            botName,
            adminUID
        };

        fs.writeFileSync(path.join(userDir, 'config.json'), JSON.stringify(config, null, 2));
        
        // Start/restart bot for this user
        startBotForUser(adminUID);

        res.json({ success: true, message: "Configuration saved successfully" });
    } catch (err) {
        logger(`Error registering user: ${err.message}`, "[ Dashboard ]");
        res.status(500).json({ error: err.message });
    }
});

// Function to start/restart bot for a specific user
function startBotForUser(uid) {
    const userDir = path.join(__dirname, 'users', uid);
    const configPath = path.join(userDir, 'config.json');
    
    if (!fs.existsSync(configPath)) {
        logger(`No config found for user ${uid}`, "[ Bot Manager ]");
        return;
    }

    // Check if bot is already running for this user
    if (global.runningBots && global.runningBots[uid]) {
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

    // Initialize runningBots object if it doesn't exist
    if (!global.runningBots) {
        global.runningBots = {};
    }
    
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

// Function to get bot status (simplified for example)
function getBotStatus(uid) {
    // In a real implementation, you would track actual status
    return global.runningBots && global.runningBots[uid] ? "running" : "stopped";
}

// Start all bots on server startup
function initializeBots() {
    if (fs.existsSync(path.join(__dirname, 'users'))) {
        const userDirs = fs.readdirSync(path.join(__dirname, 'users'));
        userDirs.forEach(uid => {
            startBotForUser(uid);
        });
    }
}

// Start the server
app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Dashboard ]");
    initializeBots();
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Dashboard ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Dashboard ]");
    }
});

// System monitoring (simplified)
setInterval(() => {
    // This would update system stats that can be fetched by the frontend
    global.systemStats = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        loadavg: require('os').loadavg()
    };
}, 5000);
