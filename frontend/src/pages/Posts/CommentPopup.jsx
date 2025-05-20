import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos/TodoPopup.module.css";
import Save from "../../components/buttons/Save";
import Cancel from "../../components/buttons/Cancel";

export default function CommentPopup({ comment, onClose, onSave }) {
  const [body, setBody] = useState("");

  useEffect(() => {
    if (comment) setBody(comment.body);
  }, [comment]);

  if (!comment) return null;

  const handleSave = () => {
    const trimmed = body.trim();
    if (trimmed && trimmed !== comment.body) {
      onSave(comment.id, { ...comment, body: trimmed });
    }
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles["popup-content"]}>
        <h2>Edit Comment</h2>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Comment body"
        />
        <Save onClick={handleSave} />
        <Cancel onClick={onClose} />
      </div>
    </div>
  );
}

CommentPopup.propTypes = {
  comment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
