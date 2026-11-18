const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  const recordingsDir = path.join(__dirname, '..', 'recordings');
  const voiceWavPath = path.join(recordingsDir, 'calen-dit-voice.wav');

  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
  if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir, { recursive: true });

  console.log('Target duration from voiceover: 104.0 seconds');
  console.log('Launching browser with 1280x800 video recorder...');

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

  // [00.00s -> 08.00s]: Welcome to CalenDit. The Daily Date Polyomino puzzle built natively for Reddit's developer platform.
  console.log('[00s -> 08s] Showing clean start view & branding...');
  await page.waitForTimeout(4000);
  await page.mouse.move(640, 70); // Hover header brand
  await page.waitForTimeout(4000);

  // [08.00s -> 21.00s]: Every single day, CalenDit locks onto the current date, like November 18th...
  console.log('[08s -> 21s] Highlighting today\'s target date (NOV 18)...');
  await page.mouse.move(735, 70); // Hover date badge
  await page.waitForTimeout(4000);

  // Hover NOV on the board (row 1, col 4)
  const novCell = page.locator('button:text-is("NOV")');
  if (await novCell.isVisible()) {
    await novCell.hover();
  }
  await page.waitForTimeout(4000);

  // Hover 18 on the board (row 4, col 3)
  const day18Cell = page.locator('button:text-is("18")');
  if (await day18Cell.isVisible()) {
    await day18Cell.hover();
  }
  await page.waitForTimeout(5000);

  // [21.00s -> 28.00s]: The rules are deceptively simple. You're given eight polyomino pieces styled in vibrant, reddit colors.
  console.log('[21s -> 28s] Showcasing the 8 vibrant pieces in the tray...');
  const pieceTray = page.locator('span:has-text("Piece Tray")');
  if (await pieceTray.isVisible()) {
    await pieceTray.hover();
  }
  await page.waitForTimeout(3000);

  const pieceButtons = page.locator('button[title*="Select"]');
  const count = await pieceButtons.count();
  for (let i = 0; i < Math.min(count, 4); i++) {
    await pieceButtons.nth(i).hover();
    await page.waitForTimeout(1000);
  }

  // [28.00s -> 42.00s]: Your objective is to rotate, flip and place all eight pieces onto the board...
  console.log('[28s -> 42s] Selecting, rotating, flipping, and placing piece 1...');
  const firstPiece = pieceButtons.first();
  await firstPiece.click();
  await page.waitForTimeout(2000);

  const rotateBtn = page.locator('button:has-text("Rotate")');
  await rotateBtn.click();
  await page.waitForTimeout(1800);
  await rotateBtn.click();
  await page.waitForTimeout(1800);

  const flipBtn = page.locator('button:has-text("Flip")');
  await flipBtn.click();
  await page.waitForTimeout(2000);

  // Hover over the board showing the ghost placement preview
  await page.mouse.move(550, 280);
  await page.waitForTimeout(2000);

  // Use solver hint to place piece 1 cleanly
  const hintBtn = page.locator('button[title*="hint"]');
  await hintBtn.click();
  await page.waitForTimeout(4400);

  // [42.00s -> 51.00s]: Mathematically, every single one of the 366 CalenDit dates is guaranteed to have multiple valid solutions.
  console.log('[42s -> 51s] Placing piece 2 and piece 3...');
  await hintBtn.click(); // Piece 2
  await page.waitForTimeout(4500);
  await hintBtn.click(); // Piece 3
  await page.waitForTimeout(4500);

  // [51.00s -> 63.00s]: We also built an in-browser depth-first search backtracking solver...
  console.log('[51s -> 63s] Solver demonstration: placing pieces 4, 5, 6, 7...');
  await hintBtn.click(); // Piece 4
  await page.waitForTimeout(3000);
  await hintBtn.click(); // Piece 5
  await page.waitForTimeout(3000);
  await hintBtn.click(); // Piece 6
  await page.waitForTimeout(3000);
  await hintBtn.click(); // Piece 7
  await page.waitForTimeout(3000);

  // [63.00s -> 72.00s]: When the final piece snaps in victory, players see their completion time, move count and daily streak.
  console.log('[63s -> 72s] Final piece snaps into position -> VICTORY!');
  await hintBtn.click(); // Piece 8 - Final snap!
  await page.waitForSelector('text=Puzzle Solved!', { timeout: 8000 });
  await page.waitForTimeout(2000);

  // Hover over stats telemetry card
  const timeStat = page.locator('.fixed span:has-text("Time")').first();
  if (await timeStat.isVisible()) await timeStat.hover();
  await page.waitForTimeout(3000);

  const streakStat = page.locator('.fixed span:has-text("Streak")').first();
  if (await streakStat.isVisible()) await streakStat.hover();
  await page.waitForTimeout(4000);

  // [72.00s -> 85.00s]: With one tap, they can copy a spoiler-free emoji grid directly into the Reddit comment section...
  console.log('[72s -> 85s] Clicking Share Score in Comments...');
  const shareBtn = page.locator('button:has-text("Share Score in Comments")');
  if (await shareBtn.isVisible()) {
    await shareBtn.hover();
    await page.waitForTimeout(2000);
    await shareBtn.click();
    await page.waitForTimeout(6000);
  }
  await page.waitForTimeout(5000);

  // [85.00s -> 93.00s]: Finished today's daily, the archive mode lets players solve any past date or celebrate their birthday.
  console.log('[85s -> 93s] Opening Archive / Date Picker modal...');
  const archiveBtn = page.locator('button:has-text("Play Another Date")');
  if (await archiveBtn.isVisible()) {
    await archiveBtn.click();
    await page.waitForTimeout(2500);

    // Select DEC
    const decBtn = page.locator('div:has-text("Select Month") ~ div button:has-text("DEC")').first();
    if (await decBtn.isVisible()) {
      await decBtn.click();
      await page.waitForTimeout(1500);
    }

    // Select 25
    const day25Btn = page.locator('div:has-text("Select Day") ~ div button:text-is("25")').first();
    if (await day25Btn.isVisible()) {
      await day25Btn.click();
      await page.waitForTimeout(2000);
    }

    // Click Load Puzzle
    const loadBtn = page.locator('button:has-text("Load Puzzle for")').first();
    if (await loadBtn.isVisible()) {
      await loadBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  // [93.00s -> 104.00s]: CalenDit brings the satisfying feel of a physical desk puzzle into a sticky, daily Reddit ritual. Thanks for watching.
  console.log('[93s -> 104s] Outro: Showing new loaded puzzle board & tray...');
  await page.mouse.move(640, 400);
  await page.waitForTimeout(11000);

  console.log('Finalizing video recording at ~104s...');
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    console.log('Raw video saved to:', rawVideoPath);

    const mp4Path = path.join(recordingsDir, 'calendit_demo.mp4');

    if (fs.existsSync(voiceWavPath)) {
      console.log('Merging user voiceover (calen-dit-voice.wav) with video via ffmpeg...');
      try {
        execSync(
          `ffmpeg -y -i "${rawVideoPath}" -i "${voiceWavPath}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k "${mp4Path}"`,
          { stdio: 'inherit' }
        );
        console.log('Master synchronized demo video created at:', mp4Path);
      } catch (err) {
        console.error('ffmpeg voiceover merge error:', err);
      }
    }

    try {
      if (fs.existsSync(rawVideoPath)) fs.unlinkSync(rawVideoPath);
    } catch {}
  }

  console.log('Record and sync completed successfully!');
}

run().catch((err) => {
  console.error('Error during recording:', err);
  process.exit(1);
});
