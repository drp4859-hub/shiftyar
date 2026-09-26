const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="#0d9488"/>
  <rect x="220" y="90" width="72" height="332" rx="20" fill="#ffffff"/>
  <rect x="90" y="220" width="332" height="72" rx="20" fill="#ffffff"/>
  <circle cx="370" cy="370" r="85" fill="#115e59" stroke="#ffffff" stroke-width="12"/>
  <polyline points="370,330 370,370 405,370" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

app.get(['/icon.svg', '/icon-192.svg', '/icon-512.svg'], (req, res) => {
  res.type('image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(iconSvg);
});

app.get('/manifest.json', (req, res) => {
  res.type('application/manifest+json');
  res.json({
    name: 'شیفتیار',
    short_name: 'شیفتیار',
    description: 'دستیار هوشمند شیفت‌های بالینی',
    lang: 'fa',
    dir: 'rtl',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f0fdfa',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  });
});

app.get('/sw.js', (req, res) => {
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(`
    const CACHE_NAME = 'shiftyar-v1';
    const FILES_TO_CACHE = ['/', '/manifest.json', '/icon.svg'];

    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(FILES_TO_CACHE))
          .then(() => self.skipWaiting())
      );
    });

    self.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys()
          .then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
          ))
          .then(() => self.clients.claim())
      );
    });

    self.addEventListener('fetch', event => {
      if (event.request.method !== 'GET') return;

      event.respondWith(
        fetch(event.request)
          .then(response => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(event.request).then(response => response || caches.match('/')))
      );
    });
  `);
});

app.get('/', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>شیفتیار</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icon.svg">
  <meta name="theme-color" content="#0d9488">
  <meta name="apple-mobile-web-app-title" content="شیفتیار">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }

    body {
      min-height: 100vh;
      background: #f0fdfa;
      color: #1e293b;
      padding: 16px;
      display: flex;
      justify-content: center;
    }

    .container {
      width: 100%;
      max-width: 420px;
    }

    .header {
      text-align: center;
      margin: 20px 0;
    }

    .header h1 {
      color: #0f766e;
      font-size: 26px;
    }

    .header p {
      color: #64748b;
      font-size: 14px;
      margin-top: 4px;
    }

    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid #ccfbf1;
      box-shadow: 0 10px 25px rgba(13, 148, 136, 0.1);
    }

    .btn-install {
      display: none;
      width: 100%;
      background: #0f766e;
      color: #ffffff;
      padding: 14px;
      border: 0;
      border-radius: 12px;
      font-weight: bold;
      font-size: 15px;
      margin-bottom: 16px;
      cursor: pointer;
    }

    .field {
      margin-bottom: 14px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }

    input, select {
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 14px;
    }

    .btn-submit {
      width: 100%;
      background: #0d9488;
      color: #ffffff;
      padding: 14px;
      border: 0;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
    }

    #iosHelp {
      display: none;
      color: #334155;
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <main class="container">
    <button id="installApp" class="btn-install">نصب شیفتیار</button>
    <p id="iosHelp">برای نصب در آیفون، دکمهٔ Share مرورگر را بزن و سپس Add to Home Screen را انتخاب کن.</p>

    <header class="header">
      <h1>شیفتیار</h1>
      <p>دستیار هوشمند شیفت‌های بالینی</p>
    </header>

    <section class="card">
      <div class="field">
        <label for="doctor">نام پزشک / اینترن</label>
        <input id="doctor" type="text" placeholder="نام را وارد کن">
      </div>

      <div class="field">
        <label for="department">بخش کشیک</label>
        <input id="department" type="text" placeholder="اورژانس / اطفال / جراحی">
      </div>

      <div class="field">
        <label for="shift">شیفت</label>
        <select id="shift">
          <option>کشیک شب</option>
          <option>شیفت صبح</option>
          <option>شیفت عصر</option>
        </select>
      </div>

      <button class="btn-submit" onclick="alert('شیفت با موفقیت ثبت شد')">ثبت شیفت</button>
    </section>
  </main>

  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
          console.error('Service worker registration failed:', error);
        });
      });
    }

    let installPrompt;
    const installButton = document.getElementById('installApp');
    const iosHelp = document.getElementById('iosHelp');
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIos && !isStandalone) {
      iosHelp.style.display = 'block';
    }

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      installPrompt = event;
      installButton.style.display = 'block';
    });

    installButton.addEventListener('click', async () => {
      if (!installPrompt) return;

      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.style.display = 'none';
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('App running on port ' + PORT);
});
