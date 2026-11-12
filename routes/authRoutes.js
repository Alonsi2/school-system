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
