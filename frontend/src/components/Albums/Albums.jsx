import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Albums.module.css';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3000/albums?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => {
        console.error('Failed to load albums:', err);
        alert('Error loading albums');
      });
  }, []);

  const filteredAlbums = albums.filter((album) => {
    if (searchBy === 'id') {
      return String(album.id).includes(searchQuery.trim());
    }
    return album.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Albums</h2>

      <div className={styles.searchControls}>
        <select
          className={styles.select}
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="title">Search by Title</option>
          <option value="id">Search by ID</option>
        </select>

        <input
          className={styles.input}
          type="text"
          placeholder={`Search albums by ${searchBy}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ul className={styles.cardList}>
        {filteredAlbums.length === 0 && (
          <p className={styles.noResults}>No matching albums found.</p>
        )}

        {filteredAlbums.map((album) => (
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
