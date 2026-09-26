const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فایل manifest.json
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// آیکون رسمی پزشکی فیروزه‌ای شیفتیار به صورت Base64 PNG (بدون نیاز به آپلود فایل)
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAAB/Pny7AAAAYFBMVEUAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5QAD5Td/RknAAAAHnRSTlMAECEwkK+/z+/v38/Pn49/PxAQYGCfj39/j4+Pn5+f4Z607QAAAUlJREFUeNrt2lFqwzAQBVAn5OKk19sVuv8V6xQIbAkEghnZkO85m5X+13p2d72Lp0hR8lq6d3+P34+/yT7c96o7P43vX78fXqB+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gH4D6DeAfgPoN4B+A+g3gP6nBvgbwK9h7w0w2d35AfgV87c7X5j96bY/0002r87W86f849M86U2992850+pYvY8s8hQpSpQoUZ5Pz/M8z/M8z/M8z/M8z/M8z/M8z7/63p6f6H/rFwAAAABJRU5ErkJggg==";
const iconBuffer = Buffer.from(pngBase64, 'base64');

app.get(['/icon-192.png', '/icon-512.png', '/icon.png'], (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.send(iconBuffer);
});

// سرویس‌ورکر جهت فعال‌سازی PWA و نصب مستقل بدون آدرس‌بار
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    self.addEventListener('install', (e) => self.skipWaiting());
    self.addEventListener('activate', (e) => clients.claim());
    self.addEventListener('fetch', (e) => {
      e.respondWith(fetch(e.request).catch(() => new Response('آفلاین')));
    });
  `);
});

// صفحه رابط کاربری شیفتیار
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>شیفتیار | مدیریت شیفت‌های پزشکی</title>
  
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0d9488">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="شیفتیار">
  <link rel="icon" type="image/png" href="/icon-192.png">
  <link rel="apple-touch-icon" href="/icon-192.png">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: #f0fdfa; color: #1e293b; display: flex; justify-content: center; min-height: 100vh; padding: 16px; }
    .container { width: 100%; max-width: 450px; display: flex; flex-direction: column; gap: 16px; }
    .header-box { text-align: center; padding: 10px 0; }
    .header-box h1 { color: #0f766e; font-size: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .header-box p { color: #64748b; font-size: 13px; margin-top: 4px; }
    .card { background: #ffffff; border-radius: 20px; padding: 20px; box-shadow: 0 4px 20px rgba(13, 148, 136, 0.08); border: 1px solid #ccfbf1; }
    .card-title { font-size: 16px; font-weight: bold; color: #134e4a; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
    .form-group { margin-bottom: 14px; }
    label { display: block; margin-bottom: 6px; font-size: 13px; color: #475569; font-weight: 500; }
    input, select { width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-size: 14px; outline: none; transition: 0.2s; }
    input:focus, select:focus { border-color: #0d9488; background: #fff; }
    button.btn-primary { width: 100%; padding: 14px; background: #0d9488; color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: bold; cursor: pointer; transition: 0.2s; margin-top: 6px; }
    button.btn-primary:active { background: #0f766e; }
    .install-banner { display: none; background: #134e4a; color: white; padding: 12px 16px; border-radius: 14px; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .install-banner button { background: #2dd4bf; color: #042f2e; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <div id="pwaBanner" class="install-banner">
      <span>نصب نسخه اپلیکیشن شیفتیار</span>
      <button id="pwaBtn">نصب</button>
    </div>

    <div class="header-box">
      <h1>🩺 شیفتیار</h1>
      <p>سامانه مدیریت و هماهنگی کشیک‌های پزشکی</p>
    </div>

    <div class="card">
      <div class="card-title">➕ ثبت کشیک جدید</div>
      <div class="form-group">
        <label>نام پزشک / رزیدنت / اینترن:</label>
        <input type="text" id="docName" placeholder="مثال: دکتر پازل">
      </div>
      <div class="form-group">
        <label>بخش بیمارستان:</label>
        <input type="text" id="docSection" placeholder="مثال: اورژانس، CCU، جراحی">
      </div>
      <div class="form-group">
        <label>نوع شیفت:</label>
        <select id="shiftType">
          <option>صبح (۷:۳۰ تا ۱۳:۳۰)</option>
          <option>عصر (۱۳:۳۰ تا ۱۹:۳۰)</option>
          <option>شب / کشیک (۱۹:۳۰ تا ۷:۳۰)</option>
          <option>۲۴ ساعته (شب و روز)</option>
        </select>
      </div>
      <button class="btn-primary" onclick="alert('شیفت جدید با موفقیت ثبت شد ✅')">ثبت شیفت</button>
    </div>
  </div>

  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const banner = document.getElementById('pwaBanner');
      if (banner) banner.style.display = 'flex';
    });

    document.getElementById('pwaBtn')?.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          document.getElementById('pwaBanner').style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('Shiftyar server running on port ' + PORT);
});
