import { chromium } from "playwright";
import fs from "fs";

async function pingFirebase() {
  let storageState;

  // Prefer base64 file if exists
  if (fs.existsSync("storageState.b64")) {
    const b64 = fs.readFileSync("storageState.b64", "utf8");
    storageState = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } else if (fs.existsSync("storageState.json")) {
    storageState = JSON.parse(fs.readFileSync("storageState.json", "utf8"));
  } else {
    throw new Error("No storageState.json or storageState.b64 found");
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  await page.goto("https://studio.firebase.google.com/vps123-79830504", {
    waitUntil: "networkidle"
  });

  console.log(`[${new Date().toISOString()}] ✅ Workspace opened successfully`);
  await browser.close();
}

(async () => {
  while (true) {
    try {
      await pingFirebase();
    } catch (err) {
      console.error(`[${new Date().toISOString()}] ❌ Error:`, err);
    }
    // wait 5 minutes
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));
  }
})();
