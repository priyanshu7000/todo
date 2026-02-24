import api from './client.ts';
import { Todo, ApiResponse } from '../types';

export const todosAPI = {
  createTodo: (title: string, description?: string, dueDate?: string) => {
    const payload: Record<string, unknown> = { title };
    if (description && description.trim()) payload.description = description.trim();
    if (dueDate && dueDate.trim()) payload.dueDate = dueDate.trim();
    return api.post<ApiResponse<Todo>>('/todos', payload);
  },

  getTodos: () =>
    api.get<ApiResponse<Todo[]>>('/todos'),

  getTodoById: (id: string) =>
    api.get<ApiResponse<Todo>>(`/todos/${id}`),

  updateTodo: (id: string, title?: string, description?: string, status?: 'pending' | 'completed', dueDate?: string) => {
    const payload: Record<string, unknown> = {};
    if (title && title.trim()) payload.title = title.trim();
    if (description && description.trim()) payload.description = description.trim();
    if (status) payload.status = status;
    if (dueDate && dueDate.trim()) payload.dueDate = dueDate.trim();
    return api.put<ApiResponse<Todo>>(`/todos/${id}`, payload);
  },

  deleteTodo: (id: string) =>
    api.delete<ApiResponse>(`/todos/${id}`),
};
