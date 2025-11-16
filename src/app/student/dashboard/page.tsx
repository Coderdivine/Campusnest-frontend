'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Student, Purchase } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fetchBankList, verifyBankAccount, Bank } from '@/lib/paystack';
import { Plus, User, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts';
import { authAPI } from '@/lib/api/auth.api';
import { purchaseAPI } from '@/lib/api/purchase.api';

export default function StudentDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, updateUser } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'active' | 'past'>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
    registrationNumber: '',
    department: '',
    level: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const { notification, showNotification, clearNotification } = useNotification();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'student') {
        router.push('/login');
        return;
      }

      const studentUser = user as Student;
      setEditForm({
        fullName: studentUser.fullName,
        phoneNumber: studentUser.phoneNumber,
        registrationNumber: studentUser.registrationNumber,
        department: studentUser.department,
        level: studentUser.level,
        bankName: studentUser.bankName || '',
        accountNumber: studentUser.accountNumber || '',
        accountName: studentUser.accountName || '',
      });

      // Check if we should open the profile modal (from URL parameter)
      const openProfile = searchParams.get('openProfile');
      if (openProfile === 'true') {
        setIsEditModalOpen(true);
        router.replace('/student/dashboard');
      }

      // Load purchases from API
      loadPurchases();
    }
  }, [user, authLoading, router, searchParams]);

  const loadPurchases = async () => {
    try {
      const response = await purchaseAPI.getMyPurchases();
      setPurchases(response.data as Purchase[]);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    }
  };

  // Load banks when modal opens
  useEffect(() => {
    if (isEditModalOpen && banks.length === 0) {
      console.log('🏦 [useEffect modal] Modal opened, loading banks...');
      const loadBanks = async () => {
        console.log('🏦 [loadBanks] Starting to load banks...');
        setLoadingBanks(true);
        try {
          console.log('🏦 [loadBanks] Calling fetchBankList...');
          const bankList = await fetchBankList();
          console.log('🏦 [loadBanks] Received bank list:', bankList);
          console.log('🏦 [loadBanks] Number of banks:', bankList.length);
          setBanks(bankList);
          console.log('🏦 [loadBanks] Banks state updated successfully');
        } catch (error) {
          console.error('❌ [loadBanks] Failed to load banks:', error);
          showNotification('error', 'Failed to load bank list. Please try again.');
        } finally {
          setLoadingBanks(false);
          console.log('🏦 [loadBanks] Loading complete');
        }
      };
      loadBanks();
    }
  }, [isEditModalOpen, banks.length, showNotification]);

  // Debug: Monitor banks state changes
  useEffect(() => {
    console.log('🏦 [useEffect banks] Banks state changed:', banks);
    console.log('🏦 [useEffect banks] Banks count:', banks.length);
    console.log('🏦 [useEffect banks] First 3 banks:', banks.slice(0, 3));
  }, [banks]);

  const handleEditProfile = () => {
    console.log('👤 [handleEditProfile] Opening profile modal...');
    setIsEditModalOpen(true);
  };

  const handleBankChange = (bankName: string) => {
    console.log('🏦 [handleBankChange] Bank selected:', bankName);
    console.log('🏦 [handleBankChange] Available banks count:', banks.length);
    const selectedBank = banks.find(b => b.name === bankName);
    console.log('🏦 [handleBankChange] Found bank:', selectedBank);
    setEditForm({ ...editForm, bankName, accountName: '' });
    setSelectedBankCode(selectedBank?.code || '');
    console.log('🏦 [handleBankChange] Bank code set to:', selectedBank?.code || 'none');
    setAccountVerified(false);
  };

  const handleAccountNumberChange = (accountNumber: string) => {
    // Only allow digits
    const cleanNumber = accountNumber.replace(/\D/g, '').slice(0, 10);
    setEditForm({ ...editForm, accountNumber: cleanNumber, accountName: '' });
    setAccountVerified(false);
  };

  const handleVerifyAccount = async () => {
    console.log('✅ [handleVerifyAccount] Starting verification...');
    console.log('✅ [handleVerifyAccount] Account number:', editForm.accountNumber);
    console.log('✅ [handleVerifyAccount] Bank code:', selectedBankCode);
    
    if (!editForm.accountNumber || editForm.accountNumber.length !== 10) {
      console.warn('⚠️ [handleVerifyAccount] Invalid account number');
      showNotification('error', 'Please enter a valid 10-digit account number');
      return;
    }

    if (!selectedBankCode) {
      console.warn('⚠️ [handleVerifyAccount] No bank code selected');
      showNotification('error', 'Please select a bank first');
      return;
    }

    setVerifyingAccount(true);
    try {
      console.log('✅ [handleVerifyAccount] Calling verifyBankAccount API...');
      const result = await verifyBankAccount(editForm.accountNumber, selectedBankCode);
      console.log('✅ [handleVerifyAccount] Verification result:', result);
      
      if (result.success && result.accountName) {
        setEditForm({ ...editForm, accountName: result.accountName });
        setAccountVerified(true);
        showNotification('success', 'Account verified successfully!');
      } else {
        showNotification('error', result.error || 'Account verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showNotification('error', 'Failed to verify account. Please try again.');
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleSaveProfile = async () => {
    if (user) {
      // Validate bank details if any field is filled
      const hasBankDetails = editForm.bankName || editForm.accountNumber || editForm.accountName;
      if (hasBankDetails && (!editForm.bankName || !editForm.accountNumber || !editForm.accountName)) {
        showNotification('error', 'Please complete all bank details or leave them empty');
        return;
      }

      if (hasBankDetails && !accountVerified) {
        showNotification('error', 'Please verify your account number before saving');
        return;
      }

      try {
        const response = await authAPI.updateProfile(editForm);
        
        // Update context with new user data
        updateUser(response.data);
        
        setIsEditModalOpen(false);
        setAccountVerified(false);
        showNotification('success', 'Profile updated successfully!');
      } catch (error: any) {
        console.error('Profile update error:', error);
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to update profile';
        showNotification('error', errorMessage);
      }
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

  if (authLoading || !user) return null;

  const studentUser = user as Student;
  const firstName = studentUser.fullName.split(' ')[0];
  const userHandle = studentUser.email.split('@')[0];

  // Show skeleton while purchases are loading
  if (purchases.length === 0 && !user.fullName) {
    return (
      <StudentLayout>
        <DashboardSkeleton />
      </StudentLayout>
    );
  }

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
                        key={purchase.purchase_id}
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
        <div className="flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-8 pb-6 scrollbar-hide">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Personal Information</h3>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Username
                </label>
                <input
                  value={userHandle}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  value={editForm.registrationNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, registrationNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Department
                </label>
                <input
                  value={editForm.department}
                  onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Level
                </label>
                <input
                  value={editForm.level}
                  onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Bank Details</h3>
                <p className="text-xs text-gray-600">Required for processing refunds</p>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Bank Name
                </label>
                {loadingBanks ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading banks...
                  </div>
                ) : (
                  <select
                    value={editForm.bankName}
                    onChange={(e) => handleBankChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm bg-white"
                  >
                    <option value="">Select a bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Account Number
                </label>
                <div className="flex gap-2">
                  <input
                    value={editForm.accountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder="10-digit account number"
                    maxLength={10}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
                  />
                  <button
                    onClick={handleVerifyAccount}
                    disabled={verifyingAccount || !editForm.bankName || editForm.accountNumber.length !== 10}
                    className="px-4 py-3 bg-black text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {verifyingAccount ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : accountVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  value={editForm.accountName}
                  readOnly
                  placeholder="Will be auto-filled after verification"
                  className={cn(
                    "w-full px-4 py-3 border rounded-xl text-sm transition-all",
                    accountVerified
                      ? "bg-green-50 border-green-300 text-green-900 font-medium"
                      : "bg-gray-50 border-gray-300 text-gray-500"
                  )}
                />
                {accountVerified && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Account verified successfully
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-4">
            <Button
              onClick={handleSaveProfile}
              variant="primary"
              className="w-full rounded-full"
              size="lg"
            >
              SAVE CHANGES
            </Button>
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
    </StudentLayout>
  );
}
