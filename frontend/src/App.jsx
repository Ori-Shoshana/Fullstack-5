import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Todos from './components/Todos.jsx'
import Albums from './components/Albums/Albums.jsx';
import PhotosPage from './components/Albums/Photos.jsx';

const App = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('activeUser'));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('activeUser');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      <nav>
        <button onClick={() => navigate('info')}>Info</button>
        <button onClick={() => navigate('todos')}>Todos</button>
        <button onClick={() => navigate('posts')}>Posts</button>
        <button onClick={() => navigate('albums')}>Albums</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Routes>
        <Route path="info" element={<div>Info page (coming soon)</div>} />
        <Route path="todos" element={<Todos />} />
        <Route path="posts" element={<div>Posts page (coming soon)</div>} />
        <Route path="albums" element={<Albums />} />
        <Route path="albums/photos/:albumId" element={<PhotosPage />} />

      </Routes>
    </div>
  );
};

export default App;
