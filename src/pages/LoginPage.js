import React from 'react';
import LoginForm from '../components/Login/LoginForm';
import './LoginPage.css';

const LoginPage = () => (
  <div className="login-page">
    <h1 style={{ color: '#1976D2', textAlign: 'center' }}>WebQR Student Progress Monitor</h1>
    <LoginForm />
    <p style={{ marginTop: '10px' }}>
      Don't have an account? <a href="/signup">Sign Up</a>
    </p>
  </div>
);

export default LoginPage;