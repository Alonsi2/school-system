import React, { useState, useEffect } from 'react';

export default function StudentExamAndGrades({ examData }) {
  // افتراض تمرير بيانات الامتحان المختار أو جلبها من الـ API
  const [exam, setExam] = useState(examData || null);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(examData ? examData.durationMinutes * 60 : 1800);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [gradesHistory, setGradesHistory] = useState([]);

  const studentId = localStorage.getItem('userId');

  // جلب سجل علامات الطالب السابقة عند تحميل الصفحة
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exams/student-grades/${studentId}`);
        const data = await res.json();
        if (res.ok) setGradesHistory(data);
      } catch (err) {
        console.error('خطأ في جلب العلامات:', err);
      }
    };
    if (studentId) fetchGrades();
  }, [studentId, isSubmitted]);

  // المؤقت التنازلي والتسليم التلقائي عند انتهاء الوقت
  useEffect(() => {
    if (!exam || isSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam, isSubmitted]);

  // تنسيق الوقت المتبقي (دقائق : ثواني)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // تسجيل اختيار الطالب لكل سؤال
  const handleSelectOption = (qIndex, option) => {
    const updated = [...studentAnswers];
    updated[qIndex] = option;
    setStudentAnswers(updated);
  };

  // إرسال الإجابات للتصحيح التلقائي
  const handleSubmitExam = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    setIsSubmitted(true);
    try {
      const response = await fetch('http://localhost:5000/api/exams/submit-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          studentId,
          studentAnswers
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'فشل تسليم الامتحان');

      setResult(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* قسم تقديم الامتحان (يظهر إذا كان هناك امتحان نشط) */}
        {exam && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-blue-900">{exam.title}</h2>
              {!isSubmitted && (
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${timeLeft < 60 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-900'}`}>
                  ⏱️ الوقت المتبقي: {formatTime(timeLeft)}
                </div>
              )}
            </div>

            {isSubmitted && result ? (
              <div className="bg-green-50 border border-green-400 rounded-xl p-6 text-center space-y-2">
                <h3 className="text-xl font-bold text-green-800">{result.message}</h3>
                <p className="text-3xl font-extrabold text-blue-900 my-2">
                  العلامة: {result.score} / {result.totalMarks}
                </p>
                <p className="text-sm text-gray-600">النسبة المئوية: {result.percentage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitExam} className="space-y-6">
                {exam.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-bold text-gray-800 mb-3">
                      {qIndex + 1}. {q.questionText} <span className="text-xs text-gray-500">({q.marks || 1} علامة)</span>
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-3 space-x-reverse p-2 bg-white rounded border cursor-pointer hover:bg-blue-50">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={opt}
                            checked={studentAnswers[qIndex] === opt}
                            onChange={() => handleSelectOption(qIndex, opt)}
                            className="form-radio text-blue-900"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
                >
                  تسليم الإجابات وعرض النتيجة فوراً
                </button>
              </form>
            )}
          </div>
        )}

        {/* قسم سجل العلامات */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">سجل العلامات والنتائج السابقة</h2>
          
          {gradesHistory.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">لا توجد علامات مرصودة حتى الآن.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="p-3 rounded-tr-lg">اسم الامتحان</th>
                    <th className="p-3">العلامة المستحقة</th>
                    <th className="p-3">العلامة الكاملة</th>
                    <th className="p-3 rounded-tl-lg">تاريخ التقديم</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesHistory.map((g) => (
                    <tr key={g._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-800">{g.examId?.title || 'امتحان محذوف'}</td>
                      <td className="p-3 text-green-700 font-bold">{g.score}</td>
                      <td className="p-3 text-gray-600">{g.totalMarks}</td>
                      <td className="p-3 text-xs text-gray-500">
                        {new Date(g.createdAt).toLocaleDateString('ar-JO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
