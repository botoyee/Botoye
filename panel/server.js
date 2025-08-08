// panel/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const CONFIG_PATH = "botConfig.json"; // path inside repo root when saving locally
const GITHUB_OWNER = process.env.GITHUB_OWNER || ""; // repo owner/org (required for GitHub save)
const GITHUB_REPO = process.env.GITHUB_REPO || "";   // repo name
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""; // personal access token with repo scope
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminpass"; // set in Render env vars
const SAVE_PATH_IN_REPO = process.env.SAVE_PATH_IN_REPO || "botConfig.json"; // where to save file in repo

// Basic auth middleware for UI/API (simple password-only)
function requireAuth(req, res, next) {
  const pass = req.headers["x-admin-password"] || req.query.p || req.body.adminPassword;
  if (!pass || pass !== ADMIN_PASSWORD) {
    if (req.path.startsWith("/api/")) return res.status(401).json({ error: "Unauthorized" });
    return res.status(401).send("Unauthorized - provide admin password");
  }
  return next();
}

// Endpoint to get current config (try GitHub then local)
app.get("/api/config", requireAuth, async (req, res) => {
  try {
    // Try GitHub first
    if (GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(
        SAVE_PATH_IN_REPO
      )}?ref=${GITHUB_BRANCH}`;
      const gitRes = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" }
      });
      // If success, return raw content
      return res.json({ source: "github", data: gitRes.data });
    }
  } catch (err) {
    // ignore and fallback to local
  }

  // Local fallback
  try {
    const filepath = path.join(__dirname, "..", SAVE_PATH_IN_REPO);
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, "utf8");
      return res.json({ source: "local", data: JSON.parse(content) });
    }
  } catch (e) {
    // ignore
  }

  return res.json({ source: "none", data: null });
});

// API to save config - accepts JSON body { appState, prefix, botName, adminId }
app.post("/api/save", requireAuth, async (req, res) => {
  const { appState, prefix, botName, adminId } = req.body;
  if (!prefix || !botName) return res.status(400).json({ error: "prefix and botName required" });

  const configObj = {
    appState: appState || "",
    prefix: prefix,
    botName: botName,
    adminId: adminId || ""
  };

  // If GitHub token + repo configured, save to repo via GitHub API
  if (GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
    try {
      const content = Buffer.from(JSON.stringify(configObj, null, 2)).toString("base64");

      // Get current file sha if exists
      const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(
        SAVE_PATH_IN_REPO
      )}`;
      let sha;
      try {
        const getRes = await axios.get(getUrl, {
          headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
          params: { ref: GITHUB_BRANCH }
        });
        sha = getRes.data.sha;
      } catch (e) {
        // file may not exist - ok
      }

      const putUrl = getUrl;
      const body = {
        message: `Update bot config via panel`,
        content,
        branch: GITHUB_BRANCH
      };
      if (sha) body.sha = sha;

      const putRes = await axios.put(putUrl, body, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
      });

      return res.json({ ok: true, saved: "github", url: putRes.data.content.html_url });
    } catch (err) {
      console.error("GitHub save error:", err.response?.data || err.message);
      // fallthrough to local save
    }
  }

  // Local save fallback (ephemeral on Render; persists only until redeploy)
  try {
    const filepath = path.join(__dirname, "..", SAVE_PATH_IN_REPO);
    fs.writeFileSync(filepath, JSON.stringify(configObj, null, 2), "utf8");
    return res.json({ ok: true, saved: "local", path: filepath });
  } catch (e) {
    console.error("Local save error:", e);
    return res.status(500).json({ ok: false, error: "Failed to save config" });
  }
});

// Simple health
app.get("/healthz", (req, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Panel running on port ${PORT}`);
});
