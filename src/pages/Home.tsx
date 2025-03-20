import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import API from "../api/axios";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await API.get("/todos", { headers: { Authorization: `Bearer ${token}` } });
        setTodos(res.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    if (token) fetchTodos();
  }, [token]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const res = await API.post(
        "/todos",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([res.data, ...todos]); // Add new todo to list
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Todos</h1>

      <form onSubmit={handleCreateTodo}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Todo"}</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => navigate(`/todo/${todo.id}`)}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
