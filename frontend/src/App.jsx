import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('activeUser'));

  if (!user) {
    navigate('/login');
    return null; // לא מציג כלום אם לא מחובר
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
        <Route path="todos" element={<div>Todos page (coming soon)</div>} />
        <Route path="posts" element={<div>Posts page (coming soon)</div>} />
        <Route path="albums" element={<div>Albums page (coming soon)</div>} />
      </Routes>
    </div>
  );
};

export default App;
