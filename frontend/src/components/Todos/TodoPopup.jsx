import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos.module.css";

export default function TodoPopup({ todo, onClose, onSave }) {
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    if (todo) {
      setEditedText(todo.text);
    }
  }, [todo]);

  if (!todo) return null;

  const handleSave = () => {
    const trimmedText = editedText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onSave(todo.id, trimmedText);
    }
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles["popup-content"]}>
        <h2>Edit Task</h2>
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
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
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
