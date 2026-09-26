const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// داده شیفت‌ها در حافظه موقت (یا اتصال دیتابیس)
let shifts = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرو کردن مستقیم manifest.json
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// آیکون برداری اختصاصی و فوق‌العاده باکیفیت پزشکی شیفتیار (صلیب + ساعت/تقویم شیفت)
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14b8a6"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Background with rounded squircle -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)"/>
  
  <!-- Outer Glow Ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
  
  <!-- Medical-90 v-60 h90 z" fill="#ffffff" rx="16"/>
  </g>
  
  <!-- Clock / Shift Badge (Bottom Right) -->
  <g transform="translate(305, 30-90 v-60 h90 z" fill="#ffffff" rx="16"/>
  </g>
  
  <!-- Clock / Shift Badge (Bottom Right) -->
  <g transform="translate(305, 305)" filter="url(#shadow)">
    <circle cx="55" cy="55" r="55" fill="#042f2e" stroke="#5eead4" stroke-width="6"/>
    <!-- Clock Hands -->
    <line x1="55" y1="55" x2="55" y2="25" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <line x1="55" y1="55" x2="75" y2="55" stroke="#5eead4" stroke-width="6" stroke-linecap="round"/>
    <circle cx="55" cy="55" r="4" fill="#ffffff"/>
  </g>
</svg>
`;

// مسیر تحویل آیکون برنامه
app.get('/icon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgIcon.trim());
});

// صفحه اصلی اپلیکیشن شیفتیار
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user--90 v-60 h90 z" fill="#ffffff" rx="16"/>
  </g>
  
  <!-- Clock / Shift Badge (Bottom Right) -->
  <g transform="translate(305, 305)" filter="url(#shadow)">
    <circle cx="55" cy="55" r="55" fill="#042f2e" stroke="#5eead4" stroke-width="6"/>
    <!-- Clock Hands -->
    <line x1="55" y1="55" x2="55" y2="25" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <line x1="55" y1="55" x2="75" y2="55" stroke="#5eead4" stroke-width="6" stroke-linecap="round"/>
    <circle cx="55" cy="55" r="4" fill="#ffffff"/>
  </g>
</svg>
`;

// مسیر تحویل آیکون برنامه
app.get('/icon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgIcon.trim());
});

// صفحه اصلی اپلیکیشن شیفتیار
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-px; border-bottom: 1px solid #3a506b; padding-bottom: 16px; }
    .header img { width: 50px; height: 50px; border-radius: 12px; }
    h1 { font-size: 20px; color: #6fffe9; }
    p.sub { font-size: 13px; color: #a5b4fc; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 6px; font-size: 13px; color: #cbd5e1; }
    input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #3a506b; background: #0b132b; color: #fff; font-size: 14px; }
    button { width: 100%; padding: 14px; background: #0d9488; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; margin-top: 10px; }
    button:active { transform: scale(0.98); background: #0f766e; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="/icon.svg" alt="لوگو شیفتیار">
      <div>
        <h1>سامانه شیفتیار 🩺</h1>
        <p class="sub">برنامه ثبت و مدیریت کشیک پزشکی</p>
      </div>
    </div>
    
    <div class="form-group">
      <label>نام پزشک / رزیدنت:</label>
      <input type="text" placeholder="مثلاً: دکتر پازل">
    </div>
    <div class="form-group">
      <label>بخش / بیمارستان:</label>
      <input type="text" placeholder="مثلاً: اورژانس / ICU">
    </div>
    <div class="form-group">
      <label>نوع شیفت:</label>
      <select>
        <option>صبح (M)</option>
        <option>عصر (E)</option>
        <option>شب / کشیک (N)</option>
        <option>۲۴ ساعته (24h)</option>
      </select>
    </div>
    <button onclick="alert('شیفت با موفقیت ثبت شد ✅')">ثبت شیفت جدید</button>
  </div>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log('Shiftyar is active on port ' + PORT);
});
