import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/Albums/AlbumList.module.css';
import Delete from '../../components/buttons/Delete';

export default function AlbumList(props) {
  const { albums, onDelete }  = props;

  const navigate = useNavigate();

  if (albums.length === 0) {
    return <p className={styles.noResults}>No matching albums found.</p>;
  }

  return (
    <ul className={styles.cardList}>
      {albums.map((album) => (
        <li key={album.id} className={styles.cardItem}>
          <div className={styles.cardWrapper}>
            <div
              className={styles.card}
              onClick={() => navigate(`${album.id}/photos`)}
            >
              <h3>Album #{album.id}</h3>
              <p>{album.title}</p>
            </div>
            <div className={styles.deleteWrapper}>
              <Delete onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking Delete
                onDelete(album.id);
              }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

AlbumList.propTypes = {
  albums: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired
};
