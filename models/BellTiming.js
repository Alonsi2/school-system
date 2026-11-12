const mongoose = require('mongoose');

const bellTimingSchema = new mongoose.Schema({
  periodNumber: { type: Number, required: true }, // رقم الحصة (1, 2, 3...) أو 0 للاستراحة
  title: { type: String, required: true }, // اسم الحصة أو الاستراحة
  startTime: { type: String, required: true }, // وقت البداية بصيغة "08:00"
  endTime: { type: String, required: true }, // وقت النهاية بصيغة "08:45"
  type: { type: String, enum: ['lesson', 'break'], default: 'lesson' }
});

module.exports = mongoose.model('BellTiming', bellTimingSchema);
