const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  const recordingsDir = path.join(__dirname, '..', 'recordings');

  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
  if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir, { recursive: true });

  console.log('Launching browser with video recorder...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Initial State Screenshot
  console.log('Capturing Screenshot 1: 01-game-start.png...');
  await page.screenshot({ path: path.join(screenshotsDir, '01-game-start.png') });
  await page.waitForTimeout(1500);

  // 2. Select Piece in Tray & Rotate/Flip
  console.log('Selecting piece in tray...');
  const firstPiece = page.locator('button[title*="Select"]').first();
  await firstPiece.click();
  await page.waitForTimeout(800);

  // Rotate piece
  console.log('Rotating piece...');
  const rotateBtn = page.locator('button:has-text("Rotate")');
  await rotateBtn.click();
  await page.waitForTimeout(600);
  await rotateBtn.click();
  await page.waitForTimeout(600);

  // Flip piece
  console.log('Flipping piece...');
  const flipBtn = page.locator('button:has-text("Flip")');
  await flipBtn.click();
  await page.waitForTimeout(800);

  // Capture Screenshot 2: Piece Controls
  console.log('Capturing Screenshot 2: 02-piece-controls.png...');
  await page.screenshot({ path: path.join(screenshotsDir, '02-piece-controls.png') });
  await page.waitForTimeout(1000);

  // Deselect piece
  const deselectBtn = page.locator('button[title="Deselect"]');
  await deselectBtn.click();
  await page.waitForTimeout(600);

  // 3. Demonstrate Gameplay & Solving using Hint Engine
  console.log('Placing pieces using solver hints...');
  const hintBtn = page.locator('button[title*="hint"]');

  for (let i = 1; i <= 8; i++) {
    console.log(`Placing piece ${i}/8...`);
    await hintBtn.click();
    await page.waitForTimeout(700);
  }

  // Wait for win modal and confetti
  console.log('Waiting for victory modal...');
  await page.waitForSelector('text=Puzzle Solved!', { timeout: 5000 });
  await page.waitForTimeout(1200);

  // Capture Screenshot 3: Victory Modal
  console.log('Capturing Screenshot 3: 03-victory-modal.png...');
  await page.screenshot({ path: path.join(screenshotsDir, '03-victory-modal.png') });
  await page.waitForTimeout(1500);

  // Click "Share Score in Comments"
  console.log('Clicking share comment button...');
  const shareBtn = page.locator('button:has-text("Share Score in Comments")');
  if (await shareBtn.isVisible()) {
    await shareBtn.click();
    await page.waitForTimeout(1000);
  }

  // Open "Play Another Date" (Archive Modal)
  console.log('Opening Archive / Date Picker modal...');
  const archiveBtn = page.locator('button:has-text("Play Another Date")');
  await archiveBtn.click();
  await page.waitForTimeout(1000);

  // Capture Screenshot 4: Archive Modal
  console.log('Capturing Screenshot 4: 04-archive-picker.png...');
  await page.screenshot({ path: path.join(screenshotsDir, '04-archive-picker.png') });
  await page.waitForTimeout(1500);

  // Close context to finish video
  console.log('Finalizing video recording...');
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    console.log('Raw video saved to:', rawVideoPath);

    const mp4Path = path.join(recordingsDir, 'calendit_demo.mp4');
    console.log(`Converting ${rawVideoPath} to ${mp4Path} via ffmpeg...`);
    try {
      execSync(`ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -pix_fmt yuv420p -r 30 "${mp4Path}"`, {
        stdio: 'inherit',
      });
      console.log('MP4 video successfully created at:', mp4Path);
    } catch (e) {
      console.error('ffmpeg conversion error:', e);
    }
  }

  console.log('Recording and screenshot capture complete!');
}

run().catch((err) => {
  console.error('Error during recording:', err);
  process.exit(1);
});
