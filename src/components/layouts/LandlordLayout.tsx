'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, PlusCircle, LogOut, User, Menu, MoreHorizontal, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Landlord } from '@/types';
import { useAuth } from '@/contexts';
import { authAPI } from '@/lib/api/auth.api';

interface LandlordLayoutProps {
  children: ReactNode;
}

export default function LandlordLayout({ children }: LandlordLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phoneNumber: '',
    residentialAddress: '',
    whatsappNumber: '',
  });
  const { notification, showNotification, clearNotification } = useNotification();

  useEffect(() => {
    if (user && user.role === 'landlord') {
      const landlordUser = user as Landlord;
      setProfileForm({
        fullName: landlordUser.fullName,
        phoneNumber: landlordUser.phoneNumber,
        residentialAddress: landlordUser.residentialAddress,
        whatsappNumber: landlordUser.whatsappNumber,
      });
    }
  }, [user]);

  const navItems = [
    { href: '/landlord/dashboard', label: 'Home', icon: Home },
    { href: '/landlord/listings', label: 'My Listings', icon: FileText },
    { href: '/landlord/create-listing', label: 'Create Listing', icon: PlusCircle },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        const response = await authAPI.updateProfile(profileForm);
        updateUser(response.data);
        setIsProfileModalOpen(false);
        showNotification('success', 'Profile updated successfully!');
      } catch (error: any) {
        console.error('Profile update error:', error);
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to update profile';
        showNotification('error', errorMessage);
      }
    }
  };

  const landlordUser = user as Landlord | null;
  const userHandle = landlordUser?.email.split('@')[0] || 'landlord';

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-8 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-12">
            <Link href="/landlord/dashboard">
              <h1 className="text-2xl font-bold tracking-[0.2em] cursor-pointer">
                UNN CAMPUSNEST
              </h1>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="px-6 mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all',
                      isActive
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Actions Section */}
          <div className="px-6 mt-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Actions
            </p>
            <div className="space-y-1">
              <Link
                href="/landlord/support"
                className="w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Contact Support
              </Link>
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log-out
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all"
            >
              <span className="text-gray-700">@{userHandle}</span>
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
        <button
          type="button"
          className="p-2 text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <Link href="/landlord/dashboard">
            <h1 className="text-xl font-bold tracking-[0.2em]">UNN CAMPUSNEST</h1>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white animate-slide-in-right">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold tracking-[0.2em]">UNN CAMPUSNEST</h1>
            <button onClick={() => setMobileMenuOpen(false)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            {/* Navigation */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">
              Navigation
            </p>
            <nav className="space-y-1 mb-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-semibold rounded-xl',
                      isActive ? 'bg-black text-white' : 'text-gray-700'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">
              Actions
            </p>
            <div className="space-y-1 mb-6">
              <Link
                href="/landlord/support"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-700"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Contact Support
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-700"
              >
                <User className="mr-3 h-5 w-5" />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-700"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log-out
              </button>
            </div>

            {/* User Info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="px-4 py-3 text-sm font-semibold text-gray-700">
                @{userHandle}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Profile Modal - Desktop: Right slide, Mobile: Bottom up */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="EDIT PROFILE"
        position={typeof window !== 'undefined' && window.innerWidth < 768 ? 'bottom' : 'right'}
      >
        <div className="h-full flex flex-col">
          <p className="text-sm text-gray-500 mb-6">Make changes to your profile information.</p>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="space-y-6 pr-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userHandle}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-base font-medium text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:border-black focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={landlordUser?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-base font-medium text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:border-black focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={profileForm.whatsappNumber}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:border-black focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Residential Address
                </label>
                <textarea
                  value={profileForm.residentialAddress}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, residentialAddress: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:border-black focus:ring-2 focus:ring-black transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={handleSaveProfile}
              className="w-full bg-black text-white font-bold uppercase tracking-wide px-6 py-4 rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all text-sm"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      </Modal>

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
