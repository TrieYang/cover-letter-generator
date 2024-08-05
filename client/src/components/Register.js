import React, { useState } from 'react';
import '../styles/Register.css';  // Ensure the correct CSS file is imported
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== reenteredPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setSuccess('User registered successfully!');
      setError('');
      navigate('/main'); // Redirect to the main page
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <div className="box">
        <img src="../../icon48.png" alt="Logo" className="logo" />
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
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
          <input
            type="password"
            placeholder="Re-enter Password"
            className="input-field"
            value={reenteredPassword}
            onChange={(e) => setReenteredPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">REGISTER</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

