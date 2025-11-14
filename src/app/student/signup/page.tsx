'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Notification, useNotification } from '@/components/ui/Notification';

export default function StudentSignupPage() {
  const router = useRouter();
  const { notification, showNotification, clearNotification } = useNotification();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    department: '',
    level: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 11 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      showNotification('error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newStudent = {
        id: `student-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: 'student' as const,
        department: formData.department,
        level: formData.level,
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(newStudent));
      showNotification('success', 'Account created successfully! Redirecting...');

      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-center cursor-pointer hover:opacity-80 transition-opacity">
            CAMPUSNEST
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] mb-3">
            STUDENT REGISTRATION
          </h2>
          <p className="text-gray-600">
            Create your account to find the perfect lodge
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Chidinma Okafor"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="chidinma@unn.edu.ng"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="08012345678"
              error={errors.phoneNumber}
              required
            />

            <Input
              label="Department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Science"
              required
            />

            <Input
              label="Level"
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="300"
              required
            />

            <div />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline">
              Login here
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/" className="hover:underline">
              Back to home
            </Link>
          </p>
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
