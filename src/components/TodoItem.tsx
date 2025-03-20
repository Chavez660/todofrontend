import { useNavigate } from 'react-router-dom';

interface TodoItemProps {
  todo: { id: string; title: string };
  onClick: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onClick }) => {
  const navigate = useNavigate();

  return (
    <li
      className="p-2 border-b cursor-pointer hover:bg-gray-100"
      onClick={() => {
        onClick();
        navigate(`/details/${todo.id}`);
      }}
    >
      {todo.title}
    </li>
  );
};

export default TodoItem;
