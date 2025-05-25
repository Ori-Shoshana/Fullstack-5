import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Posts/Posts.module.css';
import { Info } from 'lucide-react';

export default function PostList({ posts, onEdit, onView }) {
  if (posts.length === 0) {
    return <p className={styles.noResults}>No posts found.</p>;
  }

  return (
    <ul className={styles.wrapper}>
      {posts.map((post) => (
        <li
          key={post.id}
          className={styles.item}
          onDoubleClick={() => onEdit(post)}
        >
          <div className={styles.preview}>
            <strong>Post #{post.id}</strong> – {post.title}
          </div>
          <div>
            <button
              className={styles.infoButton}
              onClick={() => onView(post)}
              title="View Info"
            >
              <Info size={18} strokeWidth={2} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};
