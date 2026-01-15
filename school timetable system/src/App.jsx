import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentTable from "./components/StudentTable";
import TeacherTable from "./components/TeacherTable";
import TimetableTable from "./components/TimetableTable";
import ForgotPassword from "./pages/ForgotPassword";




const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
    {/* <Route path="/login" element={<Login />} /> */}

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/add-student" element={<ProtectedRoute allowedRoles={["admin"]}><StudentTable /></ProtectedRoute>} />
        <Route path="/add-teacher" element={<ProtectedRoute allowedRoles={["admin"]}><TeacherTable /></ProtectedRoute>} />
        <Route path="/manage-timetable" element={<ProtectedRoute allowedRoles={["admin"]}><TimetableTable /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />


        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<h2 className="p-6">Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
