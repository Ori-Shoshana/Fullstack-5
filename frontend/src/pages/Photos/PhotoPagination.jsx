import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Photos/Pagination.module.css';

export default function PhotoPagination(props) {
  const { page, onPrev, onNext, disablePrev, disableNext } = props;
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pagination}>
        <button onClick={onPrev} disabled={disablePrev}>← Previous</button>
        <span>Page {page}</span>
        <button onClick={onNext} disabled={disableNext}>Next →</button>
      </div>
    </div>
  );
}

PhotoPagination.propTypes = {
  page: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  disablePrev: PropTypes.bool.isRequired,
  disableNext: PropTypes.bool.isRequired,
};
