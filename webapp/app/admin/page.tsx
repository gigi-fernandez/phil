'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle,
  ChefHat,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Settings
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { shops } from '@/lib/db/data';
import { Order, OrderItem } from '@/lib/db/schema';

export default function ShopAdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('shop-1');
  const [activeTab, setActiveTab] = useState<'new' | 'preparing' | 'ready' | 'completed'>('new');
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Filter orders for selected shop
    const shopOrders = allOrders.filter((o: Order) => o.shop_id === selectedShop);
    setOrders(shopOrders.sort((a: Order, b: Order) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));
    setLoading(false);
  }, [selectedShop]);

  useEffect(() => {
    loadOrders();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const newOrders = orders.filter(o => o.status === 'received');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  // Calculate stats
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const totalRevenue = todayOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const avgOrderValue = todayOrders.length > 0 
    ? totalRevenue / todayOrders.filter(o => o.status !== 'cancelled').length 
    : 0;

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = allOrders.findIndex((o: Order) => o.id === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = newStatus;
      allOrders[orderIndex].updated_at = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(allOrders));
      loadOrders();
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const isPickup = order.delivery_type === 'pickup';
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold">Order #{order.id}</h3>
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isPickup ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              {isPickup ? 'Pickup' : 'Delivery'}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              order.payment_method === 'cash' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              {order.payment_method === 'cash' ? 'Cash' : 'Paid'}
            </span>
          </div>
        </div>

        {/* Customer */}
        <div className="mb-3">
          <p className="text-sm font-medium">{order.customer_name}</p>
          <p className="text-xs text-gray-600">{order.customer_phone}</p>
        </div>

        {/* Items */}
        <div className="border-t pt-3 mb-3">
          {order.items.map((item: OrderItem, index: number) => (
            <div key={index} className="text-sm mb-1">
              <span className="font-medium">{item.quantity}x</span> {item.name}
              {item.special_instructions && (
                <p className="text-xs text-gray-700 ml-6">Note: {item.special_instructions}</p>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="font-bold text-orange-500">
            {formatCurrency(order.total)}
          </span>
          
          {/* Actions */}
          <div className="flex gap-2">
            {order.status === 'received' && (
              <>
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
                >
                  Start Preparing
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Mark Ready
              </button>
            )}
            {order.status === 'ready' && isPickup && (
              <button
                onClick={() => updateOrderStatus(order.id, 'completed')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
              >
                Complete Pickup
              </button>
            )}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
            <span className="font-medium">Notes:</span> {order.notes}
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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Shop Dashboard</h1>
              <select 
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/admin/menu"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Settings size={20} />
                Manage Menu
              </Link>
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
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag size={20} className="text-orange-500" />
              <span className="text-xs text-gray-700">Today</span>
            </div>
            <p className="text-2xl font-bold">{todayOrders.length}</p>
            <p className="text-xs text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign size={20} className="text-green-500" />
              <span className="text-xs text-gray-700">Today</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-gray-600">Revenue</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={20} className="text-blue-500" />
              <span className="text-xs text-gray-700">Average</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
            <p className="text-xs text-gray-600">Order Value</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock size={20} className="text-purple-500" />
              <span className="text-xs text-gray-700">Active</span>
            </div>
            <p className="text-2xl font-bold">{newOrders.length + preparingOrders.length}</p>
            <p className="text-xs text-gray-600">In Progress</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'new'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            New ({newOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('preparing')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'preparing'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Preparing ({preparingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'ready'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ready ({readyOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'completed'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Orders Grid */}
        <div className="pb-8">
          {activeTab === 'new' && (
            <>
              {newOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No new orders</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {newOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'preparing' && (
            <>
              {preparingOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <ChefHat size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No orders being prepared</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {preparingOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'ready' && (
            <>
              {readyOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No orders ready</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {readyOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No completed orders today</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedOrders.slice(0, 12).map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-4 opacity-75">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">#{order.id}</span>
                        <span className={`px-2 py-1 rounded text-xs text-white ${
                          order.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {order.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-sm font-bold text-orange-500">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}