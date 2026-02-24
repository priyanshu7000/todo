import { Response } from 'express';
import { CustomRequest, AppError } from '../utils/errors';
import { ApiResponseUtil } from '../utils/response';
import { AuthService } from '../services/auth.service';
import { SignupInput, LoginInput } from '../utils/validation';

export class AuthController {
  private authService = new AuthService();

  async signup(req: any, res: Response) {
    try {
      const { name, email, password } = req.validatedBody as SignupInput;
      const result = await this.authService.signup(name, email, password);
      res.status(201).json(ApiResponseUtil.success('Signup successful', result));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }

  async login(req: any, res: Response) {
    try {
      const { email, password } = req.validatedBody as LoginInput;
      const result = await this.authService.login(email, password);
      res.status(200).json(ApiResponseUtil.success('Login successful', result));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }

  async refreshToken(req: any, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json(ApiResponseUtil.error('Refresh token is required'));
      }

      const result = await this.authService.refreshToken(refreshToken);
      res.status(200).json(ApiResponseUtil.success('Token refreshed', result));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(ApiResponseUtil.error(error.message));
      } else {
        res.status(500).json(ApiResponseUtil.error('Internal server error'));
      }
    }
  }
}
