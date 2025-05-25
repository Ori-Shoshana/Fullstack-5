import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../css/BackButton.module.css';

export default function BackButton({ to, label = 'Back' }) {
  const navigate = useNavigate();

  return (
    <button className={styles.backButton} onClick={() => navigate(to)}>
      ← {label}
    </button>
  );
}

BackButton.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string,
};
