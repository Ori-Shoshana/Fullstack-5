import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Comments/Comments.module.css';

export default function AddCommentForm({ value, onChange, onSubmit }) {
  return (
    <div className={styles.commentForm}>
      <textarea
        className={styles.input}
        placeholder="Add a comment..."
        value={value}
        onChange={onChange}
      />
      <button onClick={onSubmit} className={styles.submitButton}>
        Submit Comment
      </button>
    </div>
  );
}

AddCommentForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
