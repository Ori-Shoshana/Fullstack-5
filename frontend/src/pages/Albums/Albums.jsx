import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from '../../components/Search';
import styles from '../../css/Albums.module.css';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]); // שמירה של כל האלבומים בזיכרון
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:3000/albums?userId=${user.id}`)
      .then((res) => {
        setAlbums(res.data);
        setAllAlbums(res.data); // שמור את כל האלבומים ב־allAlbums
      })
      .catch((err) => {
        console.error('Failed to load albums:', err);
        alert('Error loading albums');
      });
  }, []);

  const handleSearch = () => {
    setSearchParams({ by: searchBy, query: searchQuery });
  };

  const handleClear = () => {
    setSearchParams(null);
    setSearchQuery('');
    setSearchBy('title');
    setAlbums(allAlbums); // איפוס מתוך זיכרון - ללא axios
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Albums</h2>

      <Search
        resource="albums"
        userId={user.id}
        setResults={setAlbums}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchParams={searchParams}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <ul className={styles.cardList}>
        {albums.length === 0 && (
          <p className={styles.noResults}>No matching albums found.</p>
        )}
        {albums.map((album) => (
          <li key={album.id}>
            <div
              className={styles.card}
              onClick={() => navigate(`${album.id}/photos`)}
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
