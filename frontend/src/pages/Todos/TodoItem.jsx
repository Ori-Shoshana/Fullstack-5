import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos.module.css";

export default function TodoItem(props) {
  const { todo, onDelete, onToggleDone, onDoubleClick } = props;
  console.log("Rendering:", todo.id); // helpful debug

  return (
    <div
      className={`${styles["todo-item"]} ${todo.completed ? styles.completed : ""}`}
      onDoubleClick={() => onDoubleClick(todo)}
    >
      <span className={styles["todo-text"]} title={todo.title}>
        {todo.title}
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
    userId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};
