import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/Components/Buttons/Clear.module.css';

export default function ClearButton({ onClear }) {
  return (
    <button className={styles.clearButton} onClick={onClear}>
      Clear
    </button>
  );
}

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired
};
