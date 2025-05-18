import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from '../css/Search.module.css';

export default function Search({ resource, setResults, userId }) {
  const [completedFilter, setCompletedFilter] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const baseUrl = `http://localhost:3000/${resource}`;
    let query = `?userId=${userId}`;

    if (resource === 'todos') {
      if (searchBy === 'completed') {
        if (completedFilter !== '') {
          query += `&completed=${completedFilter}`;
        }
      } else {
        if (!searchQuery.trim()) return;
        if (searchBy === 'id') {
          query += `&id=${searchQuery.trim()}`;
        } else {
          query += `&${searchBy}_like=${searchQuery.trim()}`;
        }
      }
    } else {
      if (!searchQuery.trim()) return;
      if (searchBy === 'id') {
        query += `&id=${searchQuery.trim()}`;
      } else {
        query += `&${searchBy}_like=${searchQuery.trim()}`;
      }
    }

    axios
      .get(baseUrl + query)
      .then((res) => setResults(res.data))
      .catch((err) => console.error('Search error:', err));
  };

  return (
    <div className={styles.searchControls}>
      <select
        className={styles.select}
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
      >
        <option value="title">Search by Title</option>
        <option value="id">Search by Id</option>
        {resource === 'todos' && <option value="completed">Search by Completion</option>}
      </select>

      {resource === 'todos' && searchBy === 'completed' ? (
        <select
          className={styles.select}
          value={completedFilter}
          onChange={(e) => setCompletedFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Not Completed</option>
        </select>
      ) : (
        <input
          className={styles.input}
          type="text"
          placeholder={`Search by ${searchBy || '...'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      <button className={styles.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

Search.propTypes = {
    setResults: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
