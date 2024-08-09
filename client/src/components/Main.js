/* global chrome */
import React, { useEffect, useState } from 'react';
import '../styles/Main.css'; // Make sure to create and import the CSS file
import { useNavigate, Link } from 'react-router-dom';


const Main = () => {
  const navigate = useNavigate();
  const [infos, setInfos] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const compressData = (data) => {
    return encodeURIComponent(data);
  };

  const handleGenerate = () => {
    setLoading(true); // Show loading animation
    chrome.runtime.sendMessage({ message: "startScraping" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        setLoading(false);
      } else {
        if (response.status === "Scraping started") {
          // Fetch the scraped HTML content from the background script
          chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message === "scrapedHTML") {
              console.log("scrapedHTML received in main");
              const scrapedHTML = compressData(request.html);
              console.log("a html is ready to be sent");
              // Send the HTML content and selected info to your server
              fetch('http://localhost:5001/api/generate-cover-letter', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  html: scrapedHTML,
                  info: selectedInfo.content
                })
              })
              .then(res => {
                console.log("a result was received");
                if (!res.ok) {
                  throw new Error('Network response was not ok');
                }
                return res.blob();
              })
              .then(blob => {
                setLoading(false); // Hide loading animation once the blob is received
                // Create a link to download the PDF
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Cover_Letter.pdf');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              })
              .catch(error => console.error("Error generating cover letter:", error));
              setLoading(false);
          }
          });
        }
      }
    });
  };




  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">


      {loading && (
        <div className="loading-overlay">
          <div className="loading-animation">
            <p>This can take up to 1 minute.<br />Please wait while we write your cover letter for this job posting...</p>
          </div>
        </div>
      )}

      <div className="box">
        <h2>PERSONALIZED INFO*</h2>
        <select className="input-field" onChange={e => {
  const selectedId = e.target.value;
  const info = infos.find(info => info._id === selectedId);
  setSelectedInfo(info); // Set the entire info object
}}>
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
