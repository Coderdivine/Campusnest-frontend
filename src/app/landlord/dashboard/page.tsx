'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LandlordLayout from '@/components/layouts/LandlordLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Landlord, Listing, Purchase } from '@/types';
import { getLandlordListings, getLandlordPurchases } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandlordDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Landlord | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'released'>('all');

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(currentUser) as Landlord;
    if (userData.role !== 'landlord') {
      router.push('/login');
      return;
    }

    setUser(userData);
    const userListings = getLandlordListings(userData.id);
    const userPurchases = getLandlordPurchases(userData.id);
    setListings(userListings);
    setPurchases(userPurchases);
  }, [router]);

  const stats = {
    totalListings: listings.length,
    totalBookings: purchases.length,
    totalRevenue: purchases
      .filter(p => p.paymentStatus === 'Released')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return purchase.paymentStatus === 'Paid';
    if (activeTab === 'pending') return purchase.paymentStatus === 'Pending';
    if (activeTab === 'released') return purchase.paymentStatus === 'Released';
    return false;
  });

  if (!user) return null;

  const userHandle = user.email.split('@')[0];

  return (
    <LandlordLayout>
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
            <p className="text-sm text-gray-500">Manage your properties and bookings</p>
          </div>
          <Link href="/landlord/create-listing">
            <Button variant="primary" className="rounded-full" size="lg">
              <Plus className="h-5 w-5" />
              CREATE LISTING
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Stat - Dark Card */}
          <div className="bg-black rounded-xl p-4">
            <p className="text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wide">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
          </div>

          {/* Secondary Stats - White Cards */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Total Listings
            </p>
            <p className="text-3xl font-bold text-black">{stats.totalListings}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Total Bookings
            </p>
            <p className="text-3xl font-bold text-black">{stats.totalBookings}</p>
          </div>
        </div>

        {/* Bookings Section with Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 pt-6">
            <div className="flex gap-8 overflow-x-auto">
              {(['all', 'active', 'pending', 'released'] as const).map((tab) => (
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
                   tab === 'active' ? 'ACTIVE' :
                   tab === 'pending' ? 'PENDING' : 'RELEASED'}
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
                <Link href="/landlord/create-listing">
                  <button className="text-sm font-medium underline underline-offset-4 decoration-2 hover:text-black transition-colors">
                    CREATE YOUR FIRST LISTING
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Booking Ref</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Student</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Lodge</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Payment Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Inspection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases.map((purchase, index) => (
                      <tr 
                        key={purchase.id}
                        className={cn(
                          'border-b border-gray-100 hover:bg-gray-50 transition-colors',
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        )}
                      >
                        <td className="py-5 px-4 font-medium text-sm">{purchase.bookingRef}</td>
                        <td className="py-5 px-4 text-sm font-semibold">
                          {purchase.student?.fullName || 'N/A'}
                        </td>
                        <td className="py-5 px-4 text-sm text-gray-600">
                          {purchase.listing?.lodgeName || 'N/A'}
                        </td>
                        <td className="py-5 px-4 text-sm font-semibold">
                          {formatCurrency(purchase.amount)}
                        </td>
                        <td className="py-5 px-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            purchase.paymentStatus === 'Released' ? 'bg-green-100 text-green-800' :
                            purchase.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-800' :
                            purchase.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          )}>
                            {purchase.paymentStatus}
                          </span>
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

        {/* My Listings Section */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-bold uppercase tracking-wide">My Listings</h2>
            <Link href="/landlord/listings">
              <button className="text-sm font-medium underline underline-offset-4 decoration-2 hover:text-black transition-colors">
                VIEW ALL
              </button>
            </Link>
          </div>
          
          <div className="p-6">
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-extrabold uppercase mb-2">
                  No Listings Yet
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Create your first listing to start receiving bookings
                </p>
                <Link href="/landlord/create-listing">
                  <Button variant="primary" className="rounded-full">
                    <Plus className="h-4 w-4" />
                    CREATE LISTING
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.slice(0, 6).map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-base line-clamp-1">{listing.lodgeName}</h4>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-bold uppercase',
                            listing.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {listing.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{listing.area}</p>
                      <p className="text-lg font-bold mb-3">
                        {formatCurrency(listing.pricePerYear)}<span className="text-sm font-normal text-gray-500">/year</span>
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{listing.availableSlots} slots</span>
                        <Link href={`/landlord/listings`}>
                          <button className="text-black font-semibold hover:underline">
                            MANAGE →
                          </button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </LandlordLayout>
  );
}
