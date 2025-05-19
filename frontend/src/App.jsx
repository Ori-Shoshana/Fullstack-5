import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Todos from './components/Todos.jsx';
import Albums from './components/Albums/Albums.jsx';
import Photos from './components/Albums/Photos.jsx';
import Posts from './components/Posts/Posts.jsx';
import Comments from './components/Posts/Comments.jsx';

const MainPage = ({ user, navigate, handleLogout }) => (
  <div>
    <h1>Welcome, {user.name}</h1>
    <nav>
      <button onClick={() => navigate('info')}>Info</button>
      <button onClick={() => navigate('todos')}>Todos</button>
      <button onClick={() => navigate('posts')}>Posts</button>
      <button onClick={() => navigate('albums')}>Albums</button>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  </div>
);

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
    <Routes>
      <Route
        path="/"
        element={<MainPage user={user} navigate={navigate} handleLogout={handleLogout} />}
      />
      <Route path="info" element={<div>Info page (coming soon)</div>} />
      <Route path="todos" element={<Todos />} />
      <Route path="posts" element={<Posts />} />
      <Route path="posts/comments/:postId" element={<Comments />} />
      <Route path="albums" element={<Albums />} />
      <Route path="albums/photos/:albumId" element={<Photos />} />
    </Routes>
  );
};

export default App;
