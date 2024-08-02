import React from 'react';
import '../styles/Login.css';  // Define styles here

const Register = () => {
  return (
    <div className="container">
      <div className="box">
      <img src="../../icon48.png" alt="Logo" className="logo" />
        <input type="text" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <input type="password" placeholder="Re-enter Password" className="input-field" />
        <button className="button">REGISTER</button>
      </div>
    </div>

  );
};

export default Register;
