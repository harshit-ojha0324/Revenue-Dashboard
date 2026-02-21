const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function waitForServer(url, retries = 30, delay = 1000) {
  const fetch = require('node-fetch');
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok || res.status === 200 || res.status === 302) return true;
    } catch (e) {
      /* ignore */
    }
    await new Promise(r => setTimeout(r, delay));
  }
  return false;
}

(async () => {
  const screenshotsDir = path.resolve(__dirname, '..', 'docs', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  // Try to load token/user from /tmp/login.json created during integration tests
  let token = '';
  let user = null;
  const loginJsonPath = '/tmp/login.json';
  if (fs.existsSync(loginJsonPath)) {
    try {
      const j = JSON.parse(fs.readFileSync(loginJsonPath, 'utf8'));
      token = j.token || '';
      user = j.user || null;
    } catch (e) {
      // ignore
    }
  }

  const base = 'http://localhost:3000';
  console.log('Waiting for frontend at', base);
  const ready = await waitForServer(base);
  if (!ready) {
    console.error('Frontend not available at', base);
    process.exit(2);
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    // Login page (public)
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(`${base}/login`, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, 'login.png'), fullPage: true });
    console.log('Saved login.png');

    // Dashboard (authenticated) - set localStorage token and user if available
    if (token && user) {
      const dashPage = await browser.newPage();
      await dashPage.setViewport({ width: 1400, height: 900 });
      // Navigate to the app origin first so localStorage is available for that origin
      await dashPage.goto(base, { waitUntil: 'networkidle2' });
      // set localStorage for the app's origin
      await dashPage.evaluate((t, u) => {
        try {
          localStorage.setItem('token', t);
          localStorage.setItem('user', JSON.stringify(u));
        } catch (e) {
          // ignore
        }
      }, token, user);
      // reload so React reads the token from localStorage
      await dashPage.reload({ waitUntil: 'networkidle2' });
      await dashPage.goto(`${base}/dashboard`, { waitUntil: 'networkidle2' });
      // give React a bit more time to render
      await new Promise((r) => setTimeout(r, 1200));
      await dashPage.screenshot({ path: path.join(screenshotsDir, 'dashboard.png'), fullPage: true });
      console.log('Saved dashboard.png');

      // Charts / table view - if different route, capture same dashboard area
      await dashPage.screenshot({ path: path.join(screenshotsDir, 'charts.png'), fullPage: true });
      console.log('Saved charts.png');
      await dashPage.close();
    } else {
      console.warn('No token/user available; dashboard screenshots skipped. You can run integration tests to generate /tmp/login.json or provide credentials.');
    }

    await page.close();
  } finally {
    await browser.close();
  }

  // Update README to reference PNGs instead of SVGs
  const readmePath = path.resolve(__dirname, '..', 'README.md');
  if (fs.existsSync(readmePath)) {
    let content = fs.readFileSync(readmePath, 'utf8');
    content = content.replace(/docs\/screenshots\/login\.svg/g, 'docs/screenshots/login.png');
    content = content.replace(/docs\/screenshots\/dashboard\.svg/g, 'docs/screenshots/dashboard.png');
    content = content.replace(/docs\/screenshots\/charts\.svg/g, 'docs/screenshots/charts.png');
    fs.writeFileSync(readmePath, content, 'utf8');
    console.log('Updated README to reference PNG screenshots');
  }

  console.log('Done');
})();
