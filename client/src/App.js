import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import ProtectedRoute from './components/ProtectedRoute';
import AddInfo from './components/AddInfo';


function App() {
  console.log('App was ran')
  return (
    <Router>
      <Routes>
       <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<ProtectedRoute element={AddInfo} />} />
        <Route path="/main" element={<ProtectedRoute element={Main} />} />
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </Router>
  );
}

 export default App;






