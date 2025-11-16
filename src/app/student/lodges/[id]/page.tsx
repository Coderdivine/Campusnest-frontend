'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Notification, useNotification } from '@/components/ui/Notification';
import PaymentModal from '@/components/ui/PaymentModal';
import { Listing, Student } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { MapPin, DollarSign, Users, Navigation, ArrowLeft, Phone, MessageCircle, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { authAPI } from '@/lib/api/auth.api';
import { listingAPI } from '@/lib/api/listing.api';

export default function LodgeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { notification, showNotification, clearNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, [params.id, router]);

  const loadData = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      if (userData.role !== 'student') {
        router.push('/login');
        return;
      }
      setUser(userData as Student);

      const response = await listingAPI.getById(params.id as string);
      setListing(response.data as Listing);
    } catch (error) {
      console.error('Failed to load data:', error);
      showNotification('error', 'Failed to load listing details');
      setTimeout(() => router.push('/student/browse'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    showNotification('success', 'Payment successful! Please inspect the lodge before funds are released.');
    setTimeout(() => {
      router.push('/student/bookings');
    }, 2000);
  };

  const nextImage = () => {
    if (listing?.photos && listing.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.photos.length);
    }
  };

  const prevImage = () => {
    if (listing?.photos && listing.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

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
        <div className="space-y-4">
          {/* Main Carousel */}
          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group">
            {listing.photos && listing.photos.length > 0 ? (
              <>
                <img
                  src={listing.photos[currentImageIndex]}
                  alt={`${listing.lodgeName} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Navigation Arrows */}
                {listing.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {listing.photos.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-white text-2xl font-bold">
                {listing.lodgeName}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {listing.photos && listing.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-black scale-105'
                      : 'border-gray-300 hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
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

      {/* Payment Modal */}
      {listing && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          listing={listing}
          onSuccess={handlePaymentSuccess}
        />
      )}

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
