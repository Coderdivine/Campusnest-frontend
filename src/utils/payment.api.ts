import api from './api';

interface InitializePaymentData {
  email: string;
  amount: number;
  listingId: string;
  landlordId: string;
}

interface InitializePaymentResponse {
  message: string;
  data: {
    success: boolean;
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerifyPaymentResponse {
  message: string;
  data: {
    success: boolean;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata: any;
    gateway_response: string;
  };
}

interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
}

interface BankVerificationData {
  account_number: string;
  bank_code: string;
}

interface BankVerificationResponse {
  message: string;
  data: {
    success: boolean;
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

interface CreateRecipientData {
  name: string;
  account_number: string;
  bank_code: string;
}

interface TransferData {
  amount: number;
  recipient: string;
  reason?: string;
}

export const paymentAPI = {
  /**
   * Initialize a payment transaction
   */
  initializePayment: async (data: InitializePaymentData): Promise<InitializePaymentResponse> => {
    const response = await api.post('/v2/payments/initialize', data);
    return response.data;
  },

  /**
   * Verify a payment transaction
   */
  verifyPayment: async (reference: string): Promise<VerifyPaymentResponse> => {
    const response = await api.get(`/v2/payments/verify/${reference}`);
    return response.data;
  },

  /**
   * Get list of Nigerian banks
   */
  getBanks: async (): Promise<{ message: string; data: Bank[] }> => {
    const response = await api.get('/v2/payments/banks');
    return response.data;
  },

  /**
   * Verify bank account number
   */
  verifyBankAccount: async (data: BankVerificationData): Promise<BankVerificationResponse> => {
    const response = await api.post('/v2/payments/verify-account', data);
    return response.data;
  },

  /**
   * Create transfer recipient (landlord only)
   */
  createRecipient: async (data: CreateRecipientData): Promise<any> => {
    const response = await api.post('/v2/payments/create-recipient', data);
    return response.data;
  },

  /**
   * Initiate transfer (landlord only)
   */
  initiateTransfer: async (data: TransferData): Promise<any> => {
    const response = await api.post('/v2/payments/transfer', data);
    return response.data;
  },

  /**
   * Verify transfer (landlord only)
   */
  verifyTransfer: async (reference: string): Promise<any> => {
    const response = await api.get(`/v2/payments/transfer/verify/${reference}`);
    return response.data;
  },
};
