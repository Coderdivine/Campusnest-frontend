'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Notification, useNotification } from '@/components/ui/Notification';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { notification, showNotification, clearNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      showNotification('success', 'Password reset link sent! Check your email.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Logo */}
      <div className="mb-12 animate-fade-in">
        <Link href="/">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center cursor-pointer hover:opacity-70 transition-opacity">
            CAMPUSNEST
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-12">
          <h2 className="text-[2.5rem] md:text-5xl font-extrabold tracking-tight mb-4 leading-none">
            FORGOT<br />PASSWORD?
          </h2>
          <p className="text-gray-500 text-sm">
            {emailSent 
              ? "We've sent you a password reset link"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your e-mail address"
              required
              className="bg-gray-50 border-0 rounded-xl py-4"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-full mt-8"
              size="lg"
              loading={loading}
            >
              SEND RESET LINK
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <p className="text-sm text-green-800">
                Check your inbox at <strong>{email}</strong> for instructions to reset your password.
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full rounded-full"
              size="lg"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              TRY ANOTHER EMAIL
            </Button>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-8">
          <Link href="/login">
            <Button
              variant="ghost"
              className="w-full rounded-full flex items-center justify-center gap-2"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK TO LOGIN
            </Button>
          </Link>
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
