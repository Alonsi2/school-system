const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  grade: { type: String, required: true }, // الصف (مثل: الأول، الثامن)
  section: { type: String, required: true }, // الشعبة (مثل: أ، ب)
  academicYear: { type: String, required: true } // العام الدراسي
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
