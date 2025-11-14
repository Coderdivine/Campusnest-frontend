'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LandlordLayout from '@/components/layouts/LandlordLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Landlord, Listing } from '@/types';
import { getLandlordListings } from '@/lib/dummyData';
import { formatCurrency, cn } from '@/lib/utils';
import { Home, MapPin, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';

export default function LandlordListingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<Landlord | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    setListings(userListings);
  }, [router]);

  if (!user) return null;

  return (
    <LandlordLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
              My Listings
            </h1>
            <p className="text-gray-600">
              Manage all your property listings
            </p>
          </div>
          <Link href="/landlord/create-listing">
            <Button variant="primary">
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                No Listings Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first listing to start receiving bookings from students
              </p>
              <Link href="/landlord/create-listing">
                <Button size="lg">Create Your First Listing</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group"
              >
                {/* Image Section */}
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-300" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold',
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {listing.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Header with Title and Menu */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 truncate">
                        {listing.lodgeName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{listing.area}</span>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === listing.id ? null : listing.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                      
                      {openDropdown === listing.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">View Details</span>
                            </button>
                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                              <Edit className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">Edit Listing</span>
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span className="font-medium">Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price and Slots */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Price per year</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(listing.pricePerYear)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Available slots</p>
                      <p className="text-lg font-bold text-gray-900">{listing.availableSlots}</p>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-3 text-xs text-gray-500">
                    <span>{listing.distanceFromUNN}km from UNN</span>
                    <span className="truncate ml-2">{listing.lodgeAddress.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LandlordLayout>
  );
}
