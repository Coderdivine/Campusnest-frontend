'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Logo */}
      <div className="mb-16 animate-fade-in">
        <h1 className="text-[2.5rem] md:text-6xl font-extrabold tracking-tight text-center">
          UNN CAMPUSNEST
        </h1>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[480px] text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-[2.75rem] md:text-6xl font-extrabold tracking-tight leading-none">
            WELCOME
          </h2>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed px-2">
            Find your perfect lodge or list your property.
            Create an account to get started.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/student/signup" className="block">
              <Button variant="primary" className="w-full rounded-full" size="lg">
                STUDENT
              </Button>
            </Link>
            
            <Link href="/landlord/signup" className="block">
              <Button variant="secondary" className="w-full rounded-full" size="lg">
                LANDLORD
              </Button>
            </Link>
          </div>
          
          <Link href="/login" className="block">
            <Button variant="secondary" className="w-full rounded-full" size="lg">
              LOGIN
            </Button>
          </Link>

          <div className="pt-6">
            <Link href="/student/browse" className="text-sm font-medium hover:underline underline-offset-4 decoration-2">
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none opacity-50">
        <div className="w-full h-full bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>
    </div>
  );
}
