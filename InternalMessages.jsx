import React, { useState, useEffect } from 'react';

export default function InternalMessages() {
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [receiverId, setReceiverId] = useState(''); // فارغ يعني موجه للإدارة العامة
  const [statusMsg, setStatusMsg] = useState('');

  const userId = localStorage.getItem('userId');

  const fetchInbox = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/inbox/${userId}`);
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (err) {
      console.error('خطأ في جلب الرسائل:', err);
    }
  };

  useEffect(() => {
    if (userId) fetchInbox();
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId: receiverId.trim() || null,
          subject,
          body
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الإرسال');

      setStatusMsg(data.message);
      setSubject('');
      setBody('');
      setReceiverId('');
      fetchInbox();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rtl">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* نموذج إرسال رسالة */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4">إرسال رسالة جديدة</h2>
          {statusMsg && <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">{statusMsg}</div>}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">المستلم (اتركه فارغاً للإرسال للإدارة)</label>
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="معرف المستلم (اختياري)"
                className="w-full px-3 py-2 border rounded-lg text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">عنوان الرسالة</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="مثال: طلب إجازة / استفسار"
                className="w-full px-3 py-2 border rounded-lg text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">نص الرسالة</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows="4"
                placeholder="اكتب رسالتك هنا..."
                className="w-full px-3 py-2 border rounded-lg text-right"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition">
              إرسال الرسالة
            </button>
          </form>
        </div>

        {/* صندوق الوارد */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4">صندوق الوارد ({messages.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">صندوق الوارد فارغ.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className="p-3 border rounded-lg bg-gray-50 hover:bg-blue-50 transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-900 text-sm">{msg.subject}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString('ar-JO')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">من: {msg.senderId?.name || 'مستخدم'}</p>
                  <p className="text-sm text-gray-800">{msg.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
