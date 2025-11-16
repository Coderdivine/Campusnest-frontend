'use client';

import { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { openPaystackPopup } from '@/lib/paystack';
import { paymentAPI } from '@/utils/payment.api';
import { purchaseAPI } from '@/utils/purchase.api';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  onSuccess?: () => void;
}

export default function PaymentModal({ isOpen, onClose, listing, onSuccess }: PaymentModalProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'confirm' | 'processing' | 'verifying'>('confirm');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!user || !user.email) {
      setError('User email is required');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setStep('processing');

      // Initialize payment with backend
      const initResponse = await paymentAPI.initializePayment({
        email: user.email,
        amount: listing.pricePerYear,
        listingId: listing.listing_id || listing.id,
        landlordId: listing.landlordId,
      });

      console.log('Payment initialized:', initResponse);

      const { reference, authorization_url } = initResponse.data;

      // Get Paystack public key from environment
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      
      if (!paystackPublicKey) {
        throw new Error('Paystack public key not configured');
      }

      // Open Paystack popup
      await openPaystackPopup({
        key: paystackPublicKey,
        email: user.email,
        amount: listing.pricePerYear,
        ref: reference,
        onClose: () => {
          if (step === 'processing') {
            setIsProcessing(false);
            setStep('confirm');
            setError('Payment was cancelled');
          }
        },
        callback: (response) => {
          console.log('Payment successful:', response);
          setStep('verifying');

          // Handle verification asynchronously
          (async () => {
            try {
              // Verify payment with backend
              const verifyResponse = await paymentAPI.verifyPayment(response.reference);
              console.log('Payment verified:', verifyResponse);

              if (verifyResponse.data.success && verifyResponse.data.status === 'success') {
                // Create purchase record
                const purchaseResponse = await purchaseAPI.create({
                  listingId: listing.listing_id || listing.id,
                  landlordId: listing.landlordId,
                  amount: listing.pricePerYear,
                  paystackReference: response.reference,
                });

                console.log('Purchase created:', purchaseResponse);

                // Success!
                if (onSuccess) {
                  onSuccess();
                }
                onClose();
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (verifyError: any) {
              console.error('Verification error:', verifyError);
              setError(verifyError.response?.data?.message || 'Failed to verify payment. Please contact support.');
              setStep('confirm');
            } finally {
              setIsProcessing(false);
            }
          })();
        },
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to initialize payment');
      setIsProcessing(false);
      setStep('confirm');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden md:mb-0 mb-0 md:animate-fade-in animate-slide-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <p className="text-white/90 text-sm">Secure payment with Paystack</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Listing Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Property
              </p>
              <p className="text-base font-semibold text-gray-900">{listing.lodgeName}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Amount
              </p>
              <p className="text-3xl font-bold text-emerald-600">
                ₦{listing.pricePerYear.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">/ year</p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Payment will be held securely until you inspect and approve the accommodation.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Status Messages */}
          {step === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-blue-800">
                Opening payment window...
              </p>
            </div>
          )}

          {step === 'verifying' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />
              <p className="text-sm font-medium text-yellow-800">
                Verifying payment...
              </p>
            </div>
          )}

          {/* Payment Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>Secure payment powered by Paystack</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>Supports cards, bank transfers, and USSD</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>Full refund if inspection fails</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₦{listing.pricePerYear.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
