import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import SignUpForm from './components/SignUp/SignUpForm';
import DashboardPage from './pages/DashboardPage';
import StudentDetailPage from './pages/StudentDetailPage';
import MyProfilePage from './pages/MyProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/student/qrcode/:qrCode" element={<StudentDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;