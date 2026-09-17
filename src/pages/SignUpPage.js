import React from 'react';
import SignUpForm from '../components/SignUp/SignUpForm';
import './SignUpPage.css';

const SignUpPage = () => (
  <div className="signup-page">
    <h1 style={{ color: '#1976D2', textAlign: 'center' }}>WebQR Student Progress Monitor</h1>
    <SignUpForm />
  </div>
);

export default SignUpPage;