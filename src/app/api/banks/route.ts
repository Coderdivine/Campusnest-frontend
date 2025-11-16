import { NextResponse } from 'next/server';

export const runtime = 'edge';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

// Fallback list of major Nigerian banks
const FALLBACK_BANKS = [
  { id: 1, name: 'Access Bank', code: '044', slug: 'access-bank', longcode: '044150149', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 2, name: 'Guaranty Trust Bank', code: '058', slug: 'guaranty-trust-bank', longcode: '058152036', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 3, name: 'United Bank For Africa', code: '033', slug: 'united-bank-for-africa', longcode: '033153513', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 4, name: 'Zenith Bank', code: '057', slug: 'zenith-bank', longcode: '057150013', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 5, name: 'First Bank of Nigeria', code: '011', slug: 'first-bank-of-nigeria', longcode: '011151003', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 6, name: 'Stanbic IBTC Bank', code: '221', slug: 'stanbic-ibtc-bank', longcode: '221159522', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 7, name: 'Fidelity Bank', code: '070', slug: 'fidelity-bank', longcode: '070150010', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 8, name: 'Polaris Bank', code: '076', slug: 'polaris-bank', longcode: '076151006', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 9, name: 'Union Bank of Nigeria', code: '032', slug: 'union-bank-of-nigeria', longcode: '032080474', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 10, name: 'Ecobank Nigeria', code: '050', slug: 'ecobank-nigeria', longcode: '050150010', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 11, name: 'Wema Bank', code: '035', slug: 'wema-bank', longcode: '035150103', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 12, name: 'Sterling Bank', code: '232', slug: 'sterling-bank', longcode: '232150016', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 13, name: 'Kuda Bank', code: '50211', slug: 'kuda-bank', longcode: '50211', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 14, name: 'OPay', code: '999992', slug: 'opay', longcode: '999992', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 15, name: 'PalmPay', code: '999991', slug: 'palmpay', longcode: '999991', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
  { id: 16, name: 'FCMB', code: '214', slug: 'fcmb', longcode: '214150018', gateway: null, pay_with_bank: false, active: true, country: 'Nigeria', currency: 'NGN', type: 'nuban' },
];

export async function GET() {
  console.log('🏦 [API /api/banks] GET request received');
  
  try {
    // If no API key, return fallback banks
    if (!PAYSTACK_SECRET_KEY) {
      console.log('🏦 [API /api/banks] No Paystack API key found, using fallback banks');
      console.log('🏦 [API /api/banks] Returning', FALLBACK_BANKS.length, 'fallback banks');
      return NextResponse.json({
        success: true,
        data: FALLBACK_BANKS,
        source: 'fallback'
      });
    }

    console.log('🏦 [API /api/banks] API key found, calling Paystack API...');
    const response = await fetch('https://api.paystack.co/bank?country=nigeria', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🏦 [API /api/banks] Paystack API response status:', response.status);

    if (!response.ok) {
      console.error('🏦 [API /api/banks] Paystack API error:', response.status);
      console.log('🏦 [API /api/banks] Falling back to hardcoded banks');
      return NextResponse.json({
        success: true,
        data: FALLBACK_BANKS,
        source: 'fallback'
      });
    }

    const data = await response.json();
    console.log('🏦 [API /api/banks] Paystack API returned data:', data.status);

    if (data.status && data.data) {
      const banks = data.data
        .filter((bank: any) => bank.active)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      console.log('🏦 [API /api/banks] Returning', banks.length, 'banks from Paystack');
      return NextResponse.json({
        success: true,
        data: banks,
        source: 'paystack'
      });
    }

    console.log('🏦 [API /api/banks] No valid data from Paystack, using fallback');
    return NextResponse.json({
      success: true,
      data: FALLBACK_BANKS,
      source: 'fallback'
    });
  } catch (error) {
    console.error('❌ [API /api/banks] Error fetching banks:', error);
    console.log('🏦 [API /api/banks] Returning fallback banks due to error');
    return NextResponse.json({
      success: true,
      data: FALLBACK_BANKS,
      source: 'fallback'
    });
  }
}
