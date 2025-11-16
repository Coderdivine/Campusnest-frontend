import api from './api';
import { Listing } from '@/types';

interface ListingResponse {
  message: string;
  data: Listing | Listing[];
}

interface CreateListingData {
  lodgeName: string;
  lodgeAddress: string;
  area: string;
  pricePerYear: number;
  availableSlots: number;
  distanceFromUNN: number;
  description: string;
  photos: string[];
  video?: string;
}

interface UpdateListingData extends Partial<CreateListingData> {
  status?: 'active' | 'closed';
}

interface ListingFilters {
  area?: string;
  maxPrice?: number;
  maxDistance?: number;
  searchQuery?: string;
}

export const listingAPI = {
  // Get all listings with optional filters
  getAll: async (filters?: ListingFilters): Promise<ListingResponse> => {
    const params = new URLSearchParams();
    if (filters?.area) params.append('area', filters.area);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.maxDistance) params.append('maxDistance', filters.maxDistance.toString());
    if (filters?.searchQuery) params.append('searchQuery', filters.searchQuery);
    
    const response = await api.get(`/v2/listings?${params.toString()}`);
    return response.data;
  },

  // Get single listing by ID
  getById: async (listingId: string): Promise<ListingResponse> => {
    const response = await api.get(`/v2/listings/${listingId}`);
    return response.data;
  },

  // Get landlord's listings
  getMyListings: async (): Promise<ListingResponse> => {
    const response = await api.get('/v2/listings/landlord/my-listings');
    return response.data;
  },

  // Create new listing (landlord only)
  create: async (data: CreateListingData): Promise<ListingResponse> => {
    const response = await api.post('/v2/listings', data);
    return response.data;
  },

  // Update listing (landlord only)
  update: async (listingId: string, data: UpdateListingData): Promise<ListingResponse> => {
    const response = await api.put(`/v2/listings/${listingId}`, data);
    return response.data;
  },

  // Delete listing (landlord only)
  delete: async (listingId: string): Promise<ListingResponse> => {
    const response = await api.delete(`/v2/listings/${listingId}`);
    return response.data;
  },
};
