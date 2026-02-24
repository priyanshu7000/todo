import app from './app';
import { config } from './config';
import logger from './config/logger';
import pool from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    logger.info('Database connection successful');
    client.release();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Swagger docs available at http://localhost:${config.port}/api-docs`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        pool.end(() => {
          logger.info('Database connections closed');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
