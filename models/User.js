const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true }, // الرقم التعريفي للدخول
  password: { type: String, required: true }, // مشفر باستخدام bcrypt
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin', 'principal'], 
    required: true 
  },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null }, // خاص بالطلاب
  subject: { type: String, default: null }, // خاص للمعلمين
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
