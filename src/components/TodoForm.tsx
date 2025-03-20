import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in progress' | 'completed';
}

interface TodoFormProps {
  onAdd: (newTodo: Todo) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      const res = await api.post<Todo>('/todos', { title, description, status: 'todo' });
      return res.data;
    },
    onSuccess: (newTodo: Todo) => {
      queryClient.setQueryData<Todo[]>(['todos'], (oldTodos = []) => [...oldTodos, newTodo]);
      onAdd(newTodo);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addTodoMutation.mutate({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title"
        className="block w-full p-2 border rounded mb-2"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Todo description"
        className="block w-full p-2 border rounded mb-2"
        required
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;