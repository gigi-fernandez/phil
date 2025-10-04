'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatCurrency, getOrderStatusColor, getOrderStatusText } from '@/lib/utils';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      // Sort by created_at descending (newest first)
      const sortedOrders = storedOrders.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
      setLoading(false);
    };

    loadOrders();

    // Poll for updates every 10 seconds
    const interval = setInterval(loadOrders, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading orders...</p>
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
        <nav className="sticky top-0 z-40 bg-green-700 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-12 w-12">
                  <Image
                    src="/brand/logo-small-transparent.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative h-12 w-40">
                  <Image
                    src="/brand/logo-text-white.png"
                    alt="Hungry Mays"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-6 text-white">
                <Link href="/" className="hover:text-orange-200 transition font-medium">
                  Home
                </Link>
                <Link href="/menu" className="hover:text-orange-200 transition font-medium">
                  Menu
                </Link>
                <Link
                  href="/menu"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-md"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">View all your previous orders from this device</p>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag size={80} className="text-orange-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">No orders yet</h2>
              <p className="text-gray-600 mb-8 text-lg">Start by ordering some delicious burgers!</p>
              <Link
                href="/menu"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="block bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-4 rounded-xl text-white ${getOrderStatusColor(order.status)} shadow-lg`}>
                        <Package size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusColor(order.status)} text-white`}>
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          <span className="font-medium">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </span>
                          <span className="font-medium">
                            {order.delivery_type === 'delivery' ? '🚚 Delivery' : '📍 Pickup'}
                          </span>
                          <span className="font-medium">
                            {order.payment_method === 'cash' ? '💵 Cash' : '💳 Card'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-orange-600">{formatCurrency(order.total)}</p>
                      </div>
                      <ChevronRight size={28} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
