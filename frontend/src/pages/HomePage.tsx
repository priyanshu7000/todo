import React from 'react';
import { useTodos } from '../hooks/useTodos';
import AddTodoForm from '../components/AddTodoForm';
import TodoItem from '../components/TodoItem';
import { CreateTodoInput } from '../utils/validation';
import { useState } from 'react';

const HomePage: React.FC = () => {
  const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const handleAddTodo = async (data: CreateTodoInput) => {
    await createTodo(data.title, data.description, data.dueDate);
  };

  const handleToggleTodo = async (id: string, status: 'pending' | 'completed') => {
    await updateTodo(id, undefined, undefined, status);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === 'all') return true;
    return todo.status === filterStatus;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">My Todos</h1>
      <p className="text-gray-600 mb-8">Stay organized and productive</p>

      <div className="mb-6">
        <AddTodoForm onAdd={handleAddTodo} />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filterStatus === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg transition ${
            filterStatus === 'pending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({todos.filter((t) => t.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg transition ${
            filterStatus === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({todos.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-8">Loading todos...</div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No {filterStatus !== 'all' ? filterStatus : ''} todos yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
