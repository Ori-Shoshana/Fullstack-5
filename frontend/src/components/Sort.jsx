import React from 'react';
import PropTypes from 'prop-types';
import styles from '../css/Components/Sort.module.css';

export default function Sort({ sortBy, setSortBy }) {
  return (
    <div>
      <select
        className={styles.select}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort By None</option>
        <option value="title">Sort By Title</option>
        <option value="id">Sort By ID</option>
        <option value="completed">Sort By Completed</option>
        <option value="uncompleted">Sort By Uncompleted</option>
      </select>
    </div>
  );
}

Sort.propTypes = {
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired
};
