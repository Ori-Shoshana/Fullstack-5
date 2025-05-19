import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/user.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/users?username=${username}`);
      const users = await res.json();

      if (users.length === 0) {
        alert('User not found!');
        return;
      }

      const user = users[0];

      if (user.website !== password) {
        alert('Incorrect password!');
        return;
      }

      localStorage.setItem('activeUser', JSON.stringify(user));

      // מעבר לעמוד הבית
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.inputBox}>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.btn}>Login</button>

        <div className={styles.link}>
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
