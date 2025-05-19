import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/Photos.module.css'; // ודא שקיים

export default function PhotosPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // כדי לדעת אם יש עוד עמודים

  const PHOTOS_PER_PAGE = 5;

  useEffect(() => {
      const url = `http://localhost:3000/photos?albumId=${albumId}&_page=${currentPage}&_limit=${PHOTOS_PER_PAGE}`;
  console.log("➡️ FETCHING:", url);
    axios
      .get(`http://localhost:3000/photos?albumId=${albumId}&_page=${currentPage}&_limit=${PHOTOS_PER_PAGE}`)
      .then((res) => {
        setPhotos(res.data);
        setHasMore(res.data.length === PHOTOS_PER_PAGE); // אם חזרו פחות מ־5 – זה העמוד האחרון
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

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back to Albums
      </button>

      <h2 className={styles.title}>Photos from Album {albumId}</h2>

      <div className={styles.grid}>
        {photos.map((photo) => (
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
  );
}
