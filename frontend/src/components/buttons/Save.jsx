import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Components/Buttons.module.css";

export default function Save(prop) {
const { onClick } = prop;
  return (
    <button className={styles.btn} onClick={onClick} type="button">
      Save
    </button>
  );
}

Save.propTypes = {
  onClick: PropTypes.func.isRequired,
};
