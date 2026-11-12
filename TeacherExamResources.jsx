import React, { useState } from 'react';

export default function TeacherExamResources() {
  // حالات إنشاء الامتحان
  const [examTitle, setExamTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
  ]);
  const [examMessage, setExamMessage] = useState('');

  const teacherId = localStorage.getItem('userId'); // معرف المعلم المسجل حالياً

  // إضافة سؤال جديد في نموذج الامتحان
  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);
  };

  // تحديث حقول السؤال المحدد
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // تحديث خيارات السؤال
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // إرسال الامتحان وحفظه في القاعدة
  const handleCreateExam = async (e) => {
    e.preventDefault();
    setExamMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/exams/create-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examTitle,
          teacherId,
          classId,
          durationMinutes: Number(durationMinutes),
          questions
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل إنشاء الامتحان');

      setExamMessage(data.message);
      setExamTitle('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* نموذج إنشاء امتحان إلكتروني */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">إنشاء امتحان إلكتروني جديد</h2>

          {examMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {examMessage}
            </div>
          )}

          <form onSubmit={handleCreateExam} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">عنوان الامتحان</label>
                <input 
                  type="text" 
                  value={examTitle} 
                  onChange={(e) => setExamTitle(e.target.value)} 
                  required
                  placeholder="مثال: امتحان الشهر الأول رياضيات"
                  className="w-full px-3 py-2 border rounded-lg text-right"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">معرف الصف (Class ID)</label>
                <input 
                  type="text" 
                  value={classId} 
                  onChange={(e) => setClassId(e.target.value)} 
                  required
                  placeholder="معرف الصف من القاعدة"
                  className="w-full px-3 py-2 border rounded-lg text-right"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">المدة (بالدقائق)</label>
                <input 
                  type="number" 
                  value={durationMinutes} 
                  onChange={(e) => setDurationMinutes(e.target.value)} 
                  required
                  className="w-full px-3 py-2 border rounded-lg text-right"
                />
              </div>
            </div>

            {/* الأسئلة */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-gray-800 mb-3">الأسئلة والخيارات:</h3>
              
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">السؤال {qIndex + 1}</label>
                    <input 
                      type="text" 
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      required
                      placeholder="نص السؤال..."
                      className="w-full px-3 py-2 border rounded text-right bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => (
                      <input 
                        key={optIndex}
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        required
                        placeholder={`الخيار ${optIndex + 1}`}
                        className="px-3 py-1 border rounded text-right bg-white text-sm"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">الإجابة الصحيحة (نسخ نص الخيار تماماً)</label>
                      <input 
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                        required
                        placeholder="الإجابة الصحيحة"
                        className="w-full px-3 py-1 border rounded text-right bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">الدرجة</label>
                      <input 
                        type="number"
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(qIndex, 'marks', Number(e.target.value))}
                        required
                        className="w-full px-3 py-1 border rounded text-right bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddQuestion}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300 transition"
              >
                + إضافة سؤال جديد
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition mt-6"
            >
              حفظ ونشر الامتحان الإلكتروني
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
