export type Shop = {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  active: boolean;
};

export type MenuItemVariant = {
  id: string;
  name: string;
  price_adjustment: number; // Add or subtract from base price
};

export type MenuItemOption = {
  id: string;
  name: string;
  type: 'single' | 'multiple'; // Radio button vs checkbox
  required: boolean;
  variants: MenuItemVariant[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  base_price: number; // Changed from price to base_price
  category: 'burgers' | 'sides' | 'drinks' | 'desserts';
  image_url: string;
  available: boolean;
  shop_id?: string;
  options?: MenuItemOption[]; // Size options, add-ons, etc.
};

export type OrderStatus = 
  | 'received'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type DeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'online' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type Order = {
  id: string;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address?: string;
  delivery_type: DeliveryType;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  driver_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
};

export type OrderItemVariant = {
  option_name: string;
  variant_name: string;
  price_adjustment: number;
};

export type OrderItem = {
  menu_item_id: string;
  name: string;
  base_price: number;
  final_price: number; // Base price + all variant adjustments
  quantity: number;
  selected_variants?: OrderItemVariant[];
  special_instructions?: string;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  current_orders: number;
};