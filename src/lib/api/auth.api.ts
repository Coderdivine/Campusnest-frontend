import { api } from './api';
import { Student, Landlord } from '@/types';

export const authAPI = {
  // Student registration
  studentRegister: async (data: any) => {
    const response = await api.post('/v2/auth/register/student', data);
    return response.data;
  },

  // Landlord registration
  landlordRegister: async (data: any) => {
    const response = await api.post('/v2/auth/register/landlord', data);
    return response.data;
  },

  // Login (for both students and landlords)
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/v2/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<Student | Landlord> => {
    const response = await api.get('/v2/auth/profile');
    return response.data.data;
  },

  // Update profile
  updateProfile: async (data: any) => {
    const response = await api.put('/v2/auth/profile', data);
    return response.data;
  },

  // Save auth data to localStorage
  saveAuth: (token: string, user: Student | Landlord) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored user data
  getStoredUser: (): (Student | Landlord) | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};
