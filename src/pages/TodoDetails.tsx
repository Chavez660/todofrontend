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
    <div>
      <h2>{todo.title}</h2>
      <p>{todo.description}</p>
      <p>Status: {todo.status}</p>

      <button onClick={() => updateTodoMutation.mutate({ status: "completed" })} disabled={updateTodoMutation.isPending}>
        {updateTodoMutation.isPending ? "Updating..." : "Mark as Completed"}
      </button>

      <button onClick={() => deleteTodoMutation.mutate()} disabled={deleteTodoMutation.isPending}>
        {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
      </button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default TodoDetails;
