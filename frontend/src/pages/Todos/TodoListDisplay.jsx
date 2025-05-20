import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/Todos/Todos.module.css";
import TodoItem from "./TodoItem";

//Only re-render TodoItem if its props actually changed
const MemoizedTodoItem = React.memo(TodoItem);

export default function TodoListDisplay(props) {
  const { todos, selectedTodo, onToggleDone, onDoubleClick } = props;
  return (
    <div className={`${styles.wrapper} ${selectedTodo ? styles.noscroll : ""}`}>
      <div className={styles.todoListContainer}>
        <div id="todoList">
          {todos.length === 0 ? (
            <p>No matching tasks found.</p>
          ) : (
            todos.map((todo) => (
              <MemoizedTodoItem
                key={todo.id}
                todo={todo}
                onToggleDone={onToggleDone}
                onDoubleClick={onDoubleClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

TodoListDisplay.propTypes = {
  todos: PropTypes.array.isRequired,
  selectedTodo: PropTypes.object,
  onToggleDone: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};
