const bcrypt = require('bcrypt');

// تغيير وتحديث كلمة المرور
router.put('/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // التحقق من صحة كلمة المرور القديمة
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'كلمة المرور القديمة غير صحيحة' });
    }

    // تشفير كلمة المرور الجديدة وحفظها
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const bcrypt = require('bcrypt');
const User = require('../models/User');

// مسار لإنشاء حسابات تجريبية افتراضية (Admin, Principal, Teacher, Student)
router.post('/seed-users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('123456', salt);

    const demoUsers = [
      {
        name: 'أحمد الإداري',
        nationalId: '1001',
        password: defaultPassword,
        role: 'admin'
      },
      {
        name: 'أ. محمود المدير',
        nationalId: '2001',
        password: defaultPassword,
        role: 'principal'
      },
      {
        name: 'أ. سامر المعلم',
        nationalId: '3001',
        password: defaultPassword,
        role: 'teacher',
        subject: 'الرياضيات'
      },
      {
        name: 'عمر الطالب',
        nationalId: '4001',
        password: defaultPassword,
        role: 'student'
      }
    ];

    for (const u of demoUsers) {
      await User.findOneAndUpdate(
        { nationalId: u.nationalId },
        u,
        { upsert: true, new: true }
      );
    }

    res.status(201).json({
      message: 'تم إنشاء الحسابات التجريبية بنجاح!',
      accounts: [
        { role: 'إداري (Admin)', nationalId: '1001', password: '123456' },
        { role: 'مدير (Principal)', nationalId: '2001', password: '123456' },
        { role: 'معلم (Teacher)', nationalId: '3001', password: '123456' },
        { role: 'طالب (Student)', nationalId: '4001', password: '123456' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
