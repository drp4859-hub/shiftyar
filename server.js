const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// حافظه موقت برای ذخیره شیفت‌ها (تا بعداً به دیتابیس وصلش کنیم)
let shifts = [
  { id: 1, doctor: "دکتر پازل", ward: "اورژانس", date: "۱۴۰۳/۰۷/۰۵", shiftType: "شب" },
  { id: 2, doctor: "دکتر رضایی", ward: "داخلی", date: "۱۴۰۳/۰۷/۰۶", shiftType: "صبح" }
];

// صفحه اصلی: رابط کاربری زیبا و ریسپانسیو
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>شیفت‌یار | مدیریت هوشمند کشیک‌ها</title>
      <style>
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Tahoma, sans-serif; }
        body { background: #f0f4f8; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 650px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 25px; }
        .header h1 { color: #0284c7; margin: 0; font-size: 26px; }
        .header p { color: #64748b; margin-top: 6px; font-size: 14px; }
        .card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 20px; }
        h2 { font-size: 18px; margin-top: 0; margin-bottom: 15px; color: #334155; }
        .form-group { margin-bottom: 12px; }
        label { display: block; font-size: 13px; font-weight: bold; margin-bottom: 6px; color: #475569; }
        input, select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none; }
        input:focus, select:focus { border-color: #0284c7; }
        button { width: 100%; background: #0284c7; color: white; border: none; padding: 12px; border-radius: 10px; font-size: 15px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        button:hover { background: #0369a1; }
        .shift-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .shift-item:last-child { border-bottom: none; }
        .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .empty { text-align: center; color: #94a3b8; font-size: 14px; padding: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🩺 شیفت‌یار</h1>
          <p>سامانه مدیریت و هماهنگی کشیک‌های پزشکی</p>
        </div>

        <!-- فرم ثبت شیفت جدید -->
        <div class="card">
          <h2>➕ ثبت کشیک جدید</h2>
          <div class="form-group">
            <label>نام پزشک / رزیدنت / اینترن:</label>
            <input type="text" id="doctor" placeholder="مثال: دکتر پازل" value="دکتر پازل">
          </div>
          <div class="form-group">
            <label>بخش بیمارستان:</label>
            <input type="text" id="ward" placeholder="مثال: اورژانس، CCU، جراحی">
          </div>
          <div class="form-group">
            <label>تاریخ کشیک:</label>
            <input type="text" id="date" placeholder="مثال: ۱۴۰۳/۰۷/۱۰">
          </div>
          <div class="form-group">
            <label>نوع شیفت:</label>
            <select id="shiftType">
              <option value="صبح">صبح (۷:۳۰ تا ۱۳:۳۰)</option>
              <option value="عصر">عصر (۱۳:۳۰ تا ۱۹:۳۰)</option>
              <option value="شب">شب (۱۹:۳۰ تا ۷:۳۰)</option>
              <option value="۲۴ ساعته">۲۴ ساعته</option>
            </select>
          </div>
          <button onclick="addShift()">ثبت شیفت</button>
        </div>

        <!-- لیست شیفت‌ها -->
        <div class="card">
          <h2>📋 لیست کشیک‌های فعال</h2>
          <div id="shiftsList">در حال بارگذاری...</div>
        </div>
      </div>

      <script>
        async function fetchShifts() {
          const res = await fetch('/api/shifts');
          const data = await res.json();
          const listDiv = document.getElementById('shiftsList');
          
          if (data.length === 0) {
            listDiv.innerHTML = '<div class="empty">هنوز هیچ شیفتی ثبت نشده است!</div>';
            return;
          }

          listDiv.innerHTML = data.map(s => \`
            <div class="shift-item">
              <div>
                <strong>\${s.doctor}</strong> <span style="color: #64748b;">(\${s.ward})</span>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">📅 \${s.date}</div>
              </div>
              <span class="badge">\${s.shiftType}</span>
            </div>
          \`).join('');
        }

        async function addShift() {
          const doctor = document.getElementById('doctor').value.trim();
          const ward = document.getElementById('ward').value.trim();
          const date = document.getElementById('date').value.trim();
          const shiftType = document.getElementById('shiftType').value;

          if (!doctor || !ward || !date) {
            alert('لطفاً همه فیلدها را پر کنید!');
            return;
          }

          await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctor, ward, date, shiftType })
          });

          document.getElementById('ward').value = '';
          document.getElementById('date').value = '';
          fetchShifts();
        }

        fetchShifts();
      </script>
    </body>
    </html>
  `);
});

// API دریافت شیفت‌ها
app.get('/api/shifts', (req, res) => {
  res.json(shifts);
});

// API ذخیره شیفت جدید
app.post('/api/shifts', (req, res) => {
  const { doctor, ward, date, shiftType } = req.body;
  const newShift = {
    id: Date.now(),
    doctor,
    ward,
    date,
    shiftType
  };
  shifts.push(newShift);
  res.status(201).json(newShift);
});

app.listen(port, () => {
  console.log('Shiftyar app running on port ' + port);
});
