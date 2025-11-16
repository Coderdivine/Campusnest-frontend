import { api } from './api';
import { Purchase } from '@/types';

export const purchaseAPI = {
  // Create new purchase/booking
  create: async (data: {
    listingId: string;
    amount: number;
  }) => {
    const response = await api.post('/v2/purchases', data);
    return response.data;
  },

  // Get all purchases for current student
  getMyPurchases: async () => {
    const response = await api.get('/v2/purchases/student/my-purchases');
    return response.data;
  },

  // Get all purchases for current landlord
  getLandlordPurchases: async () => {
    const response = await api.get('/v2/purchases/landlord/my-purchases');
    return response.data;
  },

  // Get single purchase by ID
  getById: async (id: string) => {
    const response = await api.get(`/v2/purchases/${id}`);
    return response.data;
  },

  // Update inspection status (student action)
  updateInspection: async (
    id: string,
    action: 'approve' | 'reject'
  ) => {
    const response = await api.put(`/v2/purchases/${id}/inspection`, {
      action,
    });
    return response.data;
  },

  // Request payment release (student approves inspection)
  requestRelease: async (id: string) => {
    return purchaseAPI.updateInspection(id, 'approve');
  },

  // Request refund (student rejects inspection)
  requestRefund: async (id: string) => {
    return purchaseAPI.updateInspection(id, 'reject');
  },

  // Update payment status (admin/system action)
  updatePaymentStatus: async (
    id: string,
    status: 'Pending' | 'Paid' | 'Released' | 'Refunded'
  ) => {
    const response = await api.patch(`/v2/purchases/${id}/payment-status`, {
      status,
    });
    return response.data;
  },

  // Verify payment (after Paystack payment)
  verifyPayment: async (reference: string) => {
    const response = await api.get(
      `/v2/purchases/verify-payment/${reference}`
    );
    return response.data;
  },
};
