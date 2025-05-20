import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Components/Buttons.module.css";

export default function Delete(props) {
  const { onClick } = props;
  return (
    <button className={styles.delete} onClick={onClick} type="button">
      Delete
    </button>
  );
}

Delete.propTypes = {
  onClick: PropTypes.func.isRequired,
};
