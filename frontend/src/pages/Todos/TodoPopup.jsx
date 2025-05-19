import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos.module.css";

export default function TodoPopup({ todo, onClose, onSave }) {
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    if (todo) {
      setEditedTitle(todo.title);
    }
  }, [todo]);

  if (!todo) return null;

  const handleSave = () => {
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle && trimmedTitle !== todo.title) {
      onSave(todo.id, trimmedTitle);
    }
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles["popup-content"]}>
        <h2>Edit Task</h2>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={handleSave}>Save</button>
          <button className={styles.btn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

TodoPopup.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
