'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Home,
  Phone,
  MapPin,
  ChefHat,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, getOrderStatusColor, getOrderStatusText } from '@/lib/utils';
import { shops } from '@/lib/db/data';
import { Order, OrderItem, OrderItemVariant } from '@/lib/db/schema';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load order from localStorage
    const loadOrder = () => {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setLoading(false);
    };

    loadOrder();

    // Poll for updates every 10 seconds
    const interval = setInterval(loadOrder, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Simulate order status progression
  useEffect(() => {
    if (!order || order.status === 'completed' || order.status === 'cancelled') return;

    const progressOrder = () => {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId);
      
      if (orderIndex !== -1) {
        const currentOrder = orders[orderIndex];
        const statusFlow = ['received', 'preparing', 'ready', 'out_for_delivery', 'completed'];
        const currentIndex = statusFlow.indexOf(currentOrder.status);
        
        if (currentIndex < statusFlow.length - 1 && currentIndex !== -1) {
          // Skip out_for_delivery for pickup orders
          let nextIndex = currentIndex + 1;
          if (currentOrder.delivery_type === 'pickup' && statusFlow[nextIndex] === 'out_for_delivery') {
            nextIndex++;
          }
          
          if (nextIndex < statusFlow.length) {
            orders[orderIndex].status = statusFlow[nextIndex];
            orders[orderIndex].updated_at = new Date().toISOString();
            localStorage.setItem('orders', JSON.stringify(orders));
            setOrder(orders[orderIndex]);
          }
        }
      }
    };

    // Progress order status every 30 seconds for demo
    const timeout = setTimeout(progressOrder, 30000);

    return () => clearTimeout(timeout);
  }, [order, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Left Sidebar */}
        <div className="hidden xl:block fixed left-0 top-0 h-full w-32 bg-orange-600 z-30"></div>
        {/* Right Sidebar */}
        <div className="hidden xl:block fixed right-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

        <div className="xl:mx-32 flex flex-col items-center justify-center min-h-screen">
          <AlertCircle size={80} className="text-orange-300 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order not found</h1>
          <p className="text-gray-600 mb-8 text-lg">We couldn&apos;t find an order with ID: {orderId}</p>
          <Link
            href="/"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const shop = shops.find(s => s.id === order.shop_id);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'received': return <Package className="w-6 h-6" />;
      case 'preparing': return <ChefHat className="w-6 h-6" />;
      case 'ready': return <CheckCircle className="w-6 h-6" />;
      case 'out_for_delivery': return <Truck className="w-6 h-6" />;
      case 'completed': return <Home className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const statusSteps = order.delivery_type === 'pickup'
    ? ['received', 'preparing', 'ready', 'completed']
    : ['received', 'preparing', 'ready', 'out_for_delivery', 'completed'];

  const currentStatusIndex = statusSteps.indexOf(order.status);

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
                <Link href="/my-orders" className="hover:text-orange-200 transition font-medium">
                  My Orders
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Status Tracking */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-4 rounded-full text-white ${getOrderStatusColor(order.status)} shadow-lg`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{getOrderStatusText(order.status)}</h2>
                    <p className="text-gray-600 mt-1">
                      {order.status === 'preparing' && 'Your order is being prepared with care'}
                      {order.status === 'ready' && order.delivery_type === 'pickup' && 'Your order is ready for pickup!'}
                      {order.status === 'ready' && order.delivery_type === 'delivery' && 'Your order is ready and waiting for a driver'}
                      {order.status === 'out_for_delivery' && 'Your driver is on the way'}
                      {order.status === 'completed' && 'Thank you for your order!'}
                      {order.status === 'received' && 'We have received your order'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                  <div
                    className="absolute top-6 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                            index <= currentStatusIndex
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white scale-110'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {index <= currentStatusIndex ? (
                            <CheckCircle size={24} />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-3 text-center font-medium ${
                          index <= currentStatusIndex ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {step.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: OrderItem, index: number) => {
                    const itemPrice = item.final_price || item.base_price || 0;
                    return (
                      <div key={index} className="flex justify-between items-start py-4 border-b-2 last:border-0 border-gray-100">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            <span className="text-orange-600">{item.quantity}x</span> {item.name}
                          </p>
                          {item.selected_variants && item.selected_variants.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.selected_variants.map((v: OrderItemVariant) => v.variant_name).join(', ')}
                            </p>
                          )}
                          {item.special_instructions && (
                            <p className="text-sm bg-amber-50 text-amber-900 p-2 rounded mt-2">
                              <span className="font-semibold">Note:</span> {item.special_instructions}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-gray-900 ml-4">
                          {formatCurrency(itemPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery/Pickup Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  {order.delivery_type === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-orange-600 mt-1" size={24} />
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Contact</p>
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                      <p className="text-gray-700">{order.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-green-600 mt-1" size={24} />
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        {order.delivery_type === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                      </p>
                      {order.delivery_type === 'delivery' ? (
                        <p className="font-bold text-gray-900">{order.delivery_address}</p>
                      ) : (
                        <>
                          <p className="font-bold text-gray-900">{shop?.name}</p>
                          <p className="text-gray-700">{shop?.address}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Delivery Fee</span>
                      <span className="font-semibold">{formatCurrency(order.delivery_fee)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-orange-600">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Payment Method</p>
                  <p className="font-bold text-gray-900">
                    {order.payment_method === 'cash'
                      ? `💵 Cash on ${order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}`
                      : '💳 Paid Online'
                    }
                  </p>
                </div>
                {order.notes && (
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Order Notes</p>
                    <p className="text-gray-900 bg-amber-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 text-center mb-3">
                    📱 Share this link to track your order:
                  </p>
                  <div className="p-3 bg-gray-100 rounded-xl text-xs text-center break-all font-mono border-2 border-gray-200">
                    {typeof window !== 'undefined' && `${window.location.origin}/order/${order.id}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}