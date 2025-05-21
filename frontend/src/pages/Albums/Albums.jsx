import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Search from '../../components/Search';
import styles from '../../css/Albums.module.css';
import { create } from '../../api/crudService';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:3000/albums?userId=${userId}`)
      .then((res) => setAlbums(res.data))
      .catch((err) => {
        console.error('Failed to load albums:', err);
        alert('Error loading albums');
      });
  }, [userId]);

  const addAlbum = async () => {
    if (newTitle.trim() === "") return;

    const newAlbum = await create("albums", {
      userId: parseInt(userId),
      title: newTitle.trim(),
    });

    setAlbums((prev) => [...prev, newAlbum]);
    setNewTitle("");
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Albums</h2>

      <Search
        resource="albums"
        userId={userId}
        setResults={setAlbums}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className={styles.searchControls}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter new album title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button className={styles.select} onClick={addAlbum}>
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
