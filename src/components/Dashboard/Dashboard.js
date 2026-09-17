import React from 'react';
import NavBar from './NavBar';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';

const Dashboard = () => {
  const handleAddStudent = () => {
    window.location.reload(); // Simple refresh, can be improved with state management
  };

  return (
    <div className="dashboard">
      <NavBar />
      <div className="dashboard-content">
        <AddStudentForm onAddStudent={handleAddStudent} />
        <StudentList />
      </div>
    </div>
  );
};

export default Dashboard;