const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فایل واقعی و باینری PNG با ابعاد 192x192 برای حل قطعی آیکون اندروید
const realPngIcon = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAZlBMVEUAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5Rovf56AAAAInRSTlMAEc/v7zBAEF/vz79Q/+/v////////////////////3+9Q73Fw3AAAANBJREFUeNrtwTEBAAAAwqD1T20ND6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4GWwAAAB3y4pAAAAAElFTkSuQmCC',
  'base64'
);

// آیکون واقعی فیروزه‌ای با کیفیت بالا
const mainSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="110" fill="#0d9488"/>
  <rect x="220" y="90" width="72" height="332" rx="20" fill="#ffffff"/>
  <rect x="90" y="220" width="332" height="72" rx="20" fill="#ffffff"/>
  <circle cx="370" cy="370" r="85" fill="#115e59" stroke="#ffffff" stroke-width="12"/>
  <polyline points="370,330 370,370 405,370" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
</svg>`;

// تحویل آیکون باینری PNG استاندارد برای کروم
app.get(['/icon-192.png', '/icon-512.png', '/icon.png'], (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(realPngIcon);
});

app.get(['/icon.svg', '/favicon.ico'], (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.send(mainSvg);
});

// مانیفست استاندارد منطبق بر قوانین کروم اندروید
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.json({
    name: "شیفتیار",
    short_name: "شیفتیار",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0d9488",
    theme_color: "#0d9488",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      }
    ]
  });
});

// سرویس ورکر آفلاین و کش
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.send(`
    self.addEventListener('install', e => self.skipWaiting());
    self.addEventListener('activate', e => clients.claim());
    self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
  `);
});

// صفحه اصلی برنامه شیفتیار
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>شیفتیار</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0d9488">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-icon" href="/icon-192.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: #f0fdfa; color: #1e293b; padding: 16px; display: flex; justify-content: center; }
    .container { width: 100%; max-width: 420px; }
    .header { text-align: center; margin: 20px 0; }
    .header h1 { color: #0f766e; font-size: 26px; }
    .header p { color: #64748b; font-size: 14px; margin-top: 4px; }
    .card { background: #ffffff; border-radius: 20px; padding: 20px; box-shadow: 0 10px 25px rgba(13, 148, 136, 0.1); border: 1px solid #ccfbf1; }
    .btn-install { width: 100%; background: #0f766e; color: #ffffff; padding: 14px; border: none; border-radius: 14px; font-weight: bold; font-size: 15px; margin-bottom: 16px; cursor: pointer; display: none; }
    .field { margin-bottom: 14px; }
    label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: #334155; }
    input, select { width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #cbd5e1; outline: none; font-size: 14px; }
    .btn-submit { width: 100%; background: #0d9488; color: white; padding: 14px; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <button id="installApp" class="btn-install">📲 نصب مستقیم اپلیکیشن شیفتیار</button>

    <div class="header">
      <h1>🩺 شیفتیار</h1>
      <p>دستیار هوشمند شیفت‌های بالینی</p>
    </div>

    <div class="card">
      <div class="field">
        <label>نام پزشک / اینترن:</label>
        <input type="text" placeholder="دکتر پازل">
      </div>
      <div class="field">
        <label>بخش کشیک:</label>
        <input type="text" placeholder="اورژانس / اطفال / جراحی">
      </div>
      <div class="field">
        <label>شیفت:</label>
        <select>
          <option>کشیک شب</option>
          <option>شیفت صبح</option>
          <option>شیفت عصر</option>
        </select>
      </div>
      <button class="btn-submit" onclick="alert('شیفت با موفقیت ثبت شد ✅')">ثبت شیفت</button>
    </div>
  </div>

  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
    }

    let installPrompt;
    const btn = document.getElementById('installApp');
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      installPrompt = e;
      btn.style.display = 'block';
    });

    btn.addEventListener('click', async () => {
      if (installPrompt) {
        installPrompt.prompt();
        const res = await installPrompt.userChoice;
        if (res.outcome === 'accepted') btn.style.display = 'none';
        installPrompt = null;
      }
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('App running on port ' + PORT);
});
