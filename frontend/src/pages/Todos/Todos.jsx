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
  const [cacheTodos, setCacheTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [searchParams, setSearchParams] = useState(null);
  
  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getAll("todos", user.id);
      setTodos(data);
      setCacheTodos(data);
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
    setCacheTodos((prev) => [...prev, newTodo]);
    setTitle("");
  }, [title]);


  const updateTodoTitle = useCallback(async (id, newTitle) => {
    const updater = (todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo;
  
    update("todos", id, { title: newTitle }); // fire and forget
  
    setTodos((prev) => prev.map(updater));
    setCacheTodos((prev) => prev.map(updater));
  }, []);
  

  // ensures that the same function instance is passed to each TodoItem
  const deleteTodo = useCallback(async (id) => {
    await remove("todos", id);
  
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setCacheTodos((prev) => prev.filter((todo) => todo.id !== id));
    console.log(cacheTodos);
  }, []);
  

  const toggleDone = useCallback(async (id) => {
    const toggle = (todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo;
  
    const updatedTodo = todos.find((t) => t.id === id);
    if (updatedTodo) {
      update("todos", id, { ...updatedTodo, completed: !updatedTodo.completed });
    }
  
    setTodos((prev) => prev.map(toggle));
    setCacheTodos((prev) => prev.map(toggle));
  }, [todos]);
  

  const handleDoubleClick = useCallback((todo) => {
    setSelectedTodo(todo);
  }, []);

  const closePopup = useCallback(() => {
    setSelectedTodo(null);
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
          setSearchParams={setSearchParams}
          cachedData={cacheTodos}
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

