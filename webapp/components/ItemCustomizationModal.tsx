'use client';

import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItem, MenuItemOption, MenuItemVariant, OrderItemVariant } from '@/lib/db/schema';
import { formatCurrency } from '@/lib/utils';

interface ItemCustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedVariants: OrderItemVariant[],
    specialInstructions: string,
    finalPrice: number
  ) => void;
}

export default function ItemCustomizationModal({
  item,
  onClose,
  onAddToCart
}: ItemCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string | string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Initialize required single-choice options with first variant
  useState(() => {
    const initialSelections: Record<string, string> = {};
    item.options?.forEach(option => {
      if (option.type === 'single' && option.required && option.variants.length > 0) {
        // Select medium size by default if available, otherwise first option
        const mediumVariant = option.variants.find(v => v.name.toLowerCase().includes('medium'));
        initialSelections[option.id] = mediumVariant?.id || option.variants[0].id;
      }
    });
    setSelectedVariants(initialSelections);
  });

  const handleSingleOptionChange = (optionId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [optionId]: variantId
    }));
  };

  const handleMultipleOptionChange = (optionId: string, variantId: string, checked: boolean) => {
    setSelectedVariants(prev => {
      const current = prev[optionId] as string[] || [];
      if (checked) {
        return { ...prev, [optionId]: [...current, variantId] };
      } else {
        return { ...prev, [optionId]: current.filter(id => id !== variantId) };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = item.base_price;

    item.options?.forEach(option => {
      const selected = selectedVariants[option.id];
      if (option.type === 'single' && selected) {
        const variant = option.variants.find(v => v.id === selected);
        if (variant) total += variant.price_adjustment;
      } else if (option.type === 'multiple' && Array.isArray(selected)) {
        selected.forEach(variantId => {
          const variant = option.variants.find(v => v.id === variantId);
          if (variant) total += variant.price_adjustment;
        });
      }
    });

    return total * quantity;
  };

  const getSelectedVariantsForOrder = (): OrderItemVariant[] => {
    const orderVariants: OrderItemVariant[] = [];

    item.options?.forEach(option => {
      const selected = selectedVariants[option.id];
      if (option.type === 'single' && selected) {
        const variant = option.variants.find(v => v.id === selected);
        if (variant) {
          orderVariants.push({
            option_name: option.name,
            variant_name: variant.name,
            price_adjustment: variant.price_adjustment
          });
        }
      } else if (option.type === 'multiple' && Array.isArray(selected)) {
        selected.forEach(variantId => {
          const variant = option.variants.find(v => v.id === variantId);
          if (variant) {
            orderVariants.push({
              option_name: option.name,
              variant_name: variant.name,
              price_adjustment: variant.price_adjustment
            });
          }
        });
      }
    });

    return orderVariants;
  };

  const handleAddToCart = () => {
    const pricePerItem = calculateTotalPrice() / quantity;
    onAddToCart(
      item,
      quantity,
      getSelectedVariantsForOrder(),
      specialInstructions,
      pricePerItem
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-600 mb-4">{item.description}</p>

          {/* Options */}
          {item.options?.map(option => (
            <div key={option.id} className="mb-6">
              <h3 className="font-semibold mb-2">
                {option.name}
                {option.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              
              {option.type === 'single' ? (
                <div className="space-y-2">
                  {option.variants.map(variant => (
                    <label
                      key={variant.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={option.id}
                          value={variant.id}
                          checked={selectedVariants[option.id] === variant.id}
                          onChange={() => handleSingleOptionChange(option.id, variant.id)}
                          className="mr-3"
                        />
                        <span>{variant.name}</span>
                      </div>
                      {variant.price_adjustment !== 0 && (
                        <span className="text-sm font-medium">
                          {variant.price_adjustment > 0 ? '+' : ''}
                          {formatCurrency(variant.price_adjustment)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {option.variants.map(variant => {
                    const isChecked = (selectedVariants[option.id] as string[] || []).includes(variant.id);
                    return (
                      <label
                        key={variant.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleMultipleOptionChange(option.id, variant.id, e.target.checked)}
                            className="mr-3"
                          />
                          <span>{variant.name}</span>
                        </div>
                        {variant.price_adjustment !== 0 && (
                          <span className="text-sm font-medium">
                            {variant.price_adjustment > 0 ? '+' : ''}
                            {formatCurrency(variant.price_adjustment)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests? (e.g., no onions, extra sauce)"
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
            />
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            Add to Cart • {formatCurrency(calculateTotalPrice())}
          </button>
        </div>
      </div>
    </div>
  );
}