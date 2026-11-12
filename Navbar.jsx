import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [periodStatus, setPeriodStatus] = useState('جاري حساب الحصة...');

  // جدول أوقات الجرس الافتراضي (يمكن جلبه من API /api/bell-timings)
  const bellSchedule = [
    { name: 'الطابور الصباحي', start: '07:45', end: '08:00' },
    { name: 'الحصة الأولى', start: '08:00', end: '08:45' },
    { name: 'الحصة الثانية', start: '08:45', end: '09:30' },
    { name: 'الاستراحة الأولى', start: '09:30', end: '09:50' },
    { name: 'الحصة الثالثة', start: '09:50', end: '10:35' },
    { name: 'الحصة الرابعة', start: '10:35', end: '11:20' },
    { name: 'الاستراحة الثانية', start: '11:20', end: '11:35' },
    { name: 'الحصة الخامسة', start: '11:35', end: '12:20' },
    { name: 'الحصة السادسة', start: '12:20', end: '13:05' },
    { name: 'الحصة السابعة', start: '13:05', end: '13:50' },
  ];

  useEffect(() => {
    const updateClockAndPeriod = () => {
      const now = new Date();
      setCurrentTime(now);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let active = 'خارج أوقات الدوام الرسمي';

      for (const slot of bellSchedule) {
        const [startH, startM] = slot.start.split(':').map(Number);
        const [endH, endM] = slot.end.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        if (currentMinutes >= startTotal && currentMinutes < endTotal) {
          const remaining = endTotal - currentMinutes;
          active = `${slot.name} (متبقي ${remaining} دقيقة)`;
          break;
        }
      }
      setPeriodStatus(active);
    };

    updateClockAndPeriod();
    const timer = setInterval(updateClockAndPeriod, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!userName) return null; // لا يظهر في صفحة تسجيل الدخول

  return (
    <nav className="bg-blue-950 text-white shadow-lg p-4 rtl">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        
        {/* اسم النظام وبيانات المستخدم */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-xl font-extrabold text-yellow-400">مدرستي الذكية</span>
          <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">
            مرحباً، {userName} ({role === 'admin' ? 'إداري' : role === 'principal' ? 'مدير' : role === 'teacher' ? 'معلم' : 'طالب'})
          </span>
        </div>

        {/* مؤشر الحصة الحالية والوقت الحقيقي */}
        <div className="flex items-center space-x-4 space-x-reverse bg-blue-900 px-4 py-2 rounded-lg border border-blue-700">
          <span className="text-sm font-bold text-green-300">🔔 {periodStatus}</span>
          <span className="text-xs text-gray-300 border-r border-blue-700 pr-3">
            🕒 {currentTime.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* روابط التنقل السريع */}
        <div className="flex items-center space-x-4 space-x-reverse text-sm font-bold">
          <Link to="/messages" className="hover:text-yellow-400 transition">📩 البريد الداخلي</Link>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition"
          >
            خروج
          </button>
        </div>

      </div>
    </nav>
  );
}
