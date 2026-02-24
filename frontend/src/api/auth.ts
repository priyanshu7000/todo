import api from './client.ts';
import { AuthResponse, ApiResponse } from '../types';

export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken }),
};
