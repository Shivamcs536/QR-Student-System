import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Dashboard/NavBar';
import StudentList from '../components/Dashboard/StudentList';
import AddStudentForm from '../components/Dashboard/AddStudentForm';

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      navigate('/');
    } else if (role !== 'admin') {
      navigate('/my-profile');
    }
  }, [navigate]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddStudent = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <NavBar onSearch={handleSearch} />
      <AddStudentForm onAddStudent={handleAddStudent} />
      <StudentList searchTerm={searchTerm} refresh={refresh} />
    </div>
  );
};

export default DashboardPage;