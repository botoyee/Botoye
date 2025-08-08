require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function pushFile() {
  const owner = "Dev093235"; // GitHub username
  const repo = "Rudra-new"; // Repo name
  const branch = "main"; // Branch name

  const filePath = "test.txt"; // Local file
  const content = fs.readFileSync(filePath, "utf-8");
  const encodedContent = Buffer.from(content).toString("base64");

  // Check if file already exists
  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch
    });
    sha = data.sha;
  } catch (err) {
    sha = undefined; // New file
  }

  // Commit file
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: "Automated commit from Node.js",
    content: encodedContent,
    branch,
    sha
  });

  console.log("✅ Push successful!");
}

pushFile().catch(console.error);
