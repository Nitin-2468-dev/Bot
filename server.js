import express from "express";
import { chromium } from "playwright";   // make sure playwright is installed
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Route for sanity check
app.get("/", (req, res) => {
  res.send("Hello from Bot-main 🚀 (Playwright will keep Firebase Studio alive)");
});

// Function to load Firebase Studio with saved login
// Function to load Firebase Studio with saved login
async function keepAlive() {
  try {
    console.log("⚡ Starting Playwright keep-alive task...");

    // Load saved storage state (login cookies/session)
    const storageState = JSON.parse(fs.readFileSync("./storageState.json", "utf-8"));

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ storageState });

    const page = await context.newPage();
    await page.goto("https://studio.firebase.google.com/vps123-79830504", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log("✅ Page loaded successfully at", new Date().toLocaleTimeString());

    // 🕒 Keep the page open for 2 minutes (120000 ms)
    await page.waitForTimeout(120000);

    await browser.close();
    console.log("🛑 Browser closed at", new Date().toLocaleTimeString());
  } catch (err) {
    console.error("❌ Error during keep-alive:", err.message);
  }
}


// Schedule keepAlive every 35 minutes (2100000 ms)
setInterval(keepAlive, 35 * 60 * 1000);

// Run once at startup
keepAlive();

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
