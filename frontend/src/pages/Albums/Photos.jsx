import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { create, remove, update, getByPage } from '../../api/crudService';
import styles from '../../css/Photos.module.css';
import PhotoPopup from './PhotoPopup';

export default function Photos() {
  const { albumId, userId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [photoCache, setPhotoCache] = useState({});

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const PHOTOS_PER_PAGE = 5;

  useEffect(() => {
    if (photoCache[currentPage]) {
      setPhotos(photoCache[currentPage]);
      setHasMore(photoCache[currentPage].length === PHOTOS_PER_PAGE);
      return;
    }

    const loadPhotos = async () => {
      try {
        const data = await getByPage('photos', 'albumId', albumId, currentPage, PHOTOS_PER_PAGE);
        setPhotos(data);
        setHasMore(data.length === PHOTOS_PER_PAGE);
        setPhotoCache((prev) => ({ ...prev, [currentPage]: data }));
      } catch (err) {
        console.error('Failed to load photos:', err);
        alert('Error loading photos');
      }
    };

    loadPhotos();
  }, [albumId, currentPage, photoCache]);

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

    setPhotos((prev) => [...prev, newPhoto]);
    setPhotoCache((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newPhoto]
    }));

    setNewTitle('');
    setNewUrl('');
  };

  const deletePhoto = async (id) => {
    // Delete the photo from the server
    await remove("photos", id);

    // Re-fetch the current page from the server (in case the photo was on it)
    const res1 = await getByPage("photos", "albumId", albumId, currentPage, PHOTOS_PER_PAGE);
    let currentPhotos = res1;

    // If the current page has less than PHOTOS_PER_PAGE photos after deletion
    // try to pull photos from the next page to fill it
    if (currentPhotos.length < PHOTOS_PER_PAGE) {
      const res2 = await getByPage("photos", "albumId", albumId, currentPage + 1, PHOTOS_PER_PAGE);
      let nextPagePhotos = res2;

      // Move photos from the next page to the current page until full or next page is empty
      while (currentPhotos.length < PHOTOS_PER_PAGE && nextPagePhotos.length > 0) {
        currentPhotos.push(nextPagePhotos.shift());
      }

      // Update the photo cache for both pages
      setPhotoCache((prev) => ({
        ...prev,
        [currentPage]: currentPhotos,
        [currentPage + 1]: nextPagePhotos,
      }));

      // Update hasMore based on whether there are any photos left in the next page
      setHasMore(nextPagePhotos.length > 0);
    } else {
      // If the current page is still full, just update the cache normally
      setPhotoCache((prev) => ({
        ...prev,
        [currentPage]: currentPhotos,
      }));
      setHasMore(true);
    }

    // Update the UI
    setPhotos(currentPhotos);
    setSelectedPhoto(null);
  };

  const updatePhoto = async (id, updatedData) => {
    const updatedList = photos.map((photo) =>
      photo.id === id ? { ...photo, ...updatedData } : photo
    );
    setPhotos(updatedList);
    setPhotoCache((prev) => ({
      ...prev,
      [currentPage]: updatedList
    }));

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

      <div className={styles.pagination}>
        <button onClick={handlePrev} disabled={currentPage === 1}>
          ← Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNext} disabled={!hasMore}>
          Next →
        </button>
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
