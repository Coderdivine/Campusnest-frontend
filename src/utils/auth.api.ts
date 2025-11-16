import api from './api';
import { Student, Landlord } from '@/types';

interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: Student | Landlord;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface StudentRegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  registrationNumber: string;
  department: string;
  level: string;
}

interface LandlordRegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  whatsappNumber: string;
  residentialAddress: string;
  state: string;
  lga: string;
  identificationType: string;
  identificationNumber: string;
}

export const authAPI = {
  // Student registration
  studentRegister: async (data: StudentRegisterData): Promise<AuthResponse> => {
    const response = await api.post('/v2/auth/register/student', data);
    return response.data;
  },

  // Landlord registration
  landlordRegister: async (data: LandlordRegisterData): Promise<AuthResponse> => {
    const response = await api.post('/v2/auth/register/landlord', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/v2/auth/login', credentials);
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<{ message: string; data: Student | Landlord }> => {
    const response = await api.get('/v2/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<Student | Landlord>): Promise<{ message: string; data: Student | Landlord }> => {
    const response = await api.put('/v2/auth/profile', data);
    return response.data;
  },

  // Helper to save auth data
  saveAuth: (token: string, user: Student | Landlord) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Helper to get current user
  getCurrentUser: (): (Student | Landlord) | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Helper to logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
};
