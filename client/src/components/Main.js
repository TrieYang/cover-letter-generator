import React from 'react';
import '../styles/Main.css'; // Make sure to create and import the CSS file
import { useNavigate, Link } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="box">
        <h2>PERSONALIZED INFO*</h2>
        <select className="input-field">
          <option>Choose from Drop Down...</option>
          {/* Add your options here */}
        </select>
        <Link to="/add" className="add-info-link">Add new info</Link>
        <select className="input-field">
          <option>Genuine and Passionate tone</option>
          {/* Add your options here */}
        </select>
        <button className="button" disabled>GENERATE</button>
        <button className="button" onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
};

export default Main;
