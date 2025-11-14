'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Student, Purchase } from '@/types';
import { getStudentPurchases } from '@/lib/dummyData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Phone, MessageCircle, CheckCircle, XCircle, AlertTriangle, DollarSign } from 'lucide-react';

export default function StudentBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isBankDetailsModalOpen, setIsBankDetailsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'release' | 'refund' | null>(null);
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
    const userPurchases = getStudentPurchases(userData.id);
    setPurchases(userPurchases);
  }, [router]);

  const hasBankDetails = () => {
    return user?.bankName && user?.accountNumber && user?.accountName;
  };

  const handleInspectLodge = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsInspectionModalOpen(true);
  };

  const handleChooseRelease = () => {
    setActionType('release');
    setIsInspectionModalOpen(false);
    setIsReleaseModalOpen(true);
  };

  const handleChooseRefund = () => {
    if (!hasBankDetails()) {
      setIsInspectionModalOpen(false);
      setIsBankDetailsModalOpen(true);
      return;
    }
    setActionType('refund');
    setIsInspectionModalOpen(false);
    setIsReleaseModalOpen(true);
  };

  const handleConfirmRelease = () => {
    if (selectedPurchase && actionType === 'release') {
      const updatedPurchases = purchases.map(p =>
        p.id === selectedPurchase.id
          ? { ...p, paymentStatus: 'Released' as const, inspectionStatus: 'Approved' as const }
          : p
      );
      setPurchases(updatedPurchases);
      setIsReleaseModalOpen(false);
      setSelectedPurchase(null);
      setActionType(null);
      showNotification('success', 'Funds released to landlord successfully! Enjoy your new lodge.');
    }
  };

  const handleConfirmRefund = () => {
    if (selectedPurchase && actionType === 'refund') {
      const updatedPurchases = purchases.map(p =>
        p.id === selectedPurchase.id
          ? { ...p, paymentStatus: 'Refunded' as const, inspectionStatus: 'Rejected' as const }
          : p
      );
      setPurchases(updatedPurchases);
      setIsReleaseModalOpen(false);
      setSelectedPurchase(null);
      setActionType(null);
      showNotification('info', 'Refund request submitted. Funds will be returned to your account within 3-5 business days.');
    }
  };

  const handleAddBankDetails = () => {
    setIsBankDetailsModalOpen(false);
    router.push('/student/dashboard?openProfile=true');
  };

  if (!user) return null;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">
            MY BOOKINGS
          </h1>
          <p className="text-sm text-gray-600">
            View and manage your lodge bookings
          </p>
        </div>

        {/* Bookings List */}
        {purchases.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-2">
                No Bookings Yet
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                You haven't made any bookings yet. Browse available lodges to get started.
              </p>
              <Link href="/student/browse">
                <button className="px-6 py-2.5 bg-black text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors">
                  Browse Lodges
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <h3 className="text-base font-bold">{purchase.listing?.lodgeName}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-center inline-block ${
                      purchase.paymentStatus === 'Released'
                        ? 'bg-green-100 text-green-800'
                        : purchase.paymentStatus === 'Paid'
                        ? 'bg-yellow-100 text-yellow-800'
                        : purchase.paymentStatus === 'Refunded'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {purchase.paymentStatus}
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Booking Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
                      <p className="text-sm font-bold">{purchase.bookingRef}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                      <p className="text-sm font-bold">{formatCurrency(purchase.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                      <p className="text-sm font-bold">
                        {purchase.paymentDate ? formatDate(purchase.paymentDate) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Inspection Status</p>
                      <p className="text-sm font-bold capitalize">{purchase.inspectionStatus}</p>
                    </div>
                  </div>

                  {/* Lodge Details */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                      Lodge Details
                    </h4>
                    <p className="text-sm text-gray-700 mb-1">
                      {purchase.listing?.lodgeAddress}
                    </p>
                    <p className="text-xs text-gray-600">
                      Area: {purchase.listing?.area}
                    </p>
                  </div>

                  {/* Landlord Contact */}
                  {purchase.landlord && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
                        Landlord Contact
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <p className="text-sm flex-1">
                          <span className="text-gray-600">Name:</span>{' '}
                          <span className="font-bold">{purchase.landlord.fullName}</span>
                        </p>
                        <div className="flex gap-2">
                          <a href={`tel:${purchase.landlord.phoneNumber}`}>
                            <button className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              Call
                            </button>
                          </a>
                          <a
                            href={`https://wa.me/234${purchase.landlord.whatsappNumber.substring(1)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                              <MessageCircle className="h-3.5 w-3.5" />
                              WhatsApp
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {purchase.paymentStatus === 'Paid' && purchase.inspectionStatus === 'Pending' && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-yellow-900 mb-1">Action Required</p>
                            <p className="text-xs text-yellow-800">
                              Please inspect the lodge physically before approving the release of funds or requesting a refund.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInspectLodge(purchase)}
                        className="w-full px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors"
                      >
                        Complete Inspection
                      </button>
                    </div>
                  )}

                  {purchase.paymentStatus === 'Released' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-xs font-semibold text-green-900">
                          Booking completed! Enjoy your lodge.
                        </p>
                      </div>
                    </div>
                  )}

                  {purchase.paymentStatus === 'Refunded' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <p className="text-xs font-semibold text-red-900">
                          Refund processed. Funds returned to your account.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspection Decision Modal */}
      <Modal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        title="INSPECTION DECISION"
        size="md"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base mb-2">
                {selectedPurchase.listing?.lodgeName}
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                {selectedPurchase.listing?.lodgeAddress}
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-700">
                  Have you inspected the lodge physically? Please make your decision:
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleChooseRelease}
                className="w-full px-4 py-3 bg-green-600 text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                I'm Satisfied - Release Funds
              </button>
              <button
                onClick={handleChooseRefund}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Not Satisfied - Request Refund
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> This decision is final. Choose carefully after physical inspection.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Release/Refund Confirmation Modal */}
      <Modal
        isOpen={isReleaseModalOpen}
        onClose={() => {
          setIsReleaseModalOpen(false);
          setActionType(null);
        }}
        title={actionType === 'release' ? 'CONFIRM RELEASE' : 'CONFIRM REFUND'}
        size="md"
      >
        {selectedPurchase && actionType && (
          <div className="space-y-6">
            {actionType === 'release' ? (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-base font-bold mb-2">Release Funds to Landlord</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You are about to release <span className="font-bold">{formatCurrency(selectedPurchase.amount)}</span> to the landlord.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-900 mb-1">Important Warning</p>
                      <p className="text-xs text-red-800">
                        Once you release the funds, this action cannot be reversed. The money will be transferred to the landlord's account immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConfirmRelease}
                    className="w-full px-4 py-3 bg-green-600 text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-green-700 transition-colors"
                  >
                    Yes, Release Funds
                  </button>
                  <button
                    onClick={() => {
                      setIsReleaseModalOpen(false);
                      setIsInspectionModalOpen(true);
                    }}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wide rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-base font-bold mb-2">Request Refund</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You are requesting a refund of <span className="font-bold">{formatCurrency(selectedPurchase.amount)}</span>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-blue-900">Refund Details:</p>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p><strong>Bank:</strong> {user.bankName}</p>
                    <p><strong>Account:</strong> {user.accountNumber}</p>
                    <p><strong>Name:</strong> {user.accountName}</p>
                  </div>
                  <p className="text-xs text-blue-800 pt-2">
                    Funds will be credited to this account within 3-5 business days.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConfirmRefund}
                    className="w-full px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-red-700 transition-colors"
                  >
                    Confirm Refund Request
                  </button>
                  <button
                    onClick={() => {
                      setIsReleaseModalOpen(false);
                      setIsInspectionModalOpen(true);
                    }}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wide rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Bank Details Required Modal */}
      <Modal
        isOpen={isBankDetailsModalOpen}
        onClose={() => setIsBankDetailsModalOpen(false)}
        title="BANK DETAILS REQUIRED"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-base font-bold mb-2">Add Your Bank Details</h3>
            <p className="text-sm text-gray-600">
              You need to add your bank account details before requesting a refund.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-900">
              Bank details are required to process refunds. Your information is secure and will only be used for refund transactions.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddBankDetails}
              className="w-full px-4 py-3 bg-black text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors"
            >
              Add Bank Details Now
            </button>
            <button
              onClick={() => setIsBankDetailsModalOpen(false)}
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wide rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
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
    </StudentLayout>
  );
}
