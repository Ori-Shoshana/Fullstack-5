import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos/TodoPopup.module.css";
import Delete from "../../components/buttons/Delete";
import Save from "../../components/buttons/Save";
import Cancel from "../../components/buttons/Cancel";

export default function TodoPopup(props) {
  const { todo, onClose, onSave, onDelete } = props;
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
        <textarea
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
          <Save onClick={handleSave} />
          <Cancel onClick={onClose} />
          <Delete onClick={() => {onDelete(todo.id); onClose();}} />
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
  onDelete: PropTypes.func.isRequired,
};
