const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرو فایل manifest
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// آیکون پزشکی اختصاصی شیفتیار
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#115e59"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#g)"/>
  <rect x="220" y="110" width="72" height="292" rx="20" fill="#ffffff"/>
  <rect x="110" y="220" width="292" height="72" rx="20" fill="#ffffff"/>
  <circle cx="370" cy="370" r="75" fill="#0f172a" stroke="#2dd4bf" stroke-width="10"/>
  <line x1="370" y1="370" x2="370" y2="330" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="370" y1="370" x2="400" y2="370" stroke="#2dd4bf" stroke-width="8" stroke-linecap="round"/>
</svg>`;

app.get('/icon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgIcon);
});

// سرویس ورکر برای تبدیل به PWA واقعی
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    self.addEventListener('install', e => self.skipWaiting());
    self.addEventListener('activate', e => clients.claim());
    self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => new Response('Offline'))));
  `);
});

// صفحه اصلی برنامه
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>شیفتیار</title>
  
  <!-- تنظیمات کلیدی PWA و نصب مستقل -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0d9488">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="شیفتیار">
  <link rel="icon" type="image/svg+xml" href="/icon.svg">
  <link rel="apple-touch-icon" href="/icon.svg">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px; }
    .card { background: #1e293b; width: 100%; max-width: 420px; border-radius: 20px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid #334155; }
    .header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 14px; }
    .header img { width: 52px; height: 52px; border-radius: 12px; }
    h1 { font-size: 20px; color: #2dd4bf; }
    p.sub { font-size: 13px; color: #94a3b8; }
    .form-group { margin-bottom: 14px; }
    label { display: block; margin-bottom: 6px; font-size: 13px; color: #cbd5e1; }
    input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #fff; font-size: 14px; }
    button { width: 100%; padding: 14px; background: #0d9488; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: bold; cursor: pointer; margin-top: 10px; }
    button:active { background: #0f766e; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="/icon.svg" alt="لوگو شیفتیار">
      <div>
        <h1>سامانه شیفتیار 🩺</h1>
        <p class="sub">برنامه ثبت و مدیریت شیفت پزشکی</p>
      </div>
    </div>
    
    <div class="form-group">
      <label>نام پزشک / رزیدنت:</label>
      <input type="text" placeholder="مثلاً: دکتر پازل">
    </div>
    <div class="form-group">
      <label>بخش / بیمارستان:</label>
      <input type="text" placeholder="مثلاً: اورژانس">
    </div>
    <div class="form-group">
      <label>نوع شیفت:</label>
      <select>
        <option>صبح (Morning)</option>
        <option>عصر (Evening)</option>
        <option>شب / کشیک (Night)</option>
        <option>۲۴ ساعته</option>
      </select>
    </div>
    <button onclick="alert('شیفت ثبت شد ✅')">ثبت شیفت</button>
  </div>

  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('Shiftyar running on port ' + PORT);
});
