import { getAdminPool } from '../config/database';
import logger from '../config/logger';

const DB_NAME = process.env.DB_NAME || 'todo';

async function migrate() {
  const adminPool = getAdminPool();

  try {
    logger.info('Starting database migration...');

    // Check if database exists
    const dbCheckResult = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (dbCheckResult.rows.length === 0) {
      logger.info(`Creating database "${DB_NAME}"...`);
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      logger.info(`Database "${DB_NAME}" created successfully`);
    } else {
      logger.info(`Database "${DB_NAME}" already exists`);
    }

    // Close admin pool and create new pool for target database
    await adminPool.end();
    const targetPool = getAdminPool(DB_NAME);

    // Create users table
    logger.info('Creating users table...');
    await targetPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Users table created');

    // Create todos table
    logger.info('Creating todos table...');
    await targetPool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Todos table created');

    // Create indexes
    logger.info('Creating indexes...');
    await targetPool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await targetPool.query(`CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);`);
    await targetPool.query(`CREATE INDEX IF NOT EXISTS idx_todos_user_status ON todos(user_id, status);`);
    logger.info('Indexes created');

    // Create PostgreSQL functions
    logger.info('Creating PostgreSQL functions...');

    // fn_create_user
    await targetPool.query(`
      CREATE OR REPLACE FUNCTION fn_create_user(
        p_name VARCHAR(100),
        p_email VARCHAR(150),
        p_password VARCHAR(255)
      )
      RETURNS TABLE (id UUID, name VARCHAR, email VARCHAR, created_at TIMESTAMP) AS $$
      BEGIN
        RETURN QUERY INSERT INTO users (name, email, password)
        VALUES (p_name, p_email, p_password)
        RETURNING users.id, users.name, users.email, users.created_at;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // fn_get_user_by_email
    await targetPool.query(`
      CREATE OR REPLACE FUNCTION fn_get_user_by_email(p_email VARCHAR(150))
      RETURNS TABLE (id UUID, name VARCHAR, email VARCHAR, password VARCHAR, created_at TIMESTAMP, updated_at TIMESTAMP) AS $$
      BEGIN
        RETURN QUERY SELECT users.id, users.name, users.email, users.password, users.created_at, users.updated_at
        FROM users WHERE users.email = p_email;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // fn_create_todo
    await targetPool.query(`
      CREATE OR REPLACE FUNCTION fn_create_todo(
        p_user_id UUID,
        p_title VARCHAR(255),
        p_description TEXT,
        p_due_date TIMESTAMP
      )
      RETURNS TABLE (id UUID, user_id UUID, title VARCHAR, description TEXT, status VARCHAR, due_date TIMESTAMP, created_at TIMESTAMP) AS $$
      BEGIN
        RETURN QUERY INSERT INTO todos (user_id, title, description, due_date)
        VALUES (p_user_id, p_title, p_description, p_due_date)
        RETURNING todos.id, todos.user_id, todos.title, todos.description, todos.status, todos.due_date, todos.created_at;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // fn_get_todos_by_user
    await targetPool.query(`
      CREATE OR REPLACE FUNCTION fn_get_todos_by_user(p_user_id UUID)
      RETURNS TABLE (id UUID, user_id UUID, title VARCHAR, description TEXT, status VARCHAR, due_date TIMESTAMP, created_at TIMESTAMP, updated_at TIMESTAMP) AS $$
      BEGIN
        RETURN QUERY SELECT todos.id, todos.user_id, todos.title, todos.description, todos.status, todos.due_date, todos.created_at, todos.updated_at
        FROM todos WHERE todos.user_id = p_user_id ORDER BY todos.created_at DESC;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // fn_update_todo
    await targetPool.query(`
      CREATE OR REPLACE FUNCTION fn_update_todo(
        p_todo_id UUID,
        p_title VARCHAR(255),
        p_description TEXT,
        p_status VARCHAR(20),
        p_due_date TIMESTAMP
      )
      RETURNS TABLE (id UUID, user_id UUID, title VARCHAR, description TEXT, status VARCHAR, due_date TIMESTAMP, updated_at TIMESTAMP) AS $$
      BEGIN
        RETURN QUERY UPDATE todos
        SET title = p_title, description = p_description, status = p_status, due_date = p_due_date, updated_at = CURRENT_TIMESTAMP
        WHERE todos.id = p_todo_id
        RETURNING todos.id, todos.user_id, todos.title, todos.description, todos.status, todos.due_date, todos.updated_at;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // fn_delete_todo
    await targetPool.query(`
      CREATE OR REPLACE FUNCTION fn_delete_todo(p_todo_id UUID)
      RETURNS TABLE (id UUID) AS $$
      BEGIN
        RETURN QUERY DELETE FROM todos WHERE todos.id = p_todo_id RETURNING todos.id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    logger.info('PostgreSQL functions created');

    await targetPool.end();
    logger.info('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    await adminPool.end();
    process.exit(1);
  }
}

migrate();
