import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { create, remove, update } from '../../api/crudService';
import styles from '../../css/Photos.module.css';
import PhotoPopup from './PhotoPopup';

export default function Photos() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const PHOTOS_PER_PAGE = 5;

  useEffect(() => {
    const url = `http://localhost:3000/photos?albumId=${albumId}&_page=${currentPage}&_limit=${PHOTOS_PER_PAGE}`;
    axios
      .get(url)
      .then((res) => {
        setPhotos(res.data);
        setHasMore(res.data.length === PHOTOS_PER_PAGE);
      })
      .catch((err) => {
        console.error('Failed to load photos:', err);
        alert('Error loading photos');
      });
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

    setPhotos((prev) => [...prev, newPhoto]);
    setNewTitle("");
    setNewUrl("");
  };

  const deletePhoto = async (id) => {
    await remove("photos", id);
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const updatePhoto = async (id, updatedData) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, ...updatedData } : photo))
    );
    await update("photos", id, updatedData);
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
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
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation(); // למנוע פתיחת popup במחיקה
                deletePhoto(photo.id);
              }}
              title="Delete photo"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* הוספת תמונה */}
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
      />
    </div>
  );
}
