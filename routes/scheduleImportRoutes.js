const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Class = require('../models/Class');

const upload = multer({ storage: multer.memoryStorage() });

// خريطة تحويل الأيام من العربية إلى صيغة قاعدة البيانات
const dayMap = {
  'الأحد': 'Sunday',
  'الإثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday'
};

router.post('/import-excel', upload.single('scheduleFile'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets['الجدول_الموحد_للاستيراد'];
    const rows = xlsx.utils.sheet_to_json(sheet, { range: 2 }); // يبدأ القراءة من صف العناوين (صف 3)

    const scheduleRecords = [];

    for (const row of rows) {
      if (!row['اليوم'] || !row['رقم الحصة'] || !row['الصف والشعبة'] || !row['اسم المعلم']) continue;

      // البحث عن المعلم والصف في قاعدة البيانات لربط الـ ObjectId
      const teacher = await User.findOne({ name: row['اسم المعلم'].trim(), role: 'teacher' });
      const [grade, section] = row['الصف والشعبة'].trim().split(' ');
      const classObj = await Class.findOne({ grade, section });

      if (teacher && classObj) {
        scheduleRecords.push({
          day: dayMap[row['اليوم'].trim()],
          periodNumber: Number(row['رقم الحصة']),
          classId: classObj._id,
          teacherId: teacher._id,
          subject: row['المادة الدراسية'] || teacher.subject
        });
      }
    }

    // مسح الجدول القديم واستبداله بالجديد (أو تحديثه)
    await Schedule.deleteMany({});
    await Schedule.insertMany(scheduleRecords);

    res.status(200).json({ 
      message: `تم استيراد ${scheduleRecords.length} حصة دراسية وحفظها في MongoDB بنجاح.` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
