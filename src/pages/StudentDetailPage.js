import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useParams } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './StudentDetailPage.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const StudentDetailPage = () => {
  const { qrCode } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  // Admin-only form state
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseStatus, setCourseStatus] = useState('Active');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDue, setAssignmentDue] = useState('');
  const [assignmentStatus, setAssignmentStatus] = useState('Due');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [attended, setAttended] = useState('');
  const [totalClasses, setTotalClasses] = useState('');
  const [saving, setSaving] = useState(false);

  const isAdmin = localStorage.getItem('role') === 'admin' && !!localStorage.getItem('token');

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // The QR-code lookup route is public, so this works with or without a token.
      const response = await fetch(`${API_BASE_URL}/api/students/qrcode/${qrCode}`, { headers });
      if (!response.ok) {
        throw new Error(`Student not found (status: ${response.status})`);
      }
      const data = await response.json();
      setStudent(data);
      setAttended(data.attendance);
      setTotalClasses(data.totalClasses);
    } catch (error) {
      console.error('Error fetching student:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode]);

  const adminPatch = async (path, method, body) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/students/${student.group}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Request failed');
    }
    return response.json();
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!course || grade === '') return;
    setSaving(true);
    setSaveMsg('');
    try {
      await adminPatch('/grades', 'PATCH', { course, grade: Number(grade) });
      setCourse('');
      setGrade('');
      setSaveMsg('Grade saved!');
      await fetchStudent();
    } catch (err) {
      setSaveMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseName) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await adminPatch('/courses', 'POST', { name: courseName, status: courseStatus });
      setCourseName('');
      setCourseStatus('Active');
      setSaveMsg('Course added!');
      await fetchStudent();
    } catch (err) {
      setSaveMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentTitle) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', assignmentTitle);
      formData.append('status', assignmentStatus);
      if (assignmentDue) formData.append('dueDate', assignmentDue);
      if (assignmentFile) formData.append('file', assignmentFile);

      const response = await fetch(`${API_BASE_URL}/api/students/${student.group}/assignments`, {
        method: 'POST',
        // Don't set Content-Type manually — the browser sets the correct
        // multipart/form-data boundary automatically for FormData.
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to add assignment');
      }
      setAssignmentTitle('');
      setAssignmentDue('');
      setAssignmentStatus('Due');
      setAssignmentFile(null);
      setSaveMsg('Assignment added!');
      await fetchStudent();
    } catch (err) {
      setSaveMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAttendance = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await adminPatch('/attendance', 'PATCH', {
        attendance: Number(attended),
        totalClasses: Number(totalClasses),
      });
      setSaveMsg('Attendance updated!');
      await fetchStudent();
    } catch (err) {
      setSaveMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div className="error-page">Error: {error}</div>;
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
        </div>
      </div>
      {saveMsg && <p className="save-msg">{saveMsg}</p>}
      <div className="academic-info">
        <div className="section">
          <h2>Attendance</h2>
          <Pie data={attendanceData} options={{ responsive: true }} />
          <p>{student.attendance} / {student.totalClasses}</p>
          {isAdmin && (
            <form onSubmit={handleUpdateAttendance} className="admin-form">
              <input type="number" placeholder="Classes attended" value={attended} onChange={(e) => setAttended(e.target.value)} min="0" />
              <input type="number" placeholder="Total classes" value={totalClasses} onChange={(e) => setTotalClasses(e.target.value)} min="0" />
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Attendance'}</button>
            </form>
          )}
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
          {isAdmin && (
            <form onSubmit={handleAddCourse} className="admin-form">
              <input type="text" placeholder="Course name" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
              <select value={courseStatus} onChange={(e) => setCourseStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Course'}</button>
            </form>
          )}
        </div>

        <div className="section">
          <h2>Grades</h2>
          {student.grades && student.grades.length > 0 ? (
            <Bar data={gradesData} options={{ responsive: true }} />
          ) : (
            <p>No grades yet</p>
          )}
          {isAdmin && (
            <form onSubmit={handleAddGrade} className="admin-form">
              <input type="text" placeholder="Course name" value={course} onChange={(e) => setCourse(e.target.value)} required />
              <input type="number" placeholder="Grade (0-100)" value={grade} onChange={(e) => setGrade(e.target.value)} min="0" max="100" required />
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add / Update Grade'}</button>
            </form>
          )}
        </div>

        <div className="section">
          <h2>Assignments</h2>
          {student.assignments && student.assignments.length > 0 ? (
            <ul>
              {student.assignments.map((assignment, index) => (
                <li key={index}>
                  {assignment.title} - {assignment.status}
                  {assignment.dueDate && ` (Due: ${new Date(assignment.dueDate).toLocaleDateString()})`}
                  {assignment.grade !== null && assignment.grade !== undefined && ` - Grade: ${assignment.grade}`}
                  {assignment.fileUrl && (
                    <a
                      href={`${API_BASE_URL}${assignment.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="assignment-file-link"
                    >
                      📄 {assignment.fileName || 'View PDF'}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments available</p>
          )}
          {isAdmin && (
            <form onSubmit={handleAddAssignment} className="admin-form">
              <input type="text" placeholder="Assignment title" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} required />
              <input type="date" value={assignmentDue} onChange={(e) => setAssignmentDue(e.target.value)} />
              <select value={assignmentStatus} onChange={(e) => setAssignmentStatus(e.target.value)}>
                <option value="Due">Due</option>
                <option value="Submitted">Submitted</option>
                <option value="Pending">Pending</option>
              </select>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setAssignmentFile(e.target.files[0] || null)}
              />
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Assignment'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
