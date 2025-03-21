import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuthStore from "../stores/authStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

// Define the Todo type
interface Todo {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in progress" | "completed";
}

const TodoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ✅ Fetch todo details
  const { data: todo, error, isLoading } = useQuery<Todo>({
    queryKey: ["todo", id],
    queryFn: async () => {
      if (!id || !token) throw new Error("Invalid request");
      const res = await axios.get<Todo>(`/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id && !!token,
  });

  // ✅ Update todo status
  const updateTodoMutation = useMutation({
    mutationFn: async (updatedTodo: Partial<Todo>) => {
      if (!token) throw new Error("Unauthorized");
      const res = await axios.put<Todo>(`/todos/${id}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => navigate("/"),
    onError: (err: Error) => setErrorMessage(err.message || "Failed to update todo"),
  });

  // ✅ Delete todo
  const deleteTodoMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Unauthorized");
      await axios.delete(`/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => navigate("/"),
    onError: (err: Error) => setErrorMessage(err.message || "Failed to delete todo"),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !todo) return <p>Error: {error?.message || "Todo not found."}</p>;

  return (
    <div className="todo-details-container">
      <div className="todo-card">
        <h2>{todo.title}</h2>
        <p className="description">{todo.description}</p>
        <p className={`status ${todo.status.replace(" ", "-")}`}>Status: {todo.status}</p>

        <div className="buttons">
          <button
            onClick={() => updateTodoMutation.mutate({ status: "completed" })}
            disabled={updateTodoMutation.isPending}
            className="complete-btn"
          >
            {updateTodoMutation.isPending ? "Updating..." : "Mark as Completed"}
          </button>

          <button
            onClick={() => deleteTodoMutation.mutate()}
            disabled={deleteTodoMutation.isPending}
            className="delete-btn"
          >
            {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
          </button>

          <button onClick={() => navigate("/")} className="back-btn">
            Back to Todo List
          </button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <style>{`
        /* 🔵 General Styling */
        .todo-details-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #007bff, #6610f2);
          padding: 20px;
        }

        /* 🔵 Card Styling */
        .todo-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 400px;
          width: 100%;
          animation: fadeIn 0.5s ease-in-out;
        }

        .todo-card h2 {
          font-size: 22px;
          color: #333;
          margin-bottom: 10px;
        }

        .description {
          font-size: 16px;
          color: #555;
          margin-bottom: 15px;
        }

        .status {
          font-weight: bold;
          margin-bottom: 20px;
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
        }

        /* 🔵 Status Colors */
        .status.todo {
          background: #ffcc00;
          color: #333;
        }
        .status.in-progress {
          background: #007bff;
          color: white;
        }
        .status.completed {
          background: #28a745;
          color: white;
        }

        /* 🔵 Buttons */
        .buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .buttons button {
          padding: 10px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .complete-btn {
          background: #28a745;
          color: white;
        }

        .complete-btn:hover {
          background: #218838;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .back-btn {
          background: #6c757d;
          color: white;
        }

        .back-btn:hover {
          background: #5a6268;
        }

        /* 🔵 Error Message */
        .error {
          color: red;
          font-weight: bold;
          margin-top: 10px;
        }

        /* 🔵 Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TodoDetails;
