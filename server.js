const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// برای خواندن اطلاعات فرم‌های ارسال شده
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// حافظه موقت برای ذخیره شیفت‌ها (تا قبل از اتصال کامل به دیتابیس)
let shifts = [];

// صفحه اصلی: شامل فرم ثبت شیفت و جدول شیفت‌های فعال
app.get('/', (req, res) => {
  const shiftsRows = shifts.length === 0
    ? `<tr><td colspan="6" style="text-align:center; padding:15px; color:#888;">هنوز هیچ شیفتی ثبت نشده است.</td></tr>`
    : shifts.map((s, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td><span class="badge role">${s.role}</span></td>
          <td>${s.department}</td>
          <td><span class="badge shift">${s.shiftType}</span></td>
          <td>${s.date}</td>
        </tr>
      `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>شیفت‌یار | سامانه جامع کادر درمان</title>
      <style>
        body { font-family: Tahoma, 'Vazir', sans-serif; background: #f0f4f8; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 900px; margin: auto; background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; }
        header h1 { color: #1e3a8a; margin: 0; font-size: 24px; }
        header p { color: #64748b; margin-top: 5px; font-size: 14px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .form-group { display: flex; flex-direction: column; }
        label { margin-bottom: 6px; font-weight: bold; font-size: 13px; color: #475569; }
        input, select { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-family: inherit; }
        button { background: #0284c7; color: #fff; border: none; padding: 12px 20px; font-size: 15px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px; width: 100%; }
        button:hover { background: #0369a1; }
        table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: right; font-size: 13px; }
        th { background: #f8fafc; color: #334155; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge.role { background: #e0f2fe; color: #0369a1; }
        .badge.shift { background: #fef3c7; color: #b45309; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🏥 سامانه هوشمند «شیفت‌یار»</h1>
          <p>مدیریت جامع کشیک و شیفت‌های کادر درمان</p>
        </header>

        <form action="/add-shift" method="POST">
          <div class="form-grid">
            <div class="form-group">
              <label>نام و نام خانوادگی:</label>
              <input type="text" name="name" required placeholder="مثال: دکتر پازل">
            </div>

            <div class="form-group">
              <label>نقش / رده شغلی:</label>
              <select name="role" required>
                <option value="پزشک">پزشک (متخصص / رزیدنت / عمومی)</option>
                <option value="پرستار">پرستار</option>
                <option value="سرپرستار / سوپروایزر">سرپرستار / سوپروایزر</option>
                <option value="ماما">ماما</option>
                <option value="تکنسین اتاق عمل / بیهوشی">تکنسین اتاق عمل / بیهوشی</option>
                <option value="فوریت‌های پزشکی (۱۱۵)">فوریت‌های پزشکی (۱۱۵)</option>
                <option value="بهیار / کمک‌پرستار">بهیار / کمک‌پرستار</option>
                <option value="کادر اداری / پذیرش">کادر اداری / پذیرش</option>
              </select>
            </div>

            <div class="form-group">
              <label>بخش درمانی:</label>
              <select name="department" required>
                <option value="اورژانس">اورژانس</option>
                <option value="اتاق عمل و ریکاوری">اتاق عمل و ریکاوری</option>
                <option value="مراقبت‌های ویژه (ICU / CCU)">مراقبت‌های ویژه (ICU / CCU)</option>
                <option value="بخش بستری (داخلی / جراحی / اطفال)">بخش بستری (داخلی / جراحی / اطفال)</option>
                <option value="بلوک زایمان (زایشگاه)">بلوک زایمان (زایشگاه)</option>
                <option value="پایگاه ۱۱۵ / پیش‌بیمارستانی">پایگاه ۱۱۵ / پیش‌بیمارستانی</option>
                <option value="درمانگاه و پذیرش">درمانگاه و پذیرش</option>
              </select>
            </div>

            <div class="form-group">
              <label>نوع شیفت:</label>
              <select name="shiftType" required>
                <option value="صبح (۰۸:۰۰ الی ۱۴:۰۰)">صبح (۰۸:۰۰ الی ۱۴:۰۰)</option>
                <option value="عصر (۱۴:۰۰ الی ۲۰:۰۰)">عصر (۱۴:۰۰ الی ۲۰:۰۰)</option>
                <option value="شب (۲۰:۰۰ الی ۰۸:۰۰)">شب (۲۰:۰۰ الی ۰۸:۰۰)</option>
                <option value="لانگ / ۲۴ ساعته">لانگ / ۲۴ ساعته</option>
                <option value="آنکال (آماده‌باش)">آنکال (آماده‌باش)</option>
              </select>
            </div>

            <div class="form-group">
              <label>تاریخ شیفت:</label>
              <input type="text" name="date" required placeholder="مثال: ۱۴۰۳/۰۷/۰۱">
            </div>
          </div>

          <button type="submit">➕ ثبت این شیفت در سامانه</button>
        </form>

        <h3 style="margin-top: 35px; color: #1e3a8a;">📋 لیست شیفت‌های فعال کادر درمان</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>نام</th>
              <th>سمت</th>
              <th>بخش</th>
              <th>شیفت</th>
              <th>تاریخ</th>
            </tr>
          </thead>
          <tbody>
            ${shiftsRows}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `);
});

// مسیر دریافت فرم و ثبت شیفت
app.post('/add-shift', (req, res) => {
  const { name, role, department, shiftType, date } = req.body;
  if (name && role && department && shiftType && date) {
    shifts.unshift({ name, role, department, shiftType, date }); // اضافه کردن به ابتدای لیست
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
