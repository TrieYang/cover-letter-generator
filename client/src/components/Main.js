/* global chrome */
import React, { useEffect, useState } from 'react';
import '../styles/Main.css'; // Make sure to create and import the CSS file
import { useNavigate, Link } from 'react-router-dom';


const Main = () => {
  const navigate = useNavigate();
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    const fetchInfos = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5001/api/info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch information');
        }

        const data = await response.json();
        setInfos(data.infos);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchInfos();
  }, []);


  const handleGenerate = () => {
    chrome.runtime.sendMessage({ message: "startScraping" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        console.log(response.status);
      }
    });
  };


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
          {infos.map(info => (
            <option key={info._id} value={info._id}>{info.title}</option>
          ))}
        </select>
        <Link to="/add" className="add-info-link">Add new info</Link>
        <select className="input-field">
          <option>Genuine and Passionate tone</option>
          {/* Add your options here */}
        </select>
        <button className="button" onClick={handleGenerate}>GENERATE</button>
        <button className="button" onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
};

export default Main;
