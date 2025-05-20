import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "../../css/Todos/Todos.module.css";
import TodoPopup from "./TodoPopup";
import TodoListDisplay from "./TodoListDisplay";
import Search from "../../components/Search";
import { getAll, create, update, remove } from "../../api/crudService";


export default function Todos() {
  const user = JSON.parse(localStorage.getItem('activeUser'));
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  
  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getAll("todos", user.id);
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const addTodo = useCallback(async () => {
    if (title.trim() === "") return;
    const newTodo = await create("todos", {
      userId: user.id,
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

  const [searchParams, setSearchParams] = useState(null);

  const handleSearchClick = useCallback(() => {
    if (!searchQuery.trim()) return;

    setSearchParams({
      query: searchQuery.trim(),
      by: searchBy
    });
  }, [searchQuery, searchBy, todos]);

  const handleClearSearch = useCallback(async () => {
    setSearchQuery("");
    setSearchBy("title");
    const allTodos = await getAll("todos", user.id);
    setTodos(allTodos);
  }, []);
  
    
  
  return (
    <>
      <div className={styles["header-container"]}>
        <h1>My To-Do List</h1>

        <Search
          resource="todos"
          userId={user.id}
          setResults={setTodos}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchParams={searchParams}
          onSearch={handleSearchClick}
          onClear={handleClearSearch}
        />


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

      <TodoListDisplay
        todos={todos}
        selectedTodo={selectedTodo}
        onToggleDone={toggleDone}
        onDoubleClick={handleDoubleClick}
      />


      <TodoPopup
        todo={selectedTodo}
        onClose={closePopup}
        onSave={updateTodoTitle}             
        onDelete={deleteTodo}
      />
    </>
  );
}

