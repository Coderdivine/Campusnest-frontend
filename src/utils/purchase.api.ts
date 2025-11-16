import api from './api';
import { Purchase } from '@/types';

interface PurchaseResponse {
  message: string;
  data: Purchase | Purchase[];
}

interface CreatePurchaseData {
  listingId: string;
  landlordId: string;
  amount: number;
  paystackReference: string;
}

interface UpdateInspectionData {
  inspectionStatus: 'Approved' | 'Rejected';
}

export const purchaseAPI = {
  // Create purchase (student only)
  create: async (data: CreatePurchaseData): Promise<PurchaseResponse> => {
    const response = await api.post('/v2/purchases', data);
    return response.data;
  },

  // Get student's purchases
  getMyPurchases: async (): Promise<PurchaseResponse> => {
    const response = await api.get('/v2/purchases/student/my-purchases');
    return response.data;
  },

  // Get landlord's purchases
  getLandlordPurchases: async (): Promise<PurchaseResponse> => {
    const response = await api.get('/v2/purchases/landlord/my-purchases');
    return response.data;
  },

  // Get single purchase by ID
  getById: async (purchaseId: string): Promise<PurchaseResponse> => {
    const response = await api.get(`/v2/purchases/${purchaseId}`);
    return response.data;
  },

  // Update inspection status (student only)
  updateInspection: async (purchaseId: string, data: UpdateInspectionData): Promise<PurchaseResponse> => {
    const response = await api.put(`/v2/purchases/${purchaseId}/inspection`, data);
    return response.data;
  },
};
