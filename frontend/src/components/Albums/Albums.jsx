import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from '../Search';
import styles from '../../css/Albums.module.css';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:3000/albums?userId=${user.id}`)
      .then((res) => setAlbums(res.data))
      .catch((err) => {
        console.error('Failed to load albums:', err);
        alert('Error loading albums');
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Albums</h2>

      <Search
        resource="albums"
        setResults={setAlbums}
        userId={user.id}
      />

      <ul className={styles.cardList}>
        {albums.length === 0 && (
          <p className={styles.noResults}>No matching albums found.</p>
        )}

        {albums.map((album) => (
          <li key={album.id}>
            <div
              className={styles.card}
              onClick={() => navigate(`photos/${album.id}`)}
            >
              <h3>Album #{album.id}</h3>
              <p>{album.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}