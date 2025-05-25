import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Photos/Photos.module.css';

export default function PhotoGrid({ photos, onSelect }) {
  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={styles.card}
          onDoubleClick={() => onSelect(photo)}
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
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
