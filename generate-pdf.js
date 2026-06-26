import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('Starting PDF generation...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to local dev server (make sure server is running on port 3000)
  const url = 'http://localhost:3000/resume.html';
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
  } catch (error) {
    console.error('Error navigating. Make sure npm run dev is running on port 3000!');
    await browser.close();
    process.exit(1);
  }

  // Wait for fonts to load
  await new Promise(r => setTimeout(r, 2000));

  const outputPath = path.join(__dirname, 'public', 'Mohammad_Naved_Resume.pdf');

  console.log('Generating A4 PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  await browser.close();
  console.log('PDF generated successfully:', outputPath);
})();
