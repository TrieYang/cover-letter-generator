import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddInfo.css';
import '../styles/Login.css';

const AddInfo = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    // Handle the save functionality here
    // You might want to send the data to your backend
    console.log('Saved:', { title, content });
    navigate('/main');
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
          <button className="button save-button" onClick={handleSave}>SAVE</button>
          <button className="button cancel-button" onClick={handleCancel}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default AddInfo;
