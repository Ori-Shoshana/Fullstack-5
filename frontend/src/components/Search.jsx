import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from '../css/Search.module.css';

export default function Search({
  resource,
  setResults,
  userId,
  searchBy,
  setSearchBy,
  searchQuery,
  setSearchQuery
}) {
  const handleSearch = () => {
    const baseUrl = `http://localhost:3000/${resource}`;
    let query = `?userId=${userId}`;

    if (!searchQuery.trim()) {
      alert('Please enter a search value');
      return;
    }

    if (resource === 'todos' && searchBy === 'completed') {
      query += `&completed=${searchQuery.trim()}`;
    } else {
      if (searchBy === 'id') {
        query += `&id=${searchQuery.trim()}`;
      } else {
        query += `&${searchBy}=${searchQuery.trim()}`;
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

      <input
        className={styles.input}
        type="text"
        placeholder={`Search by ${searchBy || '...'}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

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
  searchBy: PropTypes.string.isRequired,
  setSearchBy: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired
};
