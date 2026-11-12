import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminImportSchedule from './pages/AdminImportSchedule';
import PrincipalSubstitution from './pages/PrincipalSubstitution';
import TeacherExamResources from './pages/TeacherExamResources';
import StudentExamAndGrades from './pages/StudentExamAndGrades';
import InternalMessages from './pages/InternalMessages';

// مكون لحماية المسارات حسب الصلاحية (Role)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  if (!role) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <Routes>
          {/* المسار العام */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* مسارات الإداري */}
          <Route 
            path="/admin/import-schedule" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminImportSchedule />
              </ProtectedRoute>
            } 
          />

          {/* مسارات المدير والمساعد */}
          <Route 
            path="/principal/substitution" 
            element={
              <ProtectedRoute allowedRoles={['principal', 'assistant', 'admin']}>
                <PrincipalSubstitution />
              </ProtectedRoute>
            } 
          />

          {/* مسارات المعلم */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherExamResources />
              </ProtectedRoute>
            } 
          />

          {/* مسارات الطالب */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentExamAndGrades />
              </ProtectedRoute>
            } 
          />

          {/* البريد الداخلي المشترك لجميع الأدوار */}
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'principal', 'assistant', 'teacher', 'student']}>
                <InternalMessages />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
