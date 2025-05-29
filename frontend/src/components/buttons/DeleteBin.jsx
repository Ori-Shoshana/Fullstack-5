import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Components/Buttons/DeleteBin.module.css';

export default function DeleteBin({ onClick, title = 'Delete' }) {
  return (
    <button
      onClick={onClick}
      className={styles.deleteButton}
      title={title}
      type="button"
    >
      🗑️
    </button>
  );
}

DeleteBin.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};
