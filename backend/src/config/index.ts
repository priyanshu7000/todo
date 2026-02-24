import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL if provided (for Render.com or similar platforms)
const parseDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      name: process.env.DB_NAME || 'todo',
    };
  }

  try {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname || 'localhost',
      port: parseInt(url.port || '5432'),
      user: url.username || 'postgres',
      password: url.password || 'postgres',
      name: url.pathname?.slice(1) || 'todo',
    };
  } catch {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      name: process.env.DB_NAME || 'todo',
    };
  }
};

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecret',
  database: parseDatabaseUrl(),
};
