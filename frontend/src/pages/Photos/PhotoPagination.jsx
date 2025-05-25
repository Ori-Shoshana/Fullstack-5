import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Photos/Photos.module.css';

export default function PhotoPagination({ page, hasMore, onPrev, onNext }) {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pagination}>
        <button onClick={onPrev} disabled={page === 1}>← Previous</button>
        <span>Page {page}</span>
        <button onClick={onNext} disabled={!hasMore}>Next →</button>
      </div>
    </div>
  );
}

PhotoPagination.propTypes = {
  page: PropTypes.number.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
