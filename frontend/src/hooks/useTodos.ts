import { useState, useEffect } from 'react';
import { Todo } from '../types';
import { todosAPI } from '../api/todos';
import { useToastStore } from '../utils/toast.store';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await todosAPI.getTodos();
      setTodos(response.data.data || []);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch todos';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string, description?: string, dueDate?: string) => {
    try {
      const response = await todosAPI.createTodo(title, description, dueDate);
      setTodos([response.data.data as Todo, ...todos]);
      addToast('Todo created successfully', 'success');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create todo';
      addToast(message, 'error');
      return false;
    }
  };

  const updateTodo = async (
    id: string,
    title?: string,
    description?: string,
    status?: 'pending' | 'completed',
    dueDate?: string
  ) => {
    try {
      const response = await todosAPI.updateTodo(id, title, description, status, dueDate);
      setTodos(todos.map((t) => (t.id === id ? (response.data.data as Todo) : t)));
      addToast('Todo updated successfully', 'success');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update todo';
      addToast(message, 'error');
      return false;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todosAPI.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      addToast('Todo deleted successfully', 'success');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete todo';
      addToast(message, 'error');
      return false;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, loading, createTodo, updateTodo, deleteTodo, fetchTodos };
};
