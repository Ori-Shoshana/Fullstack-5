import React from 'react';
import styles from '../../css/Posts/PostInfoPopup.module.css';

export default function PostInfoPopup({ post, onClose, onShowComments }) {
  if (!post) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h3>{post.title}</h3>
        <p>{post.body}</p>

        <button className={styles.commentsButton} onClick={onShowComments}>
          show comments        </button>
      </div>
    </div>
  );
}
