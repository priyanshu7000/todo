import pool from '../config/database';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export class TodoRepository {
  async createTodo(
    userId: string,
    title: string,
    description?: string,
    dueDate?: Date
  ): Promise<Todo> {
    const result = await pool.query(
      `SELECT * FROM fn_create_todo($1, $2, $3, $4)`,
      [userId, title, description || null, dueDate || null]
    );
    return result.rows[0];
  }

  async getTodosByUser(userId: string): Promise<Todo[]> {
    const result = await pool.query(
      `SELECT * FROM fn_get_todos_by_user($1)`,
      [userId]
    );
    return result.rows;
  }

  async getTodoById(id: string): Promise<Todo | null> {
    const result = await pool.query(
      `SELECT id, user_id, title, description, status, due_date, created_at, updated_at FROM todos WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async updateTodo(
    id: string,
    title?: string,
    description?: string,
    status?: 'pending' | 'completed',
    dueDate?: Date
  ): Promise<Todo | null> {
    const currentTodo = await this.getTodoById(id);
    if (!currentTodo) return null;

    const result = await pool.query(
      `SELECT * FROM fn_update_todo($1, $2, $3, $4, $5)`,
      [
        id,
        title || currentTodo.title,
        description !== undefined ? description : currentTodo.description,
        status || currentTodo.status,
        dueDate || currentTodo.due_date,
      ]
    );
    return result.rows[0];
  }

  async deleteTodo(id: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT * FROM fn_delete_todo($1)`,
      [id]
    );
    return result.rows.length > 0;
  }
}
