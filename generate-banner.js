import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('Starting LinkedIn Banner generation...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();

  // Set viewport to exact LinkedIn banner dimensions
  await page.setViewport({
    width: 1584,
    height: 396,
    deviceScaleFactor: 2 // 2x Retina resolution: 3168 x 792 px
  });

  const htmlPath = path.join(__dirname, 'public', 'linkedin-banner.html');
  const url = `file://${htmlPath}`;
  console.log(`Navigating to ${url}...`);

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  } catch (error) {
    console.error('Error navigating to file:', error);
    await browser.close();
    process.exit(1);
  }

  // Wait 3 seconds for Google Fonts & image to render
  await new Promise(r => setTimeout(r, 3000));

  // Hide the toolbar and the avatar mockup guide before taking the screenshot
  await page.evaluate(() => {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) toolbar.style.display = 'none';

    const avatarMock = document.getElementById('avatar-mock');
    if (avatarMock) avatarMock.style.display = 'none';

    document.body.style.padding = '0';
    document.body.style.minHeight = 'auto';

    const wrapper = document.querySelector('.banner-wrapper');
    if (wrapper) {
      wrapper.style.boxShadow = 'none';
      wrapper.style.borderRadius = '0';
      wrapper.style.zoom = '1';
    }
  });

  const bannerElement = await page.$('#banner-canvas-source');
  const outputPath = path.join(__dirname, 'public', 'Mohammad_Naved_LinkedIn_Banner.png');

  console.log('Taking high-res 1584x396 (2x) clean screenshot...');
  if (bannerElement) {
    await bannerElement.screenshot({
      path: outputPath,
      type: 'png'
    });
  }

  // Now take preview screenshot with avatar guide visible
  console.log('Taking preview screenshot with LinkedIn avatar overlay...');
  await page.evaluate(() => {
    const avatarMock = document.getElementById('avatar-mock');
    if (avatarMock) {
      avatarMock.style.display = 'flex';
      avatarMock.style.border = '4px solid #38bdf8';
      avatarMock.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.4)';
    }
  });

  const previewOutputPath = path.join(__dirname, 'public', 'Mohammad_Naved_LinkedIn_Banner_PREVIEW.png');
  if (bannerElement) {
    await bannerElement.screenshot({
      path: previewOutputPath,
      type: 'png'
    });
  }

  await browser.close();
  console.log('LinkedIn clean banner generated:', outputPath);
  console.log('LinkedIn preview with avatar guide generated:', previewOutputPath);
})();
