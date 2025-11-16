'use client';

export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Notification, useNotification } from '@/components/ui/Notification';
import { authAPI } from '@/lib/api/auth.api';
import { useAuth } from '@/contexts';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { notification, showNotification, clearNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Use context to save auth and trigger navigation
      login(response.data.token, response.data.user);
      
      showNotification('success', 'Login successful! Redirecting...');
      
      // Navigate based on role
      const dashboardPath = response.data.user.role === 'student' 
        ? '/student/dashboard' 
        : '/landlord/dashboard';
      
      setTimeout(() => {
        router.push(dashboardPath);
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Invalid credentials. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Logo */}
      <div className="mb-12 animate-fade-in">
        <Link href="/">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center cursor-pointer hover:opacity-70 transition-opacity">
            UNN CAMPUSNEST
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-12">
          <h2 className="text-[2.5rem] md:text-5xl font-extrabold tracking-tight mb-4 leading-none">
            WELCOME<br />BACK
          </h2>
          <p className="text-gray-500 text-sm">
            Username or E-mail
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your e-mail address"
            required
            className="bg-gray-50 border-0 rounded-xl py-4"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-500">Password</label>
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-black transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="************"
                required
                className="bg-gray-50 border-0 rounded-xl py-4 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full rounded-full mt-8"
            size="lg"
            loading={loading}
          >
            LOG IN
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              className="w-full py-4 px-6 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/student/signup" className="font-semibold underline underline-offset-4 decoration-2 hover:text-black transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-5 bg-gray-50 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-700">Demo Credentials</p>
          <div className="text-xs text-gray-600 space-y-2">
            <p><strong>Student:</strong> chidinma.okafor@unn.edu.ng</p>
            <p><strong>Landlord:</strong> chukwuma.eze@gmail.com</p>
            <p className="text-gray-500 mt-2">(Use any password)</p>
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}
