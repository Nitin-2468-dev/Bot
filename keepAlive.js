const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  // Load the saved session
  const storageState = JSON.parse(fs.readFileSync("storageState.json", "utf8"));

  // Launch Chromium (headless in production, visible for testing)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Open Firebase Studio page
  await page.goto("https://studio.firebase.google.com/vps123-79830504", {
    waitUntil: "networkidle"
  });

  console.log("✅ Firebase Studio workspace opened using saved session");

  await browser.close();
})();
