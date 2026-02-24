import React from 'react';
import { Todo } from '../types';
import { Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, status: 'pending' | 'completed') => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const isPending = todo.status === 'pending';

  return (
    <div className="flex items-start gap-3 p-4 bg-white border rounded-lg hover:shadow-md transition">
      <button
        onClick={() => onToggle(todo.id, isPending ? 'completed' : 'pending')}
        className="mt-1 flex-shrink-0"
      >
        {isPending ? (
          <Circle size={24} className="text-gray-400 hover:text-blue-500 transition" />
        ) : (
          <CheckCircle size={24} className="text-green-500" />
        )}
      </button>

      <div className="flex-grow">
        <h3
          className={`text-lg font-semibold ${
            isPending ? 'text-gray-900' : 'text-gray-500 line-through'
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
        )}
        {todo.due_date && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Calendar size={14} />
            Due: {new Date(todo.due_date).toLocaleDateString()}
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TodoItem;
