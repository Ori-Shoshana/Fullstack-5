import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Todos from './pages/Todos/Todos.jsx';
import Albums from './pages/Albums/Albums.jsx';
import Photos from './pages/Albums/Photos.jsx';
import Posts from './pages/Posts/Posts.jsx';
import Comments from './pages/Posts/Comments.jsx';
import UserInfo from './pages/Profile/UserInfo.jsx';
import styles from './css/MainPage.module.css';
import PropTypes from "prop-types";

const MainPage = (props) => {
  const { user, navigate, handleLogout, toggleInfo } = props;
  return (
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
};

MainPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  toggleInfo: PropTypes.func.isRequired,
};

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
