import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css'; // We'll define styles in this file

const Login = () => {
  return (
    <div className="container">
      <div className="box">
      <img src="../../icon48.png" alt="Logo" className="logo" />
        <input type="text" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="button">LOGIN</button>
        <Link to="/register" className="register-link">Need an account? Sign up here</Link>
      </div>
    </div>
  );
};

export default Login;