'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<any>({});

  const amount = searchParams.get('amount');
  const orderId = searchParams.get('order_id');
  const displayAmount = amount ? parseInt(amount) / 100 : 0;

  useEffect(() => {
    // If no order ID or amount, redirect back
    if (!orderId || !amount) {
      router.push('/cart');
    }
  }, [orderId, amount, router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardName) {
      newErrors.cardName = 'Please enter the cardholder name';
    }

    if (!expiryDate || expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    }

    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update order payment status in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].payment_status = 'paid';
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Clear pending order from sessionStorage
    sessionStorage.removeItem('pendingOrderId');

    // Redirect to order confirmation
    router.push(`/order/${orderId}?payment=success`);
  };

  const handleCancel = () => {
    // Mark order as cancelled
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'cancelled';
      orders[orderIndex].payment_status = 'cancelled';
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Redirect back to cart
    router.push('/cart');
  };

  if (!orderId || !amount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Left Sidebar - Color Filler */}
      <div className="hidden xl:block fixed left-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

      {/* Right Sidebar - Color Filler */}
      <div className="hidden xl:block fixed right-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

      {/* Main Content */}
      <div className="xl:mx-32">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-green-700 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 text-white hover:text-orange-200 transition"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Cancel Payment</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <Image
                    src="/brand/logo-small-transparent.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-8 w-28">
                  <Image
                    src="/brand/logo-text-white.png"
                    alt="Hungry Mays"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-white" />
                <span className="text-sm text-white font-medium">Secure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Mock Stripe Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                stripe
              </div>
              <span className="text-sm font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">TEST MODE</span>
            </div>
            <p className="text-gray-600">This is a mock payment page for testing</p>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Order Payment</h2>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Order #{orderId}</span>
                <span className="text-3xl font-bold text-orange-600">
                  {formatCurrency(displayAmount)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      className={`w-full px-4 py-4 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <CreditCard className="absolute left-4 top-4.5 text-gray-400" size={20} />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{errors.cardNumber}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded">💳 Test card: 4242 4242 4242 4242</p>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.cardName ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{errors.cardName}</p>
                  )}
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                      maxLength={5}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{errors.expiryDate}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Any future date</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      placeholder="123"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.cvv ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{errors.cvv}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Any 3-4 digits</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={22} />
                    Pay {formatCurrency(displayAmount)}
                  </>
                )}
              </button>
            </form>

            {/* Test Mode Notice */}
            <div className="mt-6 p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <p className="text-sm text-amber-900 font-medium">
                <strong className="font-bold">🧪 Test Mode:</strong> This is a mock payment page. Use test card <code className="bg-amber-100 px-2 py-1 rounded font-mono">4242 4242 4242 4242</code> with any future expiry date and any 3-digit CVV.
              </p>
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium mb-4">Your payment information is secure and encrypted</p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <span className="flex items-center gap-2">🔒 <strong>SSL Secured</strong></span>
              <span className="flex items-center gap-2">✓ <strong>PCI Compliant</strong></span>
              <span className="flex items-center gap-2">🛡️ <strong>Fraud Protection</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}