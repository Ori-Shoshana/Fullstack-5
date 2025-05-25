import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Comments/Comments.module.css';

export default function CommentList({ comments, currentUser, onEdit, onDelete }) {
  if (comments.length === 0) {
    return <p className={styles.noResults}>No comments yet.</p>;
  }

  return (
    <ul className={styles.commentList}>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <h4>{comment.name} ({comment.email})</h4>
            {comment.email === currentUser.email && (
              <div>
                <button
                  onClick={() => onEdit(comment)}
                  className={styles.editButton}
                  title="Edit comment"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className={styles.deleteButton}
                  title="Delete comment"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          <p>{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
