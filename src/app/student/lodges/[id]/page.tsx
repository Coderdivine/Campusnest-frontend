'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Listing, Student } from '@/types';
import { getListingWithLandlord, dummyListings } from '@/lib/dummyData';
import { formatCurrency, generateBookingRef } from '@/lib/utils';
import { MapPin, DollarSign, Users, Navigation, ArrowLeft, Phone, MessageCircle, Home } from 'lucide-react';

export default function LodgeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [user, setUser] = useState<Student | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'confirm' | 'payment' | 'success'>('confirm');
  const [bookingRef, setBookingRef] = useState('');
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

    // Get listing
    const listingData = dummyListings.find(l => l.id === params.id);
    if (listingData) {
      const fullListing = getListingWithLandlord(listingData.id);
      setListing(fullListing || listingData);
    }
  }, [params.id, router]);

  const handleBookNow = () => {
    setBookingRef(generateBookingRef());
    setBookingStep('confirm');
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    setBookingStep('payment');
  };

  const handleMakePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setBookingStep('success');
      showNotification('success', 'Payment successful! Please inspect the lodge before funds are released.');
    }, 2000);
  };

  const handleComplete = () => {
    setIsBookingModalOpen(false);
    setTimeout(() => {
      router.push('/student/bookings');
    }, 500);
  };

  if (!listing || !user) return null;

  const whatsappUrl = listing.landlord?.whatsappNumber 
    ? `https://wa.me/234${listing.landlord.whatsappNumber.substring(1)}`
    : '#';

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/student/browse">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-400 text-white text-2xl font-bold">
            {listing.lodgeName}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{listing.lodgeName}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{listing.lodgeAddress}</span>
              </div>
              <span className="inline-block px-3 py-1 bg-black text-white text-sm font-bold uppercase tracking-wide rounded-full">
                {listing.area}
              </span>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4">
                  Property Features
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold">{formatCurrency(listing.pricePerYear)}/year</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Available Slots</p>
                      <p className="font-bold">{listing.availableSlots}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Distance from UNN</p>
                      <p className="font-bold">{listing.distanceFromUNN} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-bold capitalize">{listing.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {listing.landlord && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">
                    Landlord Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-bold">{listing.landlord.fullName}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <a href={`tel:${listing.landlord.phoneNumber}`}>
                        <Button variant="secondary" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                      </a>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <p className="text-3xl font-bold">{formatCurrency(listing.pricePerYear)}</p>
                  <p className="text-sm text-gray-600">per year</p>
                </div>

                <div className="space-y-2 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Slots</span>
                    <span className="font-bold">{listing.availableSlots}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance from UNN</span>
                    <span className="font-bold">{listing.distanceFromUNN} km</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  size="lg"
                  onClick={handleBookNow}
                  disabled={listing.availableSlots === 0}
                >
                  {listing.availableSlots === 0 ? 'Fully Booked' : 'Book Now'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You won&apos;t be charged yet. Payment is secure through Paystack.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={bookingStep === 'confirm' ? 'Confirm Booking' : bookingStep === 'payment' ? 'Make Payment' : 'Booking Successful'}
        size="md"
      >
        {bookingStep === 'confirm' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lodge</span>
                <span className="font-bold text-sm">{listing.lodgeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Price</span>
                <span className="font-bold text-sm">{formatCurrency(listing.pricePerYear)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Booking Reference</span>
                <span className="font-bold text-sm">{bookingRef}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              By confirming, you agree to inspect the property before funds are released to the landlord.
            </p>
            <Button variant="primary" className="w-full" size="lg" onClick={handleConfirmBooking}>
              Proceed to Payment
            </Button>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Complete Payment</h3>
              <p className="text-gray-600 mb-6">
                You will be redirected to Paystack to complete your payment securely.
              </p>
              <p className="text-2xl font-bold mb-2">{formatCurrency(listing.pricePerYear)}</p>
              <p className="text-sm text-gray-600">Booking Ref: {bookingRef}</p>
            </div>
            <Button variant="primary" className="w-full" size="lg" onClick={handleMakePayment}>
              Pay with Paystack
            </Button>
          </div>
        )}

        {bookingStep === 'success' && (
          <div className="space-y-6 text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your booking has been confirmed. Please inspect the lodge physically before approving the release of funds.
              </p>
              <p className="text-sm font-bold">Booking Ref: {bookingRef}</p>
            </div>
            <Button variant="primary" className="w-full" size="lg" onClick={handleComplete}>
              View My Bookings
            </Button>
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
