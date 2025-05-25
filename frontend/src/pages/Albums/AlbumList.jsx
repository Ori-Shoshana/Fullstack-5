import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Albums/Albums.module.css';

export default function AlbumList({ albums }) {
  const navigate = useNavigate();

  if (albums.length === 0) {
    return <p className={styles.noResults}>No matching albums found.</p>;
  }

  return (
    <ul className={styles.cardList}>
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
  );
}

AlbumList.propTypes = {
  albums: PropTypes.array.isRequired
};
