import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from '../../css/Photos/PhotoPopup.module.css';
import Save from "../../components/buttons/Save";
import Cancel from "../../components/buttons/Cancel";
import Delete from "../../components/buttons/Delete";

export default function PhotoPopup({ photo, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      setUrl(photo.url || photo.thumbnailUrl);
    }
  }, [photo]);

  if (!photo) return null;

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    if (
      trimmedTitle &&
      trimmedUrl &&
      (trimmedTitle !== photo.title || trimmedUrl !== photo.url)
    ) {
      onSave(photo.id, {
        title: trimmedTitle,
        url: trimmedUrl,
        thumbnailUrl: trimmedUrl,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(photo.id);
  };

  return (
    <div className={styles.popup}>
      <div className={styles["popup-content"]}>
        <h2>Edit Photo</h2>
        <input
          type="text"
          value={title}
          placeholder="Photo title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={url}
          placeholder="Photo URL"
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className={styles.buttonRow}>
          <Save onClick={handleSave} />
          <Cancel onClick={onClose} />
          {onDelete && <Delete onClick={handleDelete} />}
        </div>

      </div>
    </div>
  );
}

PhotoPopup.propTypes = {
  photo: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
