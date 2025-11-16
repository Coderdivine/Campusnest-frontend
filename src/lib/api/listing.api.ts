import { api } from './api';
import { Listing } from '@/types';

export const listingAPI = {
  // Get all listings with optional filters
  getAll: async (filters?: {
    area?: string;
    maxPrice?: number;
    searchQuery?: string;
  }) => {
    const response = await api.get('/v2/listings', { params: filters });
    return response.data;
  },

  // Get single listing by ID
  getById: async (id: string) => {
    const response = await api.get(`/v2/listings/${id}`);
    return response.data;
  },

  // Get listings for current landlord
  getMyListings: async () => {
    const response = await api.get('/v2/listings/landlord/my-listings');
    return response.data;
  },

  // Create new listing
  create: async (data: any) => {
    const response = await api.post('/v2/listings', data);
    return response.data;
  },

  // Update listing
  update: async (id: string, data: any) => {
    const response = await api.put(`/v2/listings/${id}`, data);
    return response.data;
  },

  // Delete listing
  delete: async (id: string) => {
    const response = await api.delete(`/v2/listings/${id}`);
    return response.data;
  },

  // Update listing status
  updateStatus: async (id: string, status: 'active' | 'closed') => {
    const response = await api.patch(`/v2/listings/${id}/status`, { status });
    return response.data;
  },
};
