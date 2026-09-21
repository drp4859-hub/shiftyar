const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>شیفت‌یار با موفقیت آنلاین شد! 🩺🚀</h1><p>سرویس بدون خطا در حال اجراست.</p>');
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
