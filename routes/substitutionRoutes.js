const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const NewsAndCover = require('../models/NewsAndCover');

// 1. البحث عن المعلمين المتاحين للتعويض (الإشغال) في حصة معينة
router.get('/available-teachers', async (req, res) => {
  try {
    const { day, periodNumber } = req.query;

    if (!day || !periodNumber) {
      return res.status(400).json({ message: 'الرجاء تحديد اليوم ورقم الحصة' });
    }

    // جلب كل المعلمين في النظام
    const allTeachers = await User.find({ role: 'teacher' });

    // جلب المعلمين المشغولين في هذا اليوم ورقم الحصة
    const busySchedules = await Schedule.find({ day, periodNumber: Number(periodNumber) });
    const busyTeacherIds = busySchedules.map(s => s.teacherId.toString());

    // تصفية المعلمين لإيجاد المتاحين (الذين ليس لديهم حصة في هذا الوقت)
    const availableTeachers = allTeachers.filter(teacher => !busyTeacherIds.includes(teacher._id.toString()));

    res.status(200).json({
      day,
      periodNumber: Number(periodNumber),
      availableCount: availableTeachers.length,
      teachers: availableTeachers.map(t => ({ id: t._id, name: t.name, subject: t.subject }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. إنشاء ونشر جدول الإشغال أو الأخبار ليظهر في قسم "آخر الأخبار"
router.post('/publish-news', async (req, res) => {
  try {
    const { title, content, type, authorId } = req.body;

    const newItem = new NewsAndCover({
      title,
      content,
      type: type || 'news',
      authorId
    });

    await newItem.save();
    res.status(201).json({ message: 'تم نشر الخبر/الإشغال بنجاح في قسم آخر الأخبار', data: newItem });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. جلب آخر الأخبار وجداول الإشغال لتعرض للجميع (للطلاب، المعلمين، الإدارة)
router.get('/news-feed', async (req, res) => {
  try {
    const news = await NewsAndCover.find().sort({ createdAt: -1 }).populate('authorId', 'name role');
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
