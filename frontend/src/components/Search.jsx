import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from '../css/Components/Search.module.css';

export default function Search(props) {
  const { resource, setResults, userId, searchBy, setSearchBy, searchQuery, setSearchQuery, searchParams, onSearch, onClear } = props;

  useEffect(() => {
    if (!searchParams?.query) return;

    const baseUrl = `http://localhost:3000/${resource}`;
    let query = `?userId=${userId}`;

    if (resource === 'todos' && searchParams.by === 'completed') {
      query += `&completed=true`;
      query += `&title=${searchParams.query}`;
    } else if (searchParams.by === 'id') {
      query += `&id=${searchParams.query}`;
    } else {
      query += `&${searchParams.by}=${searchParams.query}`;
    }

    axios
      .get(baseUrl + query)
      .then((res) => setResults(res.data))
      .catch((err) => console.error('Search error:', err));
  }, [searchParams, resource, userId, setResults]);

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

      <button className={styles.searchButton} onClick={onSearch}>
        Search
      </button>

      <button className={styles.clearButton} onClick={onClear}>
        Clear
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
  setSearchQuery: PropTypes.func.isRequired,
  searchParams: PropTypes.shape({
    query: PropTypes.string,
    by: PropTypes.string
  }).isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
};
