'use client';

export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Button } from '@/components/ui/Button';
import { dummyListings } from '@/lib/dummyData';
import { UNN_AREAS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Home, Navigation, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BrowseLodgesPage() {
  const [filters, setFilters] = useState({
    area: '',
    maxPrice: '',
    searchQuery: '',
  });
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = filters.area || filters.maxPrice || filters.searchQuery;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">
              AVAILABLE LODGES
            </h1>
            <p className="text-sm text-gray-600">
              Discover quality accommodations near UNN campus
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-initial md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="Search by name or location..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all",
                showFilters || hasActiveFilters
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="flex items-center justify-center w-5 h-5 text-xs bg-white text-black rounded-full">
                  {[filters.area, filters.maxPrice].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide">Filter Options</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2">
                  Area
                </label>
                <select
                  name="area"
                  value={filters.area}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                >
                  <option value="">All Areas</option>
                  {UNN_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2">
                  Max Price (₦)
                </label>
                <input
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Enter maximum price"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ area: '', maxPrice: '', searchQuery: '' })}
                  className="w-full px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between py-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {filteredListings.length} {filteredListings.length === 1 ? 'Property' : 'Properties'} Available
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters({ area: '', maxPrice: '', searchQuery: '' })}
              className="text-xs font-semibold text-gray-600 hover:text-black transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((listing) => (
              <Link 
                key={listing.id} 
                href={`/student/lodges/${listing.id}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  {/* Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title & Area */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-base flex-1 line-clamp-1">
                        {listing.lodgeName}
                      </h3>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">
                        {listing.area}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {listing.distanceFromUNN}km from UNN
                      </p>
                    </div>

                    {/* Price & Slots */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-lg font-bold text-black">
                          {formatCurrency(listing.pricePerYear)}
                        </p>
                        <p className="text-xs text-gray-500">per year</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-black">
                          {listing.availableSlots}
                        </p>
                        <p className="text-xs text-gray-500">slots left</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-2">
                No Lodges Found
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                We couldn't find any properties matching your search criteria. Try adjusting your filters or search term.
              </p>
              <button
                onClick={() => setFilters({ area: '', maxPrice: '', searchQuery: '' })}
                className="px-6 py-2.5 bg-black text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
