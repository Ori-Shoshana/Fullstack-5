import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../css/Components/Add.module.css";

export default function Add({ onAdd, placeholder, type }) {
  const [title, setTitle] = useState("");

  const handleAddClick = () => {
    if (title.trim() === "") return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddClick();
        }}
      />
      <button onClick={handleAddClick} type="button">
        Add {type}
      </button>
    </div>
  );
}

Add.propTypes = {
  onAdd: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};