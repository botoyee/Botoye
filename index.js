const { spawn } = require("child_process");
const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require("./utils/log");
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
  request: { timeout: 5000 } // Add timeout
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// API endpoint to register/update a user
app.post('/api/register', async (req, res) => {
    try {
        const { appstate, prefix, botName, adminUID } = req.body;
        
        if (!adminUID || !appstate || !botName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Save locally first
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
        
        // 2. Push to GitHub with retry logic
        let githubSuccess = false;
        let githubError = null;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await pushToGitHub(adminUID, config);
                githubSuccess = true;
                break;
            } catch (err) {
                githubError = err;
                logger(`GitHub push attempt ${attempt} failed: ${err.message}`, "[ GitHub ]");
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
            }
        }

        if (!githubSuccess) {
            logger(`Failed to push to GitHub after 3 attempts: ${githubError.message}`, "[ GitHub ]");
        }

        // 3. Start bot regardless of GitHub status
        startBotForUser(adminUID);

        res.json({ 
            success: true,
            githubBackup: githubSuccess,
            message: githubSuccess 
                ? "Configuration saved and backed up to GitHub" 
                : "Configuration saved locally (GitHub backup failed)"
        });
    } catch (err) {
        logger(`Error registering user: ${err.message}`, "[ Dashboard ]");
        res.status(500).json({ error: err.message });
    }
});

// Improved GitHub pushing function
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

// ... [Keep all your existing functions unchanged] ...
