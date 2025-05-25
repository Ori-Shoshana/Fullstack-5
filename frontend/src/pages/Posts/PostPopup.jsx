import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos/TodoPopup.module.css";
import Save from "../../components/buttons/Save";
import Cancel from "../../components/buttons/Cancel";
import Delete from "../../components/buttons/Delete";

export default function PostPopup({ post, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  if (!post) return null;

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (
      trimmedTitle &&
      trimmedBody &&
      (trimmedTitle !== post.title || trimmedBody !== post.body)
    ) {
      onSave(post.id, {
        title: trimmedTitle,
        body: trimmedBody,
        userId: post.userId,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles["popup-content"]}>
        <h2>Edit Post</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Post body"
          className={styles.input}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Save onClick={handleSave} />
        <Cancel onClick={onClose} />
        {onDelete && post.id && <Delete onClick={handleDelete} />}
      </div>
    </div>
  );
}

PostPopup.propTypes = {
  post: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
