import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Todos from './components/Todos.jsx';
import Albums from './components/Albums/Albums.jsx';
import Photos from './components/Albums/Photos.jsx';
import Posts from './components/Posts/Posts.jsx';
import Comments from './components/Posts/Comments.jsx';
import UserInfo from './components/UserInfo.jsx'; // ייבוא חדש
import styles from './css/MainPage.module.css';

const MainPage = ({ user, navigate, handleLogout, toggleInfo }) => (
  <div className={styles.container}>
    <h1 className={styles.welcome}>Welcome, {user.name}</h1>

    <div className={styles.navButtons}>
      <button onClick={toggleInfo}>Info</button>
      <button onClick={() => navigate('todos')}>Todos</button>
      <button onClick={() => navigate('posts')}>Posts</button>
      <button onClick={() => navigate('albums')}>Albums</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>
);

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
        <Route path="todos" element={<Todos />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/comments/:postId" element={<Comments />} />
        <Route path="albums" element={<Albums />} />
        <Route path="albums/photos/:albumId" element={<Photos />} />
      </Routes>
    </>
  );
};

export default App;
