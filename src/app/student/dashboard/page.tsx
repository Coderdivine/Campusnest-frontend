'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Student, Purchase } from '@/types';
import { getStudentPurchases } from '@/lib/dummyData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'active' | 'past'>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
    department: '',
    level: '',
  });
  const { notification, showNotification, clearNotification } = useNotification();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(currentUser) as Student;
    if (userData.role !== 'student') {
      router.push('/login');
      return;
    }

    setUser(userData);
    setEditForm({
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      department: userData.department,
      level: userData.level,
    });

    // Load purchases
    const userPurchases = getStudentPurchases(userData.id);
    setPurchases(userPurchases);
  }, [router]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...editForm,
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditModalOpen(false);
      showNotification('success', 'Profile updated successfully!');
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const today = new Date();
    const purchaseDate = purchase.paymentDate ? new Date(purchase.paymentDate) : today;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return purchaseDate > today;
    if (activeTab === 'active') return purchase.inspectionStatus === 'Pending';
    if (activeTab === 'past') return purchase.inspectionStatus === 'Approved' || purchase.inspectionStatus === 'Rejected';
    return false;
  });

  const stats = {
    totalBookings: purchases.length,
    activeBookings: purchases.filter(p => p.inspectionStatus === 'Pending').length,
    completedBookings: purchases.filter(p => p.inspectionStatus === 'Approved').length,
  };

  if (!user) return null;

  const firstName = user.fullName.split(' ')[0];
  const userHandle = user.email.split('@')[0];

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Greeting */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-normal text-gray-600 mb-1">
              What&apos;s good, <span className="inline-flex items-center gap-2">
                @{userHandle}? 
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </span>
              </span>
            </h1>
            <p className="text-sm text-gray-500">Find your perfect accommodation at UNN!</p>
          </div>
          <Link href="/student/browse">
            <Button variant="primary" className="rounded-full" size="lg">
              <Plus className="h-5 w-5" />
              SEE LISTINGS
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Stat - Dark Card */}
          <div className="bg-black rounded-xl p-4">
            <p className="text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wide">
              Total Bookings
            </p>
            <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
          </div>

          {/* Secondary Stats - White Cards */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Active Bookings
            </p>
            <p className="text-3xl font-bold text-black">{stats.activeBookings}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Completed Bookings
            </p>
            <p className="text-3xl font-bold text-black">{stats.completedBookings}</p>
          </div>
        </div>

        {/* Bookings Section with Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 pt-6">
            <div className="flex gap-8 overflow-x-auto">
              {(['all', 'upcoming', 'active', 'past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'pb-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-all',
                    activeTab === tab
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab === 'all' ? 'ALL BOOKINGS' : 
                   tab === 'upcoming' ? 'UPCOMING' :
                   tab === 'active' ? 'ACTIVE' : 'PAST'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredPurchases.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-4xl font-extrabold uppercase mb-4">
                  NO BOOKINGS YET
                </h3>
                <Link href="/student/browse">
                  <button className="text-sm font-medium underline underline-offset-4 decoration-2 hover:text-black transition-colors">
                    BROWSE LODGES
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Booking Ref</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Lodge Name</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Area</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases.map((purchase, index) => (
                      <tr 
                        key={purchase.id}
                        className={cn(
                          'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        )}
                        onClick={() => router.push(`/student/bookings`)}
                      >
                        <td className="py-5 px-4 font-medium text-sm">{purchase.bookingRef}</td>
                        <td className="py-5 px-4 text-sm font-semibold">
                          {purchase.listing?.lodgeName || 'Lodge'}
                        </td>
                        <td className="py-5 px-4 text-sm text-gray-600">
                          {purchase.listing?.area || 'N/A'}
                        </td>
                        <td className="py-5 px-4 text-sm font-semibold">
                          {formatCurrency(purchase.amount)}
                        </td>
                        <td className="py-5 px-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            purchase.inspectionStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                            purchase.inspectionStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          )}>
                            {purchase.inspectionStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="EDIT PROFILE"
        position="right"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">Make changes to your profile.</p>
          
          <Input
            label="Username"
            value={userHandle}
            disabled
            className="bg-gray-50"
          />
          <Input
            label="First Name"
            value={editForm.fullName.split(' ')[0]}
            onChange={(e) => {
              const lastName = editForm.fullName.split(' ')[1] || '';
              setEditForm(prev => ({ ...prev, fullName: `${e.target.value} ${lastName}`.trim() }));
            }}
          />
          <Input
            label="Last Name"
            value={editForm.fullName.split(' ')[1] || ''}
            onChange={(e) => {
              const firstName = editForm.fullName.split(' ')[0] || '';
              setEditForm(prev => ({ ...prev, fullName: `${firstName} ${e.target.value}`.trim() }));
            }}
          />
          <Input
            label="Phone Number"
            value={editForm.phoneNumber}
            onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
          />
          <Button
            onClick={handleSaveProfile}
            variant="primary"
            className="w-full rounded-full"
            size="lg"
          >
            PROCEED
          </Button>
        </div>
      </Modal>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </StudentLayout>
  );
}
