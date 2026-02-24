import { Response, NextFunction } from 'express';
import { CustomRequest, AppError } from '../utils/errors';
import { TokenUtil } from '../utils/token';

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    const payload = TokenUtil.verifyAccessToken(token);
    req.userId = payload.userId;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const validationMiddleware = (schema: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.validatedBody = parsed;
      next();
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Validation failed';
      res.status(400).json({ success: false, message });
    }
  };
};
