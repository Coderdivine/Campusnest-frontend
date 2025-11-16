'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Student, Landlord } from '@/types';
import { authAPI } from '@/lib/api/auth.api';

interface AuthContextType {
  user: Student | Landlord | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: Student | Landlord) => void;
  logout: () => void;
  updateUser: (userData: Student | Landlord) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | Landlord | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Optionally refresh user data from API
          try {
            const freshUser = await authAPI.getCurrentUser();
            setUser(freshUser);
            authAPI.saveAuth(token, freshUser);
          } catch (error) {
            console.error('Failed to refresh user data:', error);
            // Keep using stored data if refresh fails
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authAPI.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Protect routes
  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/', '/login', '/forgot-password', '/student/signup', '/landlord/signup'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    }

    // Redirect authenticated users from login page
    if (user && pathname === '/login') {
      const dashboardPath = user.role === 'student' ? '/student/dashboard' : '/landlord/dashboard';
      router.push(dashboardPath);
    }
  }, [user, loading, pathname, router]);

  const login = (token: string, userData: Student | Landlord) => {
    authAPI.saveAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    authAPI.clearAuth();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: Student | Landlord) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authAPI.saveAuth(token, userData);
      setUser(userData);
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authAPI.getCurrentUser();
      updateUser(freshUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
