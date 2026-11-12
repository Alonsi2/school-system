const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Resources = require('../models/Resource'); // نموذج الدوسيات (سننشئه أدناه)

// 1. المعلم: إنشاء امتحان إلكتروني جديد
router.post('/create-exam', async (req, res) => {
  try {
    const { title, teacherId, classId, durationMinutes, questions } = req.body;

    const newExam = new Exam({
      title,
      teacherId,
      classId,
      durationMinutes,
      questions
    });

    await newExam.save();
    res.status(201).json({ message: 'تم إنشاء الامتحان الإلكتروني بنجاح', examId: newExam._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. الطالب: تقديم الامتحان وتصحيحه تلقائياً ورصد العلامة
router.post('/submit-exam', async (req, res) => {
  try {
    const { examId, studentId, studentAnswers } = req.body; // studentAnswers مصفوفة بإجابات الطالب

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'الامتحان غير موجود' });
    }

    let score = 0;
    let totalMarks = 0;

    // التصحيح التلقائي بمقارنة إجابات الطالب بالأسئلة والإجابات الصحيحة
    exam.questions.forEach((q, index) => {
      totalMarks += (q.marks || 1);
      if (studentAnswers[index] && studentAnswers[index] === q.correctAnswer) {
        score += (q.marks || 1);
      }
    });

    // حفظ النتيجة في نموذج العلامات
    const gradeRecord = new Grade({
      examId,
      studentId,
      score,
      totalMarks
    });

    await gradeRecord.save();

    res.status(200).json({
      message: 'تم تسليم الامتحان بنجاح وتصحيحه تلقائياً',
      score,
      totalMarks,
      percentage: ((score / totalMarks) * 100).toFixed(2) + '%'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. الطالب: استعراض علاماته في الامتحانات السابقة
router.get('/student-grades/:studentId', async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId }).populate({
      path: 'examId',
      select: 'title classId'
    });
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
