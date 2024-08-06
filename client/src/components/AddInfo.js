import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddInfo.css';
import '../styles/Login.css';

const AddInfo = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(title.trim() !== '' && content.trim() !== '');
  }, [title, content]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5001/api/info/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to save information');
      }

      console.log('Saved:', { title, content });
      navigate('/main');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancel = () => {
    navigate('/main');
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Add resume/cover letter sample</h2>
        <input
          type="text"
          placeholder="Title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Copy and paste your resume/cover letter here..."
          className="textarea-field"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="buttons">
        <button
            className={`button save-button ${isFormValid ? '' : 'disabled'}`}
            onClick={handleSave}
            disabled={!isFormValid}
          >
            SAVE
          </button>
          <button className="button cancel-button" onClick={handleCancel}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default AddInfo;
