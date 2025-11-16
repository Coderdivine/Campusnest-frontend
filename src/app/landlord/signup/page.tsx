'use client';

export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Notification, useNotification } from '@/components/ui/Notification';
import { ID_TYPES } from '@/lib/constants';
import { authAPI } from '@/utils/auth.api';

export default function LandlordSignupPage() {
  const router = useRouter();
  const { notification, showNotification, clearNotification } = useNotification();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    whatsappNumber: '',
    residentialAddress: '',
    state: 'Enugu',
    lga: 'Nsukka',
    identificationType: ID_TYPES[0],
    identificationNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    if (!/^\d{11}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'WhatsApp number must be 11 digits';
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

    try {
      const response = await authAPI.landlordRegister({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber,
        residentialAddress: formData.residentialAddress,
        state: formData.state,
        lga: formData.lga,
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber,
      });

      // Save auth data
      authAPI.saveAuth(response.data.token, response.data.user);
      
      showNotification('success', 'Account created successfully! Redirecting...');

      setTimeout(() => {
        router.push('/landlord/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Registration failed. Please try again.';
      showNotification('error', errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-center cursor-pointer hover:opacity-80 transition-opacity">
            UNN CAMPUSNEST
          </h1>
        </Link>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] mb-3">
            LANDLORD REGISTRATION
          </h2>
          <p className="text-gray-600">
            List your property and connect with students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Mr. Chukwuma Eze"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="chukwuma@gmail.com"
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
              label="WhatsApp Number"
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="08012345678"
              error={errors.whatsappNumber}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Residential Address"
                type="text"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                placeholder="45 Enugu Road, Nsukka"
                required
              />
            </div>

            <Input
              label="State"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />

            <Input
              label="LGA"
              type="text"
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              required
            />

            <Select
              label="Identification Type"
              name="identificationType"
              value={formData.identificationType}
              onChange={handleChange}
              options={ID_TYPES.map(type => ({ value: type, label: type }))}
              required
            />

            <Input
              label="Identification Number"
              type="text"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleChange}
              placeholder="Enter ID number"
              required
            />

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
