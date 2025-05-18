import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/Photos.module.css'; // ודא שהנתיב תואם למיקום הקובץ שלך

export default function PhotosPage() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/photos?albumId=${albumId}`)
      .then((res) => setPhotos(res.data))
      .catch((err) => {
        console.error('Failed to load photos:', err);
        alert('Error loading photos');
      });
  }, [albumId]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back to Albums
      </button>

      <h2 className={styles.title}>Photos from Album {albumId}</h2>

      <div className={styles.grid}>
        {photos.slice(0, visibleCount).map((photo) => (
          <div key={photo.id} className={styles.card}>
            <img
              src={photo.url || photo.thumbnailUrl}
              alt={photo.title}
              className={styles.image}
            />
            <p className={styles.caption}>{photo.title}</p>
          </div>
        ))}
      </div>

      {visibleCount < photos.length && (
        <button className={styles.loadMore} onClick={handleLoadMore}>
          Load More Photos
        </button>
      )}
    </div>
  );
}
