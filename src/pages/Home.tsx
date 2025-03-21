import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import API from "../api/axios";

interface User {
  firstName: string;
  lastName: string;
}

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user?: User;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [todosLoading, setTodosLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // ✅ Fetch Todos & User Details
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setTodosLoading(true);
        setError(null);

        const res = await API.get<Todo[]>("/todos", { headers: { Authorization: `Bearer ${token}` } });
        setTodos(res.data);

        const userRes = await API.get<User>("/user/me", { headers: { Authorization: `Bearer ${token}` } });
        setUser(userRes.data);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setTodosLoading(false);
      }
    };

    if (token) fetchTodos();
  }, [token]);

  // ✅ Handle Creating a New Todo
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await API.post<Todo>("/todos", { title, description }, { headers: { Authorization: `Bearer ${token}` } });
      setTodos([res.data, ...todos]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Failed to create todo. Please try again.");
      console.error("Error creating todo:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* 🔵 Logout Button (Top Right) */}
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      {/* 🔵 Welcome Box & Form Inside Card */}
      <div className="card">
        {user ? (
          <div className="welcome-box">
            <h2>Welcome</h2>
            <h1>{user.firstName} {user.lastName}</h1>
            <p>Here's your list of tasks</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}

        {error && <p className="error-message">{error}</p>}

        {/* 🔵 Create Todo Form */}
        <form onSubmit={handleCreateTodo} className="todo-form">
          <input type="text" placeholder="Enter task title..." value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Enter task details..." value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button type="submit" disabled={loading} className="add-todo-btn">
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* 🔵 Todo List */}
      {todosLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="todo-list">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                onClick={() => navigate(`/todo/${todo.id}`)}
                className={`todo-item ${todo.status === "completed" ? "completed" : ""}`}
              >
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                {todo.user ? (
                  <small>By: {todo.user.firstName} {todo.user.lastName}</small>
                ) : (
                  <small>By: Unknown User</small>
                )}
              </li>
            ))
          ) : (
            <p className="no-todos">Nothing here yet. <span>Start your first task!</span></p>
          )}
        </ul>
      )}

      {/* 🔵 CSS Styling */}
      <style>{`
        /* 🔵 General Styling */
        .home-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 20px;
          background: linear-gradient(to right, #007bff, #6610f2);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* 🔵 Logout Button */
        .logout-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: #dc3545;
          color: white;
          padding: 8px 14px;
          font-size: 14px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .logout-btn:hover {
          background-color: #c82333;
        }

        /* 🔵 Card */
        .card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        /* 🔵 Welcome Box */
        .welcome-box h1 {
          margin: 5px 0;
          font-size: 24px;
          color: #333;
        }

        .welcome-box p {
          font-size: 16px;
          color: #555;
        }

        /* 🔵 Error Message */
        .error-message {
          color: red;
          font-weight: bold;
          margin-bottom: 15px;
        }

        /* 🔵 Todo Form */
        .todo-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .todo-form input, .todo-form textarea {
          width: 90%;
          max-width: 350px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .todo-form input:focus, .todo-form textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0px 0px 8px rgba(0, 123, 255, 0.3);
        }

        /* 🔵 Modern No Todos Message */
        .no-todos {
          font-size: 14px;
          font-weight: 500;
          color: white;
          margin-top: 20px;
          opacity: 0.8;
        }

        .no-todos span {
          font-weight: bold;
          color: white;
        }
      `}</style>
    </div>
  );
}
