'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { menuItems } from '@/lib/db/data';
import { useCart } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';
import { MenuItem, OrderItemVariant } from '@/lib/db/schema';
import ItemCustomizationModal from '@/components/ItemCustomizationModal';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const { items: cartItems, addItem, updateQuantity, selectedShopId, setSelectedShop } = useCart();
  
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cartItems.find(item => item.menuItem.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedVariants: OrderItemVariant[],
    specialInstructions: string,
    finalPrice: number
  ) => {
    // Set default shop if not selected
    if (!selectedShopId) {
      setSelectedShop('shop-1'); // Default to first shop (Sydney CBD)
    }
    
    // Create a modified item with the final price for cart
    const cartMenuItem = {
      ...item,
      price: finalPrice, // This will be used for cart calculations
      selectedVariants, // Store the selected variants
      specialInstructions
    };
    addItem(cartMenuItem as any, quantity, specialInstructions);
  };

  const handleQuickAdd = (item: MenuItem) => {
    // Set default shop if not selected
    if (!selectedShopId) {
      setSelectedShop('shop-1'); // Default to first shop (Sydney CBD)
    }
    
    if (item.options && item.options.length > 0) {
      // If item has options, open customization modal
      setCustomizingItem(item);
    } else {
      // If no options, add directly to cart with base price
      const cartMenuItem = {
        ...item,
        price: item.base_price // Ensure price is set for items without options
      };
      addItem(cartMenuItem as any, 1);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = (item.menuItem as any).price || item.menuItem.base_price;
    return sum + (price * item.quantity);
  }, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
              <Link href="/" className="flex items-center gap-2 text-white hover:text-orange-200 transition">
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
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
              <Link
                href="/cart"
                className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md"
              >
                <ShoppingCart size={20} />
                <span>{formatCurrency(cartTotal)}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-105'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {categories.find(c => c.id === selectedCategory)?.name || 'All Items'}
            </h2>
            <p className="text-gray-600 mt-1">Choose from our delicious selection</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const quantity = getItemQuantity(item.id);

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105 border-2 border-gray-100">
                  <div className="h-56 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100 relative overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingCart size={48} className="text-orange-300" />
                      </div>
                    )}
                    {item.options && item.options.length > 0 && (
                      <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Customizable
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">
                          {formatCurrency(item.base_price)}
                        </span>
                        {item.options?.length > 0 && (
                          <span className="text-xs text-gray-500 block">starting from</span>
                        )}
                      </div>

                      {quantity === 0 ? (
                        <button
                          onClick={() => handleQuickAdd(item)}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg font-semibold hover:scale-105"
                        >
                          <Plus size={18} />
                          {item.options?.length > 0 ? 'Customize' : 'Add'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-9 h-9 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center transition text-gray-700 shadow-sm"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="w-9 h-9 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 flex items-center justify-center transition shadow-md"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customization Modal */}
        {customizingItem && (
          <ItemCustomizationModal
            item={customizingItem}
            onClose={() => setCustomizingItem(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}