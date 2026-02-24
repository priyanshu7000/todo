import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../utils/auth.store';
import { useToastStore } from '../utils/toast.store';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup(name, email, password);
      const { user, accessToken, refreshToken } = response.data.data!;
      setAuth(user, accessToken, refreshToken);
      addToast('Signup successful!', 'success');
      navigate('/');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      addToast(message, 'error');
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, accessToken, refreshToken } = response.data.data!;
      setAuth(user, accessToken, refreshToken);
      addToast('Login successful!', 'success');
      navigate('/');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      addToast(message, 'error');
      return false;
    }
  };

  const logout = () => {
    logoutStore();
    addToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return { signup, login, logout };
};
