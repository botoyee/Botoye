const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 1. Required dependencies list
const deps = ["axios", "asynckit", "form-data", "moment-timezone", "fs-extra"];

console.log("Checking & Installing missing dependencies...");
try {
  execSync(`npm install ${deps.join(" ")}`, { stdio: "inherit" });
} catch (err) {
  console.error("Dependency install failed:", err);
}

// 2. Create zip
console.log("Creating ZIP file with all dependencies...");
const zipName = "bot_with_modules.zip";
try {
  execSync(`zip -r ${zipName} . -x "*.git*" "*.zip"`, { stdio: "inherit" });
  console.log(`✅ Zip created: ${zipName}`);
} catch (err) {
  console.error("ZIP creation failed:", err);
}
