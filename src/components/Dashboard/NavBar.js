import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import profileLogo from '../../assets/profile-logo.png';

const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="navbar">
      <h1>QR Student Progress Monitor</h1>
      <input
        type="text"
        placeholder="Search students..."
        className="search-bar"
        onChange={handleSearch}
      />
      <div className="profile-section">
        <img src={profileLogo} alt="Profile" className="profile-logo" />
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default NavBar;