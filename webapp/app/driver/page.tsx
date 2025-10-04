'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  Navigation, 
  Phone, 
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  Truck,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, getOrderStatusColor, getOrderStatusText } from '@/lib/utils';
import { shops } from '@/lib/db/data';

export default function DriverDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Filter orders for delivery only
    const deliveryOrders = allOrders.filter((o: any) => o.delivery_type === 'delivery');
    setOrders(deliveryOrders.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    // Poll for new orders every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'ready');
  const activeOrders = orders.filter(o => o.status === 'out_for_delivery');
  const completedOrders = orders.filter(o => o.status === 'completed').slice(0, 10); // Last 10

  const handleAcceptOrder = (orderId: string) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = allOrders.findIndex((o: any) => o.id === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = 'out_for_delivery';
      allOrders[orderIndex].updated_at = new Date().toISOString();
      allOrders[orderIndex].driver_id = 'driver-1'; // Mock driver ID
      localStorage.setItem('orders', JSON.stringify(allOrders));
      loadOrders();
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = allOrders.findIndex((o: any) => o.id === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = 'completed';
      allOrders[orderIndex].updated_at = new Date().toISOString();
      if (allOrders[orderIndex].payment_method === 'cash') {
        allOrders[orderIndex].payment_status = 'paid';
      }
      localStorage.setItem('orders', JSON.stringify(allOrders));
      loadOrders();
    }
  };

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
  };

  const OrderCard = ({ order, showActions }: { order: any, showActions: boolean }) => {
    const shop = shops.find(s => s.id === order.shop_id);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">Order #{order.id}</h3>
            <p className="text-gray-600 text-sm">
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-white text-sm ${getOrderStatusColor(order.status)}`}>
            {getOrderStatusText(order.status)}
          </span>
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4 mb-4">
          <h4 className="font-semibold mb-2">Customer</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-600" />
              <span>{order.customer_name} - {order.customer_phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-600 mt-1" />
              <span className="text-sm">{order.delivery_address}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-4 mb-4">
          <h4 className="font-semibold mb-2">Order Items</h4>
          <div className="space-y-1">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="text-sm">
                {item.quantity}x {item.name}
                {item.special_instructions && (
                  <span className="text-gray-700"> ({item.special_instructions})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Total */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-600" />
              <span className="text-sm">
                {order.payment_method === 'cash' ? 'Cash on Delivery' : 'Paid Online'}
              </span>
            </div>
            <span className="font-bold text-lg text-orange-500">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="border-t pt-4 mb-4">
          <h4 className="font-semibold mb-2">Pickup From</h4>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-600 mt-1" />
            <div>
              <p className="font-medium">{shop?.name}</p>
              <p className="text-sm text-gray-600">{shop?.address}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {order.status === 'ready' && (
              <>
                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  <Truck size={20} />
                  Accept Delivery
                </button>
                <a
                  href={getDirectionsUrl(order.delivery_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Navigation size={20} />
                </a>
              </>
            )}
            {order.status === 'out_for_delivery' && (
              <>
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Complete Delivery
                </button>
                <a
                  href={getDirectionsUrl(order.delivery_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Navigation size={20} />
                </a>
              </>
            )}
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Order Notes:</p>
            <p className="text-sm text-yellow-700">{order.notes}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <button 
              onClick={loadOrders}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <RefreshCw size={20} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{pendingOrders.length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-500">{activeOrders.length}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{completedOrders.length}</p>
            <p className="text-sm text-gray-600">Completed Today</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'active'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'completed'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Orders List */}
        <div className="pb-8">
          {activeTab === 'pending' && (
            <>
              {pendingOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No pending deliveries</p>
                </div>
              ) : (
                pendingOrders.map(order => (
                  <OrderCard key={order.id} order={order} showActions={true} />
                ))
              )}
            </>
          )}

          {activeTab === 'active' && (
            <>
              {activeOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Truck size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No active deliveries</p>
                </div>
              ) : (
                activeOrders.map(order => (
                  <OrderCard key={order.id} order={order} showActions={true} />
                ))
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No completed deliveries today</p>
                </div>
              ) : (
                completedOrders.map(order => (
                  <OrderCard key={order.id} order={order} showActions={false} />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}