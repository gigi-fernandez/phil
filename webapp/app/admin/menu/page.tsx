'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { MenuItem, MenuItemOption, MenuItemVariant } from '@/lib/db/schema';
import { formatCurrency } from '@/lib/utils';

export default function AdminMenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' }
  ];

  useEffect(() => {
    // Load menu items from localStorage
    const storedItems = localStorage.getItem('menuItems');
    if (storedItems) {
      setMenuItems(JSON.parse(storedItems));
    } else {
      // Load default items
      import('@/lib/db/data').then(module => {
        setMenuItems(module.menuItems);
        localStorage.setItem('menuItems', JSON.stringify(module.menuItems));
      });
    }
  }, []);

  const saveMenuItems = (items: MenuItem[]) => {
    localStorage.setItem('menuItems', JSON.stringify(items));
    setMenuItems(items);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      // Update existing item
      const updatedItems = menuItems.map(i => i.id === item.id ? item : i);
      saveMenuItems(updatedItems);
    } else {
      // Add new item
      const newItem = { ...item, id: `item-${Date.now()}` };
      saveMenuItems([...menuItems, newItem]);
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = menuItems.filter(i => i.id !== itemId);
      saveMenuItems(updatedItems);
    }
  };

  const handleToggleAvailability = (itemId: string) => {
    const updatedItems = menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    );
    saveMenuItems(updatedItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
                <span>Back</span>
              </Link>
              <h1 className="text-2xl font-bold">Menu Management</h1>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingItem({
                  id: '',
                  name: '',
                  description: '',
                  base_price: 0,
                  category: 'burgers',
                  image_url: '',
                  available: true,
                  options: []
                });
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-32 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <ImageIcon size={40} />
                </div>
                {!item.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold">UNAVAILABLE</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {item.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-orange-500">
                    {formatCurrency(item.base_price)}
                  </span>
                  {item.options && item.options.length > 0 && (
                    <span className="text-xs text-gray-700">
                      {item.options.length} option{item.options.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`flex-1 px-3 py-1 rounded text-sm font-medium transition ${
                      item.available
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsCreating(false);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {(editingItem || isCreating) && (
        <MenuItemEditor
          item={editingItem!}
          isCreating={isCreating}
          onSave={handleSaveItem}
          onCancel={() => {
            setEditingItem(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

// Menu Item Editor Component
function MenuItemEditor({
  item,
  isCreating,
  onSave,
  onCancel
}: {
  item: MenuItem;
  isCreating: boolean;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(item);
  const [editingOption, setEditingOption] = useState<MenuItemOption | null>(null);

  const handleAddOption = () => {
    const newOption: MenuItemOption = {
      id: `option-${Date.now()}`,
      name: '',
      type: 'single',
      required: false,
      variants: []
    };
    setFormData({
      ...formData,
      options: [...(formData.options || []), newOption]
    });
    setEditingOption(newOption);
  };

  const handleSaveOption = (option: MenuItemOption) => {
    setFormData({
      ...formData,
      options: formData.options?.map(o => o.id === option.id ? option : o) || []
    });
    setEditingOption(null);
  };

  const handleDeleteOption = (optionId: string) => {
    setFormData({
      ...formData,
      options: formData.options?.filter(o => o.id !== optionId) || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isCreating ? 'Add New Item' : 'Edit Item'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as MenuItem['category']})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="burgers">Burgers</option>
                <option value="sides">Sides</option>
                <option value="drinks">Drinks</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Base Price *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
                <input
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({...formData, base_price: parseFloat(e.target.value) || 0})}
                  className="w-full pl-8 pr-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Options & Variants</label>
              <button
                onClick={handleAddOption}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
              >
                <Plus size={16} />
                Add Option
              </button>
            </div>
            
            {formData.options && formData.options.length > 0 && (
              <div className="space-y-2">
                {formData.options.map(option => (
                  <div key={option.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{option.name || 'Unnamed Option'}</span>
                        <span className="ml-2 text-xs text-gray-700">
                          ({option.type}, {option.required ? 'required' : 'optional'})
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingOption(option)}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteOption(option.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {option.variants.length} variant{option.variants.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Save className="inline mr-2" size={16} />
            Save Item
          </button>
        </div>
      </div>

      {/* Option Editor Modal */}
      {editingOption && (
        <OptionEditor
          option={editingOption}
          onSave={handleSaveOption}
          onCancel={() => setEditingOption(null)}
        />
      )}
    </div>
  );
}

// Option Editor Component
function OptionEditor({
  option,
  onSave,
  onCancel
}: {
  option: MenuItemOption;
  onSave: (option: MenuItemOption) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(option);

  const handleAddVariant = () => {
    const newVariant: MenuItemVariant = {
      id: `variant-${Date.now()}`,
      name: '',
      price_adjustment: 0
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant]
    });
  };

  const handleUpdateVariant = (index: number, variant: MenuItemVariant) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = variant;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleDeleteVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="border-b p-4">
          <h3 className="font-bold">Edit Option</h3>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Option Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Size, Extra Toppings"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'single' | 'multiple'})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Required</label>
              <select
                value={formData.required ? 'yes' : 'no'}
                onChange={(e) => setFormData({...formData, required: e.target.value === 'yes'})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="no">Optional</option>
                <option value="yes">Required</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Variants</label>
              <button
                onClick={handleAddVariant}
                className="text-blue-500 text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add Variant
              </button>
            </div>

            <div className="space-y-2">
              {formData.variants.map((variant, index) => (
                <div key={variant.id} className="flex gap-2">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => handleUpdateVariant(index, {...variant, name: e.target.value})}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    placeholder="Variant name"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price_adjustment}
                    onChange={(e) => handleUpdateVariant(index, {...variant, price_adjustment: parseFloat(e.target.value) || 0})}
                    className="w-24 px-2 py-1 border rounded text-sm"
                    placeholder="Price ±"
                  />
                  <button
                    onClick={() => handleDeleteVariant(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Option
          </button>
        </div>
      </div>
    </div>
  );
}