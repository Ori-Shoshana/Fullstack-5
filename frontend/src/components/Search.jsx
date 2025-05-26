import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../css/Components/Search.module.css';
import ClearButton from './buttons/Clear';
import { search } from '../api/crudService';

export default function Search(props) {
  const {
    resource, setResults, userId,
    searchBy, setSearchBy,
    searchQuery, setSearchQuery,
    searchParams, setSearchParams,
    cachedData, setSortBy
  } = props;

  useEffect(() => {
    if (!searchParams?.query?.trim()) return;

    let query = `?userId=${userId}`;

    if (resource === 'todos'){
      if(searchParams.by === 'completed') {
        query += `&completed=true`;
        query += `&title_like=${searchParams.query}`;
      } 
      else if(searchParams.by === 'uncompleted'){
        query += `&completed=false`;
        query += `&title_like=${searchParams.query}`;
      }
    }
    if (searchParams.by === 'id') {
      query += `&id=${searchParams.query}`;
    } else if(searchParams.by === 'title'){
      query += `&title_like=${searchParams.query}`;
    }

    search(resource, query)
      .then((data) => setResults(data))
      .catch((err) => console.error('Search error:', err));
  }, [searchParams, resource, userId, setResults]);

  const handleSearchClick = () => {
    if (!searchQuery.trim()) return;
    setSearchParams({
      query: searchQuery.trim(),
      by: searchBy
    });
    setSearchQuery('');
    setSortBy && setSortBy('None'); 
  };

  const handleClearClick = () => {
    setSearchQuery('');
    setSearchBy('title');
    setSortBy && setSortBy('None'); 
    if (cachedData?.length > 0) {
      setResults(cachedData);
    }
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
        {resource === 'todos' && <option value="uncompleted">Search by Unompletion</option>}
      </select>

      <input
        className={styles.input}
        type="text"
        placeholder={`Search by ${searchBy || '...'}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button className={styles.searchButton} onClick={handleSearchClick}>
        Search
      </button>

      <ClearButton onClear={handleClearClick} />
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
  setSearchParams: PropTypes.func.isRequired,
  cachedData: PropTypes.array.isRequired,
  setSortBy: PropTypes.func
};
