import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(request: NextRequest) {
  console.log('✅ [API /api/verify-account] POST request received');
  
  try {
    const { accountNumber, bankCode } = await request.json();
    console.log('✅ [API /api/verify-account] Account:', accountNumber, 'Bank code:', bankCode);

    // Validate input
    if (!accountNumber || !bankCode) {
      console.warn('⚠️ [API /api/verify-account] Missing required fields');
      return NextResponse.json({
        success: false,
        error: 'Account number and bank code are required'
      }, { status: 400 });
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      console.warn('⚠️ [API /api/verify-account] Invalid account number format');
      return NextResponse.json({
        success: false,
        error: 'Account number must be exactly 10 digits'
      }, { status: 400 });
    }

    // If no API key, return mock success for development
    if (!PAYSTACK_SECRET_KEY) {
      console.log('✅ [API /api/verify-account] No Paystack API key, returning mock verification');
      return NextResponse.json({
        success: true,
        accountName: 'TEST ACCOUNT NAME',
        mock: true
      });
    }

    console.log('✅ [API /api/verify-account] Calling Paystack API...');
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ [API /api/verify-account] Paystack response status:', response.status);
    const data = await response.json();
    console.log('✅ [API /api/verify-account] Paystack response data:', data);

    if (response.ok && data.status && data.data) {
      console.log('✅ [API /api/verify-account] Verification successful:', data.data.account_name);
      return NextResponse.json({
        success: true,
        accountName: data.data.account_name
      });
    } else {
      console.error('❌ [API /api/verify-account] Verification failed:', data.message);
      return NextResponse.json({
        success: false,
        error: data.message || 'Unable to verify account. Please check the details and try again.'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ [API /api/verify-account] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Network error. Please check your connection and try again.'
    }, { status: 500 });
  }
}
