import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/user.module.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordVerify) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users?username=${username}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        alert('Username already exists!');
        return;
      }

      localStorage.setItem('newUserAuth', JSON.stringify({
        username,
        password
      }));

      navigate('/register/details');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error checking username. Please try again.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleRegister}>
        <h1>Register</h1>

        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Choose a username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.inputBox}>
          <input
            type="password"
            placeholder="Choose a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.inputBox}>
          <input
            type="password"
            placeholder="Repeat password"
            required
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.btn}>Next</button>

        <div className={styles.link}>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
