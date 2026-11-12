const mongoose = require('mongoose');

const newsAndCoverSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['news', 'substitution'], // خبر عام أو جدول إشغال يومي
    default: 'news' 
  },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('NewsAndCover', newsAndCoverSchema);
