import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PhotosPage() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/photos?albumId=${albumId}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => {
        console.error('Failed to load photos:', err);
        alert('Error loading photos');
      });
  }, [albumId]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Back to Albums
      </button>
      <h2>Photos from Album {albumId}</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {photos.slice(0, visibleCount).map((photo) => (
          <div key={photo.id} style={{ width: '200px', textAlign: 'center' }}>
            <img
              src={photo.url || photo.thumbnailUrl}
              alt={photo.title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <p style={{ fontSize: '14px', marginTop: '5px' }}>{photo.title}</p>
          </div>
        ))}
      </div>

      {visibleCount < photos.length && (
        <button onClick={handleLoadMore} style={{ marginTop: '2rem' }}>
          Load More Photos
        </button>
      )}
    </div>
  );
}
