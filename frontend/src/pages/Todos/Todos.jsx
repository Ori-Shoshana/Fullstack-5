import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "../../css/Todos.module.css";
import TodoPopup from "./TodoPopup";
import TodoItem from "./TodoItem";
import { getAll, create, update, remove } from "../../api/crudService";

//I need to work on searchQuery, and check if its still neccesery here, in 70, etc...

export default function TodoApp() {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getAll("todos");
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const addTodo = useCallback(async () => {
    if (title.trim() === "") return;
    const newTodo = await create("todos", {
      userId: 1,
      title: title.trim(),
      completed: false,
    });
    setTodos((prev) => [...prev, newTodo]);
    setTitle("");
  }, [title]);

  const updateTodoTitle = useCallback(async (id, newTitle) => {
    setTodos((prev) => {
      const todoToUpdate = prev.find((todo) => todo.id === id);
      if (!todoToUpdate) return prev;
      const updatedTodo = { ...todoToUpdate, title: newTitle };
      update("todos", id, updatedTodo); // Don't await to avoid stalling
      return prev.map((todo) => (todo.id === id ? updatedTodo : todo));
    });
  }, []);

  // ensures that the same function instance is passed to each TodoItem
  const deleteTodo = useCallback(async (id) => {
    await remove("todos", id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleDone = useCallback(async (id) => {
    setTodos((prev) => {
      const todo = prev.find((t) => t.id === id);
      if (!todo) return prev;
      const updatedTodo = { ...todo, completed: !todo.completed };
      update("todos", id, updatedTodo);
      return prev.map((t) => (t.id === id ? updatedTodo : t));
    });
  }, []);

  const handleDoubleClick = useCallback((todo) => {
    setSelectedTodo(todo);
  }, []);

  const closePopup = useCallback(() => {
    setSelectedTodo(null);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todos, searchQuery]);

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              <MemoizedTodoItem
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
        onSave={updateTodoTitle}
      />
    </>
  );
}

//Only re-render TodoItem if its props actually changed
const MemoizedTodoItem = React.memo(TodoItem);
