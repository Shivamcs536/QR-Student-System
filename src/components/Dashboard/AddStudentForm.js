import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { QRCodeCanvas } from 'qrcode.react';
import './AddStudentForm.css';

const AddStudentForm = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const payload = { name, phone, group, email };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCode);
        onAddStudent();
        setName('');
        setPhone('');
        setGroup('');
        setEmail('');
      } else {
        setError(data.message || 'Failed to add student');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-student-container">
      <form onSubmit={handleSubmit} className="add-student-form">
        <h2>Add Student</h2>
        {error && <p className="error">{error}</p>}
        <div className="input-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="Group"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <button type="submit" className="add-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Student'}
        </button>
      </form>
      {qrCode && (
        <div className="qr-code-container">
          <h3>Generated QR Code</h3>
          <QRCodeCanvas value={qrCode} size={150} />
          <p>Scan to view student details</p>
        </div>
      )}
    </div>
  );
};

export default AddStudentForm;