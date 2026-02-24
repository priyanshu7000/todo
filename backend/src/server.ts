import app from './app';
import { config } from './config';
import logger from './config/logger';
import pool from './config/database';

const startServer = async () => {
  try {
    // Start server first (so Render can detect the port)
    const server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Swagger docs available at http://localhost:${config.port}/api-docs`);
    });

    // Test database connection asynchronously
    pool.connect()
      .then((client) => {
        logger.info('Database connection successful');
        client.release();
      })
      .catch((error) => {
        logger.error('Database connection failed:', error);
        logger.warn('Server is running but database is unavailable');
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
