// Photos.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { create, remove, update, getByPage } from '../../api/crudService';
import styles from '../../css/Photos.module.css';
import PhotoPopup from './PhotoPopup';

const globalPhotoCache = {}; // shared across navigations

export default function Photos() {
  const { albumId, userId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const PHOTOS_PER_PAGE = 5;

  useEffect(() => {
    // Initialize album cache if not already
    if (!globalPhotoCache[albumId]) {
      globalPhotoCache[albumId] = {};
    }

    const cachedPage = globalPhotoCache[albumId][currentPage];
    if (cachedPage) {
      console.log("from cache");
      setPhotos(cachedPage);
      setHasMore(cachedPage.length === PHOTOS_PER_PAGE);
      return;
    }

    const loadPhotos = async () => {
      try {
        console.log("fetching");
        const data = await getByPage('photos', 'albumId', albumId, currentPage, PHOTOS_PER_PAGE);
        setPhotos(data);
        setHasMore(data.length === PHOTOS_PER_PAGE);
        globalPhotoCache[albumId][currentPage] = data;
      } catch (err) {
        console.error('Failed to load photos:', err);
        alert('Error loading photos');
      }
    };

    loadPhotos();
  }, [albumId, currentPage]);

  const handleNext = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const addPhoto = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newPhoto = await create("photos", {
      albumId: parseInt(albumId),
      title: newTitle.trim(),
      url: newUrl.trim(),
      thumbnailUrl: newUrl.trim()
    });

    const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);

    // update global cache
    if (!globalPhotoCache[albumId]) globalPhotoCache[albumId] = {};
    globalPhotoCache[albumId][currentPage] = newPhotos;

    setNewTitle('');
    setNewUrl('');
  };

  const deletePhoto = async (id) => {
    await remove("photos", id);
    const res1 = await getByPage("photos", "albumId", albumId, currentPage, PHOTOS_PER_PAGE);
    let currentPhotos = res1;

    if (currentPhotos.length < PHOTOS_PER_PAGE) {
      const res2 = await getByPage("photos", "albumId", albumId, currentPage + 1, PHOTOS_PER_PAGE);
      let nextPagePhotos = res2;

      while (currentPhotos.length < PHOTOS_PER_PAGE && nextPagePhotos.length > 0) {
        currentPhotos.push(nextPagePhotos.shift());
      }

      globalPhotoCache[albumId][currentPage] = currentPhotos;
      globalPhotoCache[albumId][currentPage + 1] = nextPagePhotos;
      setHasMore(nextPagePhotos.length > 0);
    } else {
      globalPhotoCache[albumId][currentPage] = currentPhotos;
      setHasMore(true);
    }

    setPhotos(currentPhotos);
    setSelectedPhoto(null);
  };

  const updatePhoto = async (id, updatedData) => {
    const updatedList = photos.map((photo) =>
      photo.id === id ? { ...photo, ...updatedData } : photo
    );
    setPhotos(updatedList);
    globalPhotoCache[albumId][currentPage] = updatedList;

    await update("photos", id, updatedData);
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate(`/home/users/${userId}/albums`)} className={styles.backButton}>
        ← Back to Albums
      </button>

      <h2 className={styles.title}>Photos from Album {albumId}</h2>

      <div className={styles.grid}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={styles.card}
            onDoubleClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.url || photo.thumbnailUrl}
              alt={photo.title}
              className={styles.image}
            />
            <p className={styles.caption}>{photo.title}</p>
          </div>
        ))}
      </div>

      <div className={styles.addPhotoContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Photo title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Photo URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button className={styles.addButton} onClick={addPhoto}>
          Add Photo
        </button>
      </div>

      <div className={styles.paginationWrapper}>
        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            ← Previous
          </button>
          <span>Page {currentPage}</span>
          <button onClick={handleNext} disabled={!hasMore}>
            Next →
          </button>
        </div>
      </div>

      <PhotoPopup
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onSave={updatePhoto}
        onDelete={deletePhoto}
      />
    </div>
  );
}
