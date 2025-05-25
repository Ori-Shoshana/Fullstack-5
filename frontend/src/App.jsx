import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Todos from './pages/Todos/Todos.jsx';
import Albums from './pages/Albums/Albums.jsx';
import Photos from './pages/Photos/Photos.jsx';
import Posts from './pages/Posts/Posts.jsx';
import Comments from './pages/Comments/Comments.jsx';
import UserInfo from './pages/Profile/UserInfo.jsx';
import MainPage from './mainPage.jsx';

const App = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('activeUser'));
  const [showInfo, setShowInfo] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('activeUser');
    navigate('/login');
  };

  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <>
      {showInfo && <UserInfo user={user} onClose={() => setShowInfo(false)} />}

      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              user={user}
              navigate={navigate}
              handleLogout={handleLogout}
              toggleInfo={toggleInfo}
            />
          }
        />
        <Route path="users/:userId/todos" element={<Todos />} />
        <Route path="users/:userId/posts" element={<Posts />} />
        <Route path="users/:userId/posts/:postId/comments" element={<Comments />} />
        <Route path="users/:userId/albums" element={<Albums />} />
        <Route path="users/:userId/albums/:albumId/photos" element={<Photos />} />

      </Routes>
    </>
  );
};

export default App;
