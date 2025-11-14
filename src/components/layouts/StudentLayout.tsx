'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, HelpCircle, LogOut, Menu, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const navItems = [
    { href: '/student/dashboard', label: 'Home', icon: Home },
    { href: '/student/bookings', label: 'Sessions', icon: BookOpen },
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const userHandle = currentUser?.email?.split('@')[0] || '0x0000';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-8 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-12">
            <Link href="/student/dashboard">
              <h1 className="text-2xl font-extrabold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                CAMPUSNEST
              </h1>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="px-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              NAVIGATION
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
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all',
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
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              ACTIONS
            </p>
            <div className="space-y-1">
              <Link
                href="/student/support"
                className="w-full group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Contact Support
              </Link>
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log-out
              </button>
            </div>
          </div>

          {/* User Info at Bottom */}
          <div className="px-6 pt-6 border-t border-gray-200 mt-6">
            <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                @{userHandle}
              </span>
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </div>
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
          <Link href="/student/dashboard">
            <h1 className="text-xl font-extrabold tracking-tight">CAMPUSNEST</h1>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white animate-slide-in-right">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-extrabold tracking-tight">CAMPUSNEST</h1>
            <button onClick={() => setMobileMenuOpen(false)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-4">
              NAVIGATION
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
                      'flex items-center px-4 py-3 text-sm font-medium rounded-xl',
                      isActive ? 'bg-black text-white' : 'text-gray-700'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-4">
              ACTIONS
            </p>
            <div className="space-y-1">
              <Link
                href="/student/support"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Contact Support
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log-out
              </button>
            </div>

            {/* User Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium text-gray-700">
                  @{userHandle}
                </span>
                <button className="p-1">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
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
    </div>
  );
}
