import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos.module.css";

export default function TodoItem({ todo, onDelete, onToggleDone, onDoubleClick }) {
  return (
    <div
      className={`${styles["todo-item"]} ${todo.completed ? styles.completed : ""}`}
      onDoubleClick={() => onDoubleClick(todo)}
    >
      <span className={styles["todo-text"]} title={todo.text}>
        {todo.text}
      </span>
      <div>
        <button className={styles.done} onClick={() => onToggleDone(todo.id)} type="button">
          {todo.completed ? "Undo" : "Done"}
        </button>
        <button className={styles.delete} onClick={() => onDelete(todo.id)} type="button">
          Delete
        </button>
      </div>
    </div>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};
