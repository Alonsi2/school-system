import React, { useState, useEffect } from 'react';

export default function PrincipalSubstitution() {
  const [day, setDay] = useState('الأحد');
  const [periodNumber, setPeriodNumber] = useState(1);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // حقول نشر الأخبار أو جدول الإشغال
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newsMessage, setNewsMessage] = useState('');

  const authorId = localStorage.getItem('userId'); // معرف المدير المسجل حالياً

  // البحث عن المعلمين المتاحين
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/substitution/available-teachers?day=${day}&periodNumber=${periodNumber}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'حدث خطأ أثناء البحث');

      setAvailableTeachers(data.teachers);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // نشر إشغال أو خبر في قسم آخر الأخبار
  const handlePublish = async (e) => {
    e.preventDefault();
    setNewsMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/substitution/publish-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type: 'substitution', authorId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل النشر');

      setNewsMessage(data.message);
      setTitle('');
      setContent('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* قسم البحث عن معلم بديل */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">محرك الإشغال اليومي (البحث عن معلم بديل)</h2>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">اليوم</label>
              <select 
                value={day} 
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="الأحد">الأحد</option>
                <option value="الإثنين">الإثنين</option>
                <option value="الثلاثاء">الثلاثاء</option>
                <option value="الأربعاء">الأربعاء</option>
                <option value="الخميس">الخميس</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">رقم الحصة الشاغرة</label>
              <select 
                value={periodNumber} 
                onChange={(e) => setPeriodNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>الحصة {num}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-900 text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition"
              >
                {loading ? 'جاري البحث...' : 'بحث عن متاحين'}
              </button>
            </div>
          </form>

          {/* قائمة المعلمين المتاحين */}
          {availableTeachers.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-bold text-gray-800 mb-3">المعلمون المتاحون للإشغال في هذا الوقت ({availableTeachers.length}):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableTeachers.map((t) => (
                  <div key={t.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-blue-900">{t.name}</p>
                      <p className="text-xs text-gray-600">التخصص: {t.subject}</p>
                    </div>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">متاح</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* قسم نشر جدول الإشغال والأخبار */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">نشر جدول الإشغال أو خبر عام</h2>

          {newsMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {newsMessage}
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">عنوان الإشغال / الخبر</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
                placeholder="مثال: جدول الإشغال اليومي - الأحد"
                className="w-full px-3 py-2 border rounded-lg text-right"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">التفاصيل / المعلمون المكلفون</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required
                rows="4"
                placeholder="اكتب تفاصيل الإشغال هنا..."
                className="w-full px-3 py-2 border rounded-lg text-right"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="bg-green-700 text-white w-full py-2 rounded-lg font-bold hover:bg-green-600 transition"
            >
              نشر فوري في قسم آخر الأخبار
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
