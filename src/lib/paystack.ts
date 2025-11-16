// Paystack utility functions
// All API calls go through the backend for security

import { paymentAPI } from '@/utils/payment.api';

export interface Bank {
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

export interface BankVerificationResponse {
  account_number: string;
  account_name: string;
  bank_id: number;
}

export interface PaystackPopupOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  onClose: () => void;
  callback: (response: { reference: string }) => void;
}

/**
 * Load Paystack inline script
 */
export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Paystack payment popup
 */
export async function openPaystackPopup(options: PaystackPopupOptions): Promise<void> {
  const loaded = await loadPaystackScript();
  
  if (!loaded) {
    throw new Error('Failed to load Paystack script');
  }

  const handler = (window as any).PaystackPop.setup({
    key: options.key,
    email: options.email,
    amount: options.amount * 100, // Convert to kobo
    ref: options.ref,
    onClose: options.onClose,
    callback: options.callback,
  });

  handler.openIframe();
}

/**
 * Fetch list of Nigerian banks from backend
 */
export async function fetchBankList(): Promise<Bank[]> {
  console.log('🏦 [paystack.ts] fetchBankList called');
  try {
    console.log('🏦 [paystack.ts] Fetching from backend API...');
    const response = await paymentAPI.getBanks();

    console.log('🏦 [paystack.ts] Response:', response);
    
    if (response.data) {
      console.log('🏦 [paystack.ts] Returning', response.data.length, 'banks');
      return response.data;
    }

    console.warn('🏦 [paystack.ts] No data in response, returning empty array');
    return [];
  } catch (error) {
    console.error('❌ [paystack.ts] Error fetching banks:', error);
    return [];
  }
}

/**
 * Verify bank account number and get account name via backend
 */
export async function verifyBankAccount(
  accountNumber: string,
  bankCode: string
): Promise<{ success: boolean; accountName?: string; error?: string }> {
  console.log('✅ [paystack.ts] verifyBankAccount called');
  console.log('✅ [paystack.ts] Account:', accountNumber, 'Bank code:', bankCode);
  
  try {
    // Validate account number format (10 digits for Nigerian banks)
    if (!/^\d{10}$/.test(accountNumber)) {
      console.warn('⚠️ [paystack.ts] Invalid account number format');
      return {
        success: false,
        error: 'Account number must be exactly 10 digits'
      };
    }

    console.log('✅ [paystack.ts] Calling backend API...');
    const response = await paymentAPI.verifyBankAccount({
      account_number: accountNumber,
      bank_code: bankCode
    });

    console.log('✅ [paystack.ts] Response:', response);

    if (response.data && response.data.success) {
      console.log('✅ [paystack.ts] Verification successful:', response.data.account_name);
      return {
        success: true,
        accountName: response.data.account_name
      };
    } else {
      console.error('❌ [paystack.ts] Verification failed');
      return {
        success: false,
        error: 'Unable to verify account. Please check the details and try again.'
      };
    }
  } catch (error: any) {
    console.error('❌ [paystack.ts] Error verifying bank account:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Network error. Please check your connection and try again.'
    };
  }
}
