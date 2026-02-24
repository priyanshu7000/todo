import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { ApiResponseUtil } from '../utils/response';

export interface CustomRequest extends Request {
  userId?: string;
}

class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(ApiResponseUtil.error(err.message));
  }

  res.status(500).json(ApiResponseUtil.error('Internal server error'));
};

export { AppError };
