const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// تحميل المتغيرات من ملف .env
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middleware لقراءة بيانات JSON
app.use(express.json());

// مسارات التجربة الأساسية
app.get('/', (req, res) => {
  res.send('School Management System API is running...');
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
const substitutionRoutes = require('./routes/substitutionRoutes');
app.use('/api/substitution', substitutionRoutes);
const examRoutes = require('./routes/examRoutes');
app.use('/api/exams', examRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);
