import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.msg || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log('Token stored:', localStorage.getItem('token'));
      setError('');
      navigate('/main'); // Redirect to the main page
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <div className="container">
      <div className="box">
      <img src="../../icon48.png" alt="Logo" className="logo" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
      <input
            type="text"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button type="submit" className="button">LOGIN</button>
        </form>
        <Link to="/register" className="register-link">Need an account? Sign up here</Link>
      </div>
    </div>
  );
};

export default Login;