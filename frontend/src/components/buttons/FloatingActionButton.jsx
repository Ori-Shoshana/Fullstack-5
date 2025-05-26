import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Components/Buttons/FloatingActionButton.module.css";

export default function FloatingActionButton(props) {
  const { title, onClick, label = "＋" } = props;
  return (
    <button
      className={styles.fab}
      title={title}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

FloatingActionButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};
