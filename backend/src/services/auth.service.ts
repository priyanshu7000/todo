import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { TokenUtil } from '../utils/token';
import { AppError } from '../utils/errors';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class AuthService {
  private userRepository = new UserRepository();

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userRepository.createUser(name, email, hashedPassword);

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = TokenUtil.verifyRefreshToken(refreshToken);
      const accessToken = TokenUtil.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
      });
      return { accessToken };
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token');
    }
  }
}
