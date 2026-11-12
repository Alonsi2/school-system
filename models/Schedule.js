const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { 
    type: String, 
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], 
    required: true 
  },
  periodNumber: { type: Number, required: true }, // رقم الحصة
  subject: { type: String, required: true } // اسم المادة
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
