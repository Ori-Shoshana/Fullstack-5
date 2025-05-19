import React, { useState } from "react";
import styles from "../../css/Todos.module.css";
import TodoPopup from "./TodoPopup";
import TodoItem from "./TodoItem";

export default function TodoApp() {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState([
    { id: 1, text: "Finish React project", deadline: "2025-05-15", completed: false },
    { id: 2, text: "Buy groceries", deadline: "2025-05-10", completed: true },
    { id: 3, text: "Read a book", deadline: "2025-05-20", completed: false },
    { id: 4, text: "Exercise for 30 mins", deadline: "", completed: false },
    { id: 5, text: "Call mom", deadline: "2025-05-17", completed: true },
    { id: 6, text: "Clean the house", deadline: "2025-05-18", completed: false },
    { id: 7, text: "Prepare presentation", deadline: "2025-05-14", completed: false },
    { id: 8, text: "Plan weekend trip", deadline: "", completed: false },
    { id: 9, text: "Pay bills", deadline: "2025-05-11", completed: true },
    { id: 10, text: "Write blog post", deadline: "2025-05-19", completed: false },
  ]);

  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDoubleClick = (todo) => setSelectedTodo(todo);
  const closePopup = () => setSelectedTodo(null);

  const addTodo = () => {
    if (text.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), completed: false }]);
    setText("");
  };

  const updateTodoText = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));
  const toggleDone = (id) => setTodos(todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));

  const filteredTodos = todos.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className={styles["header-container"]}>
        <h1>My To-Do List</h1>

        <div className={styles["search-container"]}>
          <div className={styles["input-box"]}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.btn} type="button">Search</button>
          </div>
        </div>

        <div className={styles["todo-container"]}>
          <div className={styles["input-box"]}>
            <input
              type="text"
              placeholder="Add a new task"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className={styles.btn} onClick={addTodo} type="button">Add Task</button>
          </div>
        </div>
      </div>

      <div className={`${styles.wrapper} ${styles["todo-active"]} ${selectedTodo ? styles.noscroll : ""}`}>
        <div className={styles.todoListContainer}>
          <div id="todoList">
            {filteredTodos.length === 0 && <p>No matching tasks found.</p>}
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggleDone={toggleDone}
                onDoubleClick={handleDoubleClick}
              />
            ))}
          </div>
        </div>
      </div>

      <TodoPopup
        todo={selectedTodo}
        onClose={closePopup}
        onSave={updateTodoText}
      />

    </>
  );
}
