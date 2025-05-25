import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Photos/Photos.module.css';

export default function AddPhotoForm({ title, url, setTitle, setUrl, onAdd }) {
  return (
    <div className={styles.addPhotoContainer}>
      <input
        className={styles.input}
        type="text"
        placeholder="Photo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Photo URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className={styles.addButton} onClick={onAdd}>
        Add Photo
      </button>
    </div>
  );
}

AddPhotoForm.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};
