'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';
import { shops } from '@/lib/db/data';
import { MenuItem, OrderItemVariant } from '@/lib/db/schema';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    selectedShopId,
    deliveryType,
    setDeliveryType,
    getSubtotal,
    getDeliveryFee,
    getTotal
  } = useCart();

  const selectedShop = shops.find(s => s.id === selectedShopId);
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Left Sidebar - Color Filler */}
        <div className="hidden xl:block fixed left-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

        {/* Right Sidebar - Color Filler */}
        <div className="hidden xl:block fixed right-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

        <div className="xl:mx-32 flex flex-col items-center justify-center min-h-screen">
          <ShoppingCart size={80} className="text-orange-300 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 text-lg">Add some delicious burgers to get started</p>
          <Link
            href="/menu"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
          >
            Browse Menu
          </Link>
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
              <Link href="/menu" className="flex items-center gap-2 text-white hover:text-orange-200 transition">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Menu</span>
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
              <button
                onClick={clearCart}
                className="text-white hover:text-red-300 transition font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600 mb-8">Review your order before checkout</p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Type Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                <h2 className="font-bold text-xl mb-4 text-gray-900">Order Type</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-105'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-105'
                    }`}
                  >
                    Pickup
                  </button>
                </div>
                {selectedShop && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                      {deliveryType === 'pickup' ? '📍 Pickup from: ' : '🚚 Delivering from: '}
                      <span className="font-bold">{selectedShop.name}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h2 className="font-bold text-xl text-gray-900">Items ({items.length})</h2>
                {items.map(item => {
                  const price = item.menuItem.base_price;
                  const selectedVariants = (item.menuItem as MenuItem & { selectedVariants?: OrderItemVariant[] }).selectedVariants || [];

                  return (
                    <div key={item.menuItem.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{item.menuItem.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{item.menuItem.description}</p>

                          {/* Show selected variants */}
                          {selectedVariants.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {selectedVariants.map((variant: OrderItemVariant, idx: number) => (
                                <div key={idx} className="text-sm text-gray-700 bg-gray-50 inline-block px-2 py-1 rounded mr-2">
                                  • {variant.variant_name}
                                  {variant.price_adjustment !== 0 && (
                                    <span className="ml-1 font-medium text-orange-600">
                                      ({variant.price_adjustment > 0 ? '+' : ''}{formatCurrency(variant.price_adjustment)})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {item.specialInstructions && (
                            <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-sm text-amber-900">
                                <span className="font-semibold">Note:</span> {item.specialInstructions}
                              </p>
                            </div>
                          )}
                          <p className="text-orange-600 font-bold text-xl mt-3">
                            {formatCurrency(price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                              className="w-9 h-9 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center transition text-gray-700 shadow-sm"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900 text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="w-9 h-9 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 flex items-center justify-center transition shadow-md"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.menuItem.id)}
                            className="text-red-500 hover:text-red-600 transition flex items-center gap-2 font-medium"
                          >
                            <Trash2 size={20} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border-2 border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Delivery Fee</span>
                      <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-orange-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-lg flex items-center justify-center text-lg"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/menu"
                  className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Add More Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}