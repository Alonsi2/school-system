import React, { useState } from 'react';

export default function AdminImportSchedule() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('الرجاء اختيار ملف إكسل أولاً');
      return;
    }

    const formData = new FormData();
    formData.append('scheduleFile', file);

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/schedule/import-excel', {
        method: 'POST',
        body: formData, // ملاحظة: لا تضع Content-Type مع FormData لأن المتصفح يضبطه تلقائياً
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء رفع الملف');
      }

      setMessage(data.message);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">إدارة وجداول المدرسة</h2>
        <p className="text-gray-600 text-center mb-6">
          قم بتنزيل نموذج الإكسل المبرمج، وتعبئته بالبرنامج المدرسي، ثم ارفعه أدناه لتحديث قاعدة البيانات تلقائياً.
        </p>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-center">
          <a
            href="/School_Master_Schedule_Template.xlsx"
            download
            className="bg-green-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition"
          >
            📥 تحميل نموذج الإكسل المبرمج
          </a>
        </div>

        <form onSubmit={handleUpload} className="space-y-4 border-t pt-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">ملفات Excel فقط (.xlsx)</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition duration-200"
          >
            {loading ? 'جاري رفع وتفريغ الملف في القاعدة...' : 'رفع واستيراد الجدول المدرسي'}
          </button>
        </form>
      </div>
    </div>
  );
}
