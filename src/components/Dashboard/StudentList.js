import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../config';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './StudentList.css';

const StudentList = ({ searchTerm, refresh }) => {
  const [students, setStudents] = useState([]);
  const [view, setView] = useState('grid');
  const [enlargedQR, setEnlargedQR] = useState(null);
  const qrRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStudents(
          data.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [searchTerm, refresh]);

  const handleViewToggle = (viewType) => setView(viewType);
  const handleEnlargeQR = (qrCode) => setEnlargedQR(qrCode);
  const closeModal = () => setEnlargedQR(null);
  const handleViewDetails = (qrCode) => navigate(`/student/qrcode/${qrCode.split('/').pop()}`);

  const handleDownload = async (qrCode) => {
    const canvas = await html2canvas(qrRef.current);
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `QR_${qrCode.split('/').pop()}.png`;
    link.click();
  };

  const handlePrint = async (qrCode) => {
    const canvas = await html2canvas(qrRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.autoPrint();
    pdf.output('dataurlnewwindow');
  };

  const renderGridView = () => (
    <div className="student-list grid">
      {students.map((student) => (
        <div key={student.group} className="student-card">
          <div ref={qrRef}>
            <QRCodeCanvas value={student.qrCode} size={100} />
          </div>
          <h3 className="student-name">{student.name}</h3>
          <p className="student-phone">{student.phone}</p>
          <div className="action-buttons">
            <button onClick={() => handleViewDetails(student.qrCode)}>View</button>
            <button onClick={() => handleEnlargeQR(student.qrCode)}>Enlarge</button>
            <button onClick={() => handleDownload(student.qrCode)}>Download</button>
            <button onClick={() => handlePrint(student.qrCode)}>Print</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <table className="student-list table">
      <thead>
        <tr>
          <th>QR Code</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Group</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.group}>
            <td>
              <div ref={qrRef}>
                <QRCodeCanvas value={student.qrCode} size={50} />
              </div>
            </td>
            <td>{student.name}</td>
            <td>{student.phone}</td>
            <td>{student.group}</td>
            <td>
              <button onClick={() => handleViewDetails(student.qrCode)}>View</button>
              <button onClick={() => handleEnlargeQR(student.qrCode)}>Enlarge</button>
              <button onClick={() => handleDownload(student.qrCode)}>Download</button>
              <button onClick={() => handlePrint(student.qrCode)}>Print</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="student-list-container">
      <div className="view-toggle">
        <button className={view === 'grid' ? 'active' : ''} onClick={() => handleViewToggle('grid')}>
          Grid
        </button>
        <button className={view === 'table' ? 'active' : ''} onClick={() => handleViewToggle('table')}>
          Table
        </button>
      </div>
      {view === 'grid' ? renderGridView() : renderTableView()}
      {enlargedQR && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>×</span>
            <QRCodeCanvas value={enlargedQR} size={300} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;