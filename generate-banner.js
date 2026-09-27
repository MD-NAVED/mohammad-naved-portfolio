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

  // Set viewport to EXACT LinkedIn standard dimensions (1584 x 396) at 1x pixel mapping
  // This prevents LinkedIn's backend from resizing/downsampling the image upon upload
  await page.setViewport({
    width: 1584,
    height: 396,
    deviceScaleFactor: 1
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

  // Wait for Google Fonts to render
  await new Promise(r => setTimeout(r, 3000));

  // Hide toolbar & avatar guide before screenshot
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
  const pngPath = path.join(__dirname, 'public', 'Mohammad_Naved_LinkedIn_Banner.png');
  const jpgPath = path.join(__dirname, 'public', 'Mohammad_Naved_LinkedIn_Banner.jpg');

  console.log('Exporting native 1584x396 PNG...');
  if (bannerElement) {
    await bannerElement.screenshot({
      path: pngPath,
      type: 'png'
    });

    console.log('Exporting ultra-sharp 1584x396 JPG (Quality 98)...');
    await bannerElement.screenshot({
      path: jpgPath,
      type: 'jpeg',
      quality: 98
    });
  }

  // Also export preview with avatar overlay for verification
  await page.evaluate(() => {
    const avatarMock = document.getElementById('avatar-mock');
    if (avatarMock) {
      avatarMock.style.display = 'flex';
      avatarMock.style.border = '4px solid #38bdf8';
      avatarMock.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.4)';
    }
  });

  const previewPath = path.join(__dirname, 'public', 'Mohammad_Naved_LinkedIn_Banner_PREVIEW.png');
  if (bannerElement) {
    await bannerElement.screenshot({
      path: previewPath,
      type: 'png'
    });
  }

  await browser.close();
  console.log('Generated PNG (1584x396):', pngPath);
  console.log('Generated JPG (1584x396, 98%):', jpgPath);
  console.log('Generated Preview with Guide:', previewPath);
})();
