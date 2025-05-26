import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Components/Buttons/Buttons.module.css";

export default function Cancel(prop) {
  const { onClick } = prop;
  return (
    <button className={styles.btn} onClick={onClick} type="button">
      Cancel
    </button>
  );
}

Cancel.propTypes = {
  onClick: PropTypes.func.isRequired,
};
