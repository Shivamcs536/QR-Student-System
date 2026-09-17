import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './StudentDetailPage.css'; // reuse the same styling

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Read-only profile page for a logged-in student account.
const MyProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || `Request failed (${response.status})`);
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (error) return (
    <div className="error-page">
      Error: {error}
      <div><button onClick={handleLogout}>Logout</button></div>
    </div>
  );
  if (!student) return <div className="loading-page">Loading...</div>;

  const attendanceData = {
    labels: ['Attended', 'Missed'],
    datasets: [{
      data: [student.attendance, Math.max(student.totalClasses - student.attendance, 0)],
      backgroundColor: ['#1976D2', '#E0E0E0'],
    }],
  };

  const gradesData = {
    labels: (student.grades || []).map(g => g.course),
    datasets: [{
      label: 'Grades',
      data: (student.grades || []).map(g => g.grade),
      backgroundColor: '#1976D2',
    }],
  };

  return (
    <div className="student-detail-page">
      <div className="profile-header">
        <img src={student.photo} alt={student.name} className="student-photo" />
        <div className="profile-info">
          <h1>{student.name}</h1>
          <p>ID: {student.group}</p>
          <p>Phone: {student.phone}</p>
          <p>Email: {student.email || 'N/A'}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="academic-info">
        <div className="section">
          <h2>Attendance</h2>
          <Pie data={attendanceData} options={{ responsive: true }} />
          <p>{student.attendance} / {student.totalClasses}</p>
        </div>
        <div className="section">
          <h2>Courses</h2>
          {student.courses && student.courses.length > 0 ? (
            <ul className="course-list">
              {student.courses.map((c, index) => (
                <li key={index} className={`course-item ${c.status.toLowerCase()}`}>
                  {c.name} - <span>{c.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses available</p>
          )}
        </div>
        <div className="section">
          <h2>Grades</h2>
          {student.grades && student.grades.length > 0 ? (
            <Bar data={gradesData} options={{ responsive: true }} />
          ) : (
            <p>No grades yet</p>
          )}
        </div>
        <div className="section">
          <h2>Assignments</h2>
          {student.assignments && student.assignments.length > 0 ? (
            <ul>
              {student.assignments.map((a, index) => (
                <li key={index}>
                  {a.title} - {a.status}
                  {a.dueDate && ` (Due: ${new Date(a.dueDate).toLocaleDateString()})`}
                  {a.grade !== null && a.grade !== undefined && ` - Grade: ${a.grade}`}
                  {a.fileUrl && (
                    <a
                      href={`${API_BASE_URL}${a.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="assignment-file-link"
                    >
                      📄 {a.fileName || 'View PDF'}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
