import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../../components/Search';
import { create, getAll } from '../../api/crudService';
import styles from '../../css/Albums/Albums.module.css';
import Add from '../../components/Add';
import AlbumList from './AlbumList';
import BackButton from '../../components/BackButton';


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

    const fetchAlbums = async () => {
      try {
        const data = await getAll('albums', user.id);
        setAlbums(data);
        setCacheAlbums(data);
      } catch (err) {
        console.error('Failed to load albums:', err);
        alert('Error loading albums');
      }
    };

    fetchAlbums();
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
      <BackButton to="/home" label="Back to Home" />
      <h2 className={styles.title}>Your Albums</h2>

      <div className={styles.controlsContainer}>
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

        <Add onAdd={addAlbum} placeholder="New album title" type="Album" title={newTitle} setTitle={setNewTitle} />
      </div>
      <AlbumList albums={albums} />
    </div>
  );
}
