import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos/TodoItem.module.css";

export default function TodoItem(props) {
  const { todo, onToggleDone, onDoubleClick } = props;
  console.log("Rendering:", todo.id); // helpful debug

  return (
    <div
      className={`${styles["todo-item"]} ${todo.completed ? styles.completed : ""}`}
      onDoubleClick={() => onDoubleClick(todo)}
    >
      <span className={styles.todoId}>{todo.id}:</span>
      <span className={styles["todo-text"]} title={todo.title}>
        {todo.title}
      </span>

      <div>
        <span
          className={`${styles.circle} ${todo.completed ? styles.filled : ""}`}
          onClick={() => onToggleDone(todo.id)}
        ></span>
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
  onToggleDone: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};
