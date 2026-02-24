import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository {
  async createUser(name: string, email: string, password: string): Promise<User> {
    const result = await pool.query(
      `SELECT * FROM fn_create_user($1, $2, $3)`,
      [name, email, password]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT * FROM fn_get_user_by_email($1)`,
      [email]
    );
    return result.rows[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, name, email, password, created_at, updated_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
