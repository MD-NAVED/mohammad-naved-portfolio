import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('Starting high-res Resume image generation...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  // Set high-DPI viewport (2x scale factor for crisp Retina images)
  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 2
  });

  const htmlPath = path.join(__dirname, 'public', 'resume.html');
  const url = `file://${htmlPath}`;
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for rendering
  await new Promise(r => setTimeout(r, 2000));

  const pages = await page.$$('.page');
  console.log(`Found ${pages.length} resume pages.`);

  if (pages.length >= 1) {
    const page1PathPng = path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Page1.png');
    const page1PathJpg = path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Page1.jpg');
    console.log('Capturing Page 1...');
    await pages[0].screenshot({ path: page1PathPng, type: 'png' });
    await pages[0].screenshot({ path: page1PathJpg, type: 'jpeg', quality: 98 });
    console.log('Page 1 saved:', page1PathPng);
  }

  if (pages.length >= 2) {
    const page2PathPng = path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Page2.png');
    const page2PathJpg = path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Page2.jpg');
    console.log('Capturing Page 2...');
    await pages[1].screenshot({ path: page2PathPng, type: 'png' });
    await pages[1].screenshot({ path: page2PathJpg, type: 'jpeg', quality: 98 });
    console.log('Page 2 saved:', page2PathPng);
  }

  // Create a beautiful side-by-side presentation HTML for LinkedIn feeds
  console.log('Creating Side-by-Side Showcase Image...');
  const fs = await import('fs');
  const page1Base64 = fs.readFileSync(path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Page1.png')).toString('base64');
  const page2Base64 = fs.readFileSync(path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Page2.png')).toString('base64');

  const showcasePage = await browser.newPage();
  await showcasePage.setViewport({
    width: 2200,
    height: 1550,
    deviceScaleFactor: 1.5
  });

  const showcaseHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #020617;
        background-image: radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%);
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 50px 40px;
      }
      .badge {
        color: #38bdf8;
        font-family: monospace;
        font-size: 18px;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .badge span {
        width: 10px;
        height: 10px;
        background: #10b981;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 0 12px #10b981;
      }
      .showcase-container {
        display: flex;
        gap: 40px;
        align-items: center;
        justify-content: center;
        max-width: 2000px;
      }
      .resume-frame {
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.15);
        overflow: hidden;
        width: 880px;
      }
      .resume-frame img {
        width: 100%;
        display: block;
      }
      .footer-tag {
        margin-top: 32px;
        color: #94a3b8;
        font-size: 16px;
        font-family: monospace;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .footer-tag strong {
        color: #f1f5f9;
      }
    </style>
  </head>
  <body>
    <div class="badge"><span></span> Verified ATS-Optimized Resume (2 Pages) &bull; Mohammad Naved</div>
    <div class="showcase-container">
      <div class="resume-frame">
        <img src="data:image/png;base64,${page1Base64}" />
      </div>
      <div class="resume-frame">
        <img src="data:image/png;base64,${page2Base64}" />
      </div>
    </div>
    <div class="footer-tag">
      Full-Stack Systems &bull; AI Engineering &bull; Game Development (UE5) &bull; <strong>mohammad-naved-portfolio.vercel.app</strong>
    </div>
  </body>
  </html>
  `;

  await showcasePage.setContent(showcaseHtml, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const showcasePathPng = path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Showcase.png');
  const showcasePathJpg = path.join(__dirname, 'public', 'Mohammad_Naved_Resume_Showcase.jpg');
  await showcasePage.screenshot({ path: showcasePathPng, type: 'png' });
  await showcasePage.screenshot({ path: showcasePathJpg, type: 'jpeg', quality: 98 });
  console.log('Showcase image saved:', showcasePathPng);

  await browser.close();
  console.log('All Resume images generated successfully!');
})();
