import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from '../../components/Search';
import { create } from '../../api/crudService';
import styles from '../../css/Albums.module.css';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [cacheAlbums, setCacheAlbums] = useState([]);
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState(null);
  const [newTitle, setNewTitle] = useState('');

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
        setCacheAlbums(res.data);
      })
      .catch((err) => {
        console.error('Failed to load albums:', err);
        alert('Error loading albums');
      });
  }, []);

  const addAlbum = async () => {
    if (!newTitle.trim()) return;

    const newAlbum = await create('albums', {
      userId: user.id,
      title: newTitle.trim()
    });

    setAlbums((prev) => [...prev, newAlbum]);
    setCacheAlbums((prev) => [...prev, newAlbum]);
    setNewTitle('');
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
        setSearchParams={setSearchParams}
        cachedData={cacheAlbums}
      />

      <div className={styles.addAlbumContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="New album title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button className={styles.addButton} onClick={addAlbum}>
          Add Album
        </button>
      </div>

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
  