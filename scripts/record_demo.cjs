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

  console.log('Target duration from voiceover: 103.3 seconds');
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

  // [0:00 - 0:05] Intro: Show the clean board with today's date
  await page.waitForTimeout(4000);

  // [0:05 - 0:14] Open and showcase "How to Play" tutorial modal
  console.log('Opening How to Play modal...');
  const howToPlayBtn = page.locator('button[title="How to Play"]');
  if (await howToPlayBtn.isVisible()) {
    await howToPlayBtn.click();
    await page.waitForTimeout(5000);
    const closeHowToPlay = page.locator('button:has-text("Got It, Let\'s Play!")');
    if (await closeHowToPlay.isVisible()) {
      await closeHowToPlay.click();
    }
  }
  await page.waitForTimeout(2000);

  // [0:14 - 0:28] Demonstrate Piece Selection & Orientation (Rotate & Flip)
  console.log('Demonstrating piece selection, rotation, and flipping...');
  const firstPiece = page.locator('button[title*="Select"]').first();
  await firstPiece.click();
  await page.waitForTimeout(1500);

  const rotateBtn = page.locator('button:has-text("Rotate")');
  await rotateBtn.click();
  await page.waitForTimeout(1200);
  await rotateBtn.click();
  await page.waitForTimeout(1200);

  const flipBtn = page.locator('button:has-text("Flip")');
  await flipBtn.click();
  await page.waitForTimeout(1500);
  await flipBtn.click();
  await page.waitForTimeout(1200);

  // Move mouse over board to show ghost preview
  await page.mouse.move(640, 350);
  await page.waitForTimeout(1500);

  // Deselect piece
  const deselectBtn = page.locator('button[title="Deselect"]');
  await deselectBtn.click();
  await page.waitForTimeout(1500);

  // [0:28 - 0:72] Step-by-step piece placements using solver hints (~5.5s per piece)
  console.log('Demonstrating gameplay and mathematical solver hints...');
  const hintBtn = page.locator('button[title*="hint"]');

  for (let i = 1; i <= 8; i++) {
    console.log(`Placing piece ${i}/8 into position...`);
    await hintBtn.click();
    // Stagger placements evenly across the voiceover explanation
    await page.waitForTimeout(4800);
  }

  // [0:72 - 0:88] Victory explosion & Reddit comment card
  console.log('Victory modal and confetti...');
  await page.waitForSelector('text=Puzzle Solved!', { timeout: 6000 });
  await page.waitForTimeout(4000);

  console.log('Clicking Share Score in Comments...');
  const shareBtn = page.locator('button:has-text("Share Score in Comments")');
  if (await shareBtn.isVisible()) {
    await shareBtn.click();
    await page.waitForTimeout(4000);
  }

  // [0:88 - 1:03] Demonstrate Archive / Date Picker mode
  console.log('Opening Archive / Date Picker modal...');
  const archiveBtn = page.locator('button:has-text("Play Another Date")');
  await archiveBtn.click();
  await page.waitForTimeout(3000);

  // Select DEC inside the archive modal
  const decBtn = page.locator('div:has-text("Select Month") ~ div button:has-text("DEC")').first();
  if (await decBtn.isVisible()) {
    await decBtn.click();
    await page.waitForTimeout(1500);
  }

  // Select 25 inside the archive modal
  const day25Btn = page.locator('div:has-text("Select Day") ~ div button:text-is("25")').first();
  if (await day25Btn.isVisible()) {
    await day25Btn.click();
    await page.waitForTimeout(2000);
  }

  // Load puzzle
  const loadBtn = page.locator('button:has-text("Load Puzzle for")').first();
  if (await loadBtn.isVisible()) {
    await loadBtn.click();
    await page.waitForTimeout(4000);
  }

  console.log('Finalizing recording...');
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
    } else {
      execSync(`ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -pix_fmt yuv420p -r 30 "${mp4Path}"`, {
        stdio: 'inherit',
      });
    }

    // Clean up temporary webm file
    try {
      if (fs.existsSync(rawVideoPath)) fs.unlinkSync(rawVideoPath);
    } catch {}
  }

  console.log('Done!');
}

run().catch((err) => {
  console.error('Recording run error:', err);
  process.exit(1);
});
