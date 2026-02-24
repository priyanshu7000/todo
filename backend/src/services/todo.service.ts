import { TodoRepository, Todo } from '../repositories/todo.repository';
import { AppError } from '../utils/errors';

export class TodoService {
  private todoRepository = new TodoRepository();

  async createTodo(
    userId: string,
    title: string,
    description?: string,
    dueDate?: string
  ): Promise<Todo> {
    const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
    return this.todoRepository.createTodo(userId, title, description, parsedDueDate);
  }

  async getTodos(userId: string): Promise<Todo[]> {
    return this.todoRepository.getTodosByUser(userId);
  }

  async getTodoById(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoRepository.getTodoById(id);
    if (!todo) {
      throw new AppError(404, 'Todo not found');
    }

    // Check if todo belongs to user
    if (todo.user_id !== userId) {
      throw new AppError(403, 'Unauthorized');
    }

    return todo;
  }

  async updateTodo(
    id: string,
    userId: string,
    title?: string,
    description?: string,
    status?: 'pending' | 'completed',
    dueDate?: string
  ): Promise<Todo> {
    const todo = await this.todoRepository.getTodoById(id);
    if (!todo) {
      throw new AppError(404, 'Todo not found');
    }

    // Check if todo belongs to user
    if (todo.user_id !== userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
    const updated = await this.todoRepository.updateTodo(
      id,
      title,
      description,
      status,
      parsedDueDate
    );

    if (!updated) {
      throw new AppError(500, 'Failed to update todo');
    }

    return updated;
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    const todo = await this.todoRepository.getTodoById(id);
    if (!todo) {
      throw new AppError(404, 'Todo not found');
    }

    // Check if todo belongs to user
    if (todo.user_id !== userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const deleted = await this.todoRepository.deleteTodo(id);
    if (!deleted) {
      throw new AppError(500, 'Failed to delete todo');
    }
  }
}
