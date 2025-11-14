'use client';

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
import { FileText, Phone, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

export default function StudentBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
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

  const handleInspectLodge = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsInspectionModalOpen(true);
  };

  const handleApproveRelease = () => {
    if (selectedPurchase) {
      // Update purchase status (in real app, this would be an API call)
      const updatedPurchases = purchases.map(p =>
        p.id === selectedPurchase.id
          ? { ...p, paymentStatus: 'Released' as const, inspectionStatus: 'Approved' as const }
          : p
      );
      setPurchases(updatedPurchases);
      setIsInspectionModalOpen(false);
      showNotification('success', 'Funds released successfully! Enjoy your new lodge.');
    }
  };

  const handleRequestRefund = () => {
    if (selectedPurchase) {
      const updatedPurchases = purchases.map(p =>
        p.id === selectedPurchase.id
          ? { ...p, paymentStatus: 'Refunded' as const, inspectionStatus: 'Rejected' as const }
          : p
      );
      setPurchases(updatedPurchases);
      setIsInspectionModalOpen(false);
      showNotification('info', 'Refund requested. Funds will be returned to your account within 3-5 business days.');
    }
  };

  if (!user) return null;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            View and manage your lodge bookings
          </p>
        </div>

        {/* Bookings List */}
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                No Bookings Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven&apos;t made any bookings yet. Browse available lodges to get started.
              </p>
              <Link href="/student/browse">
                <Button size="lg">Browse Lodges</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>{purchase.listing?.lodgeName}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-center ${
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
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Booking Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                      <p className="font-bold">{purchase.bookingRef}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                      <p className="font-bold">{formatCurrency(purchase.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                      <p className="font-bold">
                        {purchase.paymentDate ? formatDate(purchase.paymentDate) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Inspection Status</p>
                      <p className="font-bold capitalize">{purchase.inspectionStatus}</p>
                    </div>
                  </div>

                  {/* Lodge Details */}
                  <div className="border-t pt-4">
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-3">
                      Lodge Details
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {purchase.listing?.lodgeAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      Area: {purchase.listing?.area}
                    </p>
                  </div>

                  {/* Landlord Contact */}
                  {purchase.landlord && (
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-sm uppercase tracking-wide mb-3">
                        Landlord Contact
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <p className="text-sm flex-1">
                          <span className="text-gray-600">Name:</span>{' '}
                          <span className="font-bold">{purchase.landlord.fullName}</span>
                        </p>
                        <div className="flex gap-2">
                          <a href={`tel:${purchase.landlord.phoneNumber}`}>
                            <Button variant="secondary" size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                          </a>
                          <a
                            href={`https://wa.me/234${purchase.landlord.whatsappNumber.substring(1)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {purchase.paymentStatus === 'Paid' && purchase.inspectionStatus === 'Pending' && (
                    <div className="border-t pt-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Action Required:</strong> Please inspect the lodge physically before
                          approving the release of funds or requesting a refund.
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleInspectLodge(purchase)}
                      >
                        Complete Inspection
                      </Button>
                    </div>
                  )}

                  {purchase.paymentStatus === 'Released' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm font-semibold">
                          Booking completed! Enjoy your lodge.
                        </p>
                      </div>
                    </div>
                  )}

                  {purchase.paymentStatus === 'Refunded' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <XCircle className="h-5 w-5" />
                        <p className="text-sm font-semibold">
                          Refund processed. Funds returned to your account.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Inspection Modal */}
      <Modal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        title="Complete Inspection"
        size="md"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">
                {selectedPurchase.listing?.lodgeName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedPurchase.listing?.lodgeAddress}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Have you inspected the lodge physically? Please make your decision below:
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={handleApproveRelease}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Approve & Release Funds
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={handleRequestRefund}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Request Refund
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Once you approve, funds will be released to the landlord
                and cannot be reversed. If you request a refund, the funds will be returned to
                your account within 3-5 business days.
              </p>
            </div>
          </div>
        )}
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
