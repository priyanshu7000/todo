import pool from '../config/database';
import bcrypt from 'bcrypt';
import logger from '../config/logger';

async function seed() {
  try {
    logger.info('Starting database seeding...');

    // Check if demo user already exists
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      ['demo@example.com']
    );

    if (userCheck.rows.length === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Insert demo user
      logger.info('Inserting demo user...');
      const userResult = await pool.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email`,
        ['Demo User', 'demo@example.com', hashedPassword]
      );

      const userId = userResult.rows[0].id;
      logger.info(`Demo user created with ID: ${userId}`);

      // Insert demo todos
      logger.info('Inserting demo todos...');
      const todos = [
        { title: 'Complete project setup', description: 'Set up the To-Do application with all required dependencies', due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { title: 'Write API tests', description: 'Create comprehensive tests for all API endpoints', due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
        { title: 'Deploy to production', description: 'Deploy the application to production environment', due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      ];

      for (const todo of todos) {
        await pool.query(
          `INSERT INTO todos (user_id, title, description, due_date) VALUES ($1, $2, $3, $4)`,
          [userId, todo.title, todo.description, todo.due_date]
        );
      }

      logger.info('3 demo todos created');
    } else {
      logger.info('Demo user already exists, skipping seed');
    }

    await pool.end();
    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
}

seed();
