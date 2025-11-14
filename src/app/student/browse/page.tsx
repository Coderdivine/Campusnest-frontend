'use client';

import { useState } from 'react';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { dummyListings } from '@/lib/dummyData';
import { UNN_AREAS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { MapPin, DollarSign, Users, Search } from 'lucide-react';

export default function BrowseLodgesPage() {
  const [filters, setFilters] = useState({
    area: '',
    maxPrice: '',
    searchQuery: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const filteredListings = dummyListings.filter(listing => {
    if (filters.area && listing.area !== filters.area) return false;
    if (filters.maxPrice && listing.pricePerYear > parseInt(filters.maxPrice)) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        listing.lodgeName.toLowerCase().includes(query) ||
        listing.lodgeAddress.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
            Browse Lodges
          </h1>
          <p className="text-gray-600">
            Find your perfect accommodation near UNN
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search lodges..."
                  className="pl-10"
                />
              </div>

              <Select
                name="area"
                value={filters.area}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'All Areas' },
                  ...UNN_AREAS.map(area => ({ value: area, label: area })),
                ]}
              />

              <Input
                name="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price (₦)"
              />

              <Button
                variant="secondary"
                onClick={() => setFilters({ area: '', maxPrice: '', searchQuery: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide">
            {filteredListings.length} {filteredListings.length === 1 ? 'Lodge' : 'Lodges'} Found
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-white text-sm font-semibold">
                  {listing.lodgeName}
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg mb-2">{listing.lodgeName}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{listing.lodgeAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{formatCurrency(listing.pricePerYear)}/year</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{listing.availableSlots} slots available</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 rounded">
                    {listing.area}
                  </span>
                  <Link href={`/student/lodges/${listing.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-wide mb-2">
                No Lodges Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more results
              </p>
              <Button
                variant="secondary"
                onClick={() => setFilters({ area: '', maxPrice: '', searchQuery: '' })}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
