import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;

    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newTodo = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
    setTitle("");
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });

    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  const handleToggle = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    const updatedTodo = await res.json();

    setTodos((prev) =>
      prev.map((todo) => (todo._id === id ? updatedTodo : todo))
    );
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="container">
      <div className="header">
        <h1>My Tasks</h1>
        <p>
          {completedCount}/{todos.length} Completed
        </p>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd}>+</button>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet ✨</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo._id} className="todo-item">
              <div
                className={`todo-title ${
                  todo.completed ? "completed" : ""
                }`}
                onClick={() => handleToggle(todo._id, todo.completed)}
              >
                {todo.title}
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDelete(todo._id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;