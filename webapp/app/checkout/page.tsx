'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { formatCurrency, generateOrderId } from '@/lib/utils';
import { shops } from '@/lib/db/data';
import dynamic from 'next/dynamic';
import SimpleAddressInput from '@/components/SimpleAddressInput';

// Dynamically import AddressMapPicker to avoid SSR issues with Google Maps
const AddressMapPicker = dynamic(() => import('@/components/AddressMapPicker'), { 
  ssr: false,
  loading: () => <SimpleAddressInput address="" onAddressChange={() => {}} />
});

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    selectedShopId, 
    deliveryType, 
    getSubtotal, 
    getDeliveryFee, 
    getTotal,
    clearCart
  } = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedShop = shops.find(s => s.id === selectedShopId);
  const total = getTotal();

  // Use useEffect for navigation to avoid render-time state updates
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [items.length, router, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate order ID
    const orderId = generateOrderId();

    // Store order in localStorage (in production, this would go to database)
    const order = {
      id: orderId,
      shop_id: selectedShopId,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email,
      delivery_address: deliveryType === 'delivery' ? customerInfo.address : undefined,
      delivery_type: deliveryType,
      items: items.map(item => {
        const price = (item.menuItem as any).price || item.menuItem.base_price;
        const selectedVariants = (item.menuItem as any).selectedVariants || [];
        return {
          menu_item_id: item.menuItem.id,
          name: item.menuItem.name,
          base_price: item.menuItem.base_price || price,
          final_price: price,
          quantity: item.quantity,
          selected_variants: selectedVariants,
          special_instructions: item.specialInstructions
        };
      }),
      subtotal: getSubtotal(),
      delivery_fee: getDeliveryFee(),
      total: total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cash' ? 'pending' : 'paid',
      status: 'received',
      notes: customerInfo.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Store order
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // For online payment, redirect to payment gateway
    if (paymentMethod === 'online') {
      // Store order ID in sessionStorage for return from payment
      sessionStorage.setItem('pendingOrderId', orderId);
      
      // Clear cart after storing order
      clearCart();
      
      // Redirect to our mock payment page
      router.push(`/payment?amount=${total * 100}&order_id=${orderId}`);
    } else {
      // For cash payment, clear cart and redirect to order tracking
      clearCart();
      router.push(`/order/${orderId}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Redirecting to cart...</p>
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
              <Link href="/cart" className="flex items-center gap-2 text-white hover:text-orange-200 transition">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Cart</span>
              </Link>
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
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your order details</p>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
              </div>

                {/* Delivery Information */}
                {deliveryType === 'delivery' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Delivery Address</h2>
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
                   process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' ? (
                    <AddressMapPicker
                      address={customerInfo.address}
                      onAddressChange={(address, coordinates) => {
                        setCustomerInfo({...customerInfo, address});
                      }}
                    />
                  ) : (
                    <SimpleAddressInput
                      address={customerInfo.address}
                      onAddressChange={(address) => {
                        setCustomerInfo({...customerInfo, address});
                      }}
                    />
                  )}
                </div>
              )}

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Payment Method</h2>
                  <div className="space-y-4">
                    <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mr-4 w-5 h-5 text-orange-600"
                      />
                      <CreditCard className="mr-4 text-orange-600" size={24} />
                      <div>
                        <div className="font-semibold text-gray-900">Pay Online</div>
                        <div className="text-sm text-gray-600">Credit/Debit Card, PayPal</div>
                      </div>
                    </label>
                    <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="mr-4 w-5 h-5 text-green-600"
                      />
                      <DollarSign className="mr-4 text-green-600" size={24} />
                      <div>
                        <div className="font-semibold text-gray-900">Cash on {deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</div>
                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Order Notes</h2>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    placeholder="Any special instructions for your order..."
                  />
                </div>
            </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border-2 border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {items.map(item => {
                      const price = (item.menuItem as any).price || item.menuItem.base_price || 0;
                      return (
                        <div key={item.menuItem.id} className="flex justify-between items-start text-sm">
                          <span className="flex-1 text-gray-700">
                            <span className="font-semibold text-orange-600">{item.quantity}x</span> {item.menuItem.name}
                          </span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {formatCurrency(price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">{formatCurrency(getSubtotal())}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Delivery Fee</span>
                        <span className="font-semibold">{formatCurrency(getDeliveryFee())}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
                      <span className="font-bold text-lg text-gray-900">Total</span>
                      <span className="font-bold text-2xl text-orange-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info */}
                  {selectedShop && (
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {deliveryType === 'pickup' ? '📍 Pickup from:' : '🚚 Order from:'}
                      </p>
                      <p className="font-bold text-gray-900">{selectedShop.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedShop.address}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? 'Processing...' : `Place Order • ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}