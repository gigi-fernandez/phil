import { Shop, MenuItem } from './schema';

export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Hungry Mays Sydney CBD',
    address: '123 George St, Sydney NSW 2000',
    phone: '+61 2 9000 0001',
    lat: -33.8688,
    lng: 151.2093,
    active: true
  },
  {
    id: 'shop-2',
    name: 'Hungry Mays Bondi',
    address: '456 Campbell Parade, Bondi Beach NSW 2026',
    phone: '+61 2 9000 0002',
    lat: -33.8915,
    lng: 151.2767,
    active: true
  },
  {
    id: 'shop-3',
    name: 'Hungry Mays Chatswood',
    address: '789 Victoria Ave, Chatswood NSW 2067',
    phone: '+61 2 9000 0003',
    lat: -33.7969,
    lng: 151.1833,
    active: true
  }
];

export const menuItems: MenuItem[] = [
  // Burgers
  {
    id: 'burger-1',
    name: 'Classic Smash',
    description: 'Double beef patty, cheese, lettuce, tomato, onion, pickles, special sauce',
    base_price: 16.90,
    category: 'burgers',
    image_url: '/menu/smash-burger.jpg',
    available: true,
    options: [
      {
        id: 'patty-option',
        name: 'Patty Option',
        type: 'single',
        required: true,
        variants: [
          { id: 'single', name: 'Single Patty', price_adjustment: -2.00 },
          { id: 'double', name: 'Double Patty', price_adjustment: 0 },
          { id: 'triple', name: 'Triple Patty', price_adjustment: 3.00 }
        ]
      },
      {
        id: 'extras',
        name: 'Extra Toppings',
        type: 'multiple',
        required: false,
        variants: [
          { id: 'bacon', name: 'Add Bacon', price_adjustment: 2.00 },
          { id: 'extra-cheese', name: 'Extra Cheese', price_adjustment: 1.00 },
          { id: 'avocado', name: 'Add Avocado', price_adjustment: 2.50 },
          { id: 'jalapenos', name: 'Add Jalapeños', price_adjustment: 0.50 }
        ]
      }
    ]
  },
  {
    id: 'burger-2',
    name: 'Bacon BBQ',
    description: 'Beef patty, bacon, cheddar, onion rings, BBQ sauce',
    base_price: 18.90,
    category: 'burgers',
    image_url: '/images/bacon-bbq.jpg',
    available: true
  },
  {
    id: 'burger-3',
    name: 'Schnitzel Burger',
    description: 'Deep fried chicken, cheese, garlic aioli',
    base_price: 17.90,
    category: 'burgers',
    image_url: '/menu/schnitzel.jpg',
    available: true
  },
  {
    id: 'burger-4',
    name: 'Spicy Jalapeño',
    description: 'Beef patty, pepper jack, jalapeños, chipotle mayo',
    base_price: 17.50,
    category: 'burgers',
    image_url: '/images/spicy-jalapeno.jpg',
    available: true
  },
  // Sides
  {
    id: 'side-1',
    name: 'Classic Fries',
    description: 'Crispy golden fries with sea salt',
    base_price: 5.90,
    category: 'sides',
    image_url: '/menu/fries.jpg',
    available: true,
    options: [
      {
        id: 'size',
        name: 'Size',
        type: 'single',
        required: true,
        variants: [
          { id: 'small', name: 'Small', price_adjustment: -1.00 },
          { id: 'medium', name: 'Medium', price_adjustment: 0 },
          { id: 'large', name: 'Large', price_adjustment: 1.50 }
        ]
      },
      {
        id: 'sauce',
        name: 'Add Sauce',
        type: 'multiple',
        required: false,
        variants: [
          { id: 'ketchup', name: 'Ketchup', price_adjustment: 0 },
          { id: 'mayo', name: 'Mayo', price_adjustment: 0 },
          { id: 'ranch', name: 'Ranch', price_adjustment: 0.50 },
          { id: 'cheese-sauce', name: 'Cheese Sauce', price_adjustment: 1.50 }
        ]
      }
    ]
  },
  {
    id: 'side-2',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries',
    base_price: 6.90,
    category: 'sides',
    image_url: '/images/sweet-potato-fries.jpg',
    available: true
  },
  {
    id: 'side-3',
    name: 'Onion Rings',
    description: 'Beer-battered onion rings',
    base_price: 7.90,
    category: 'sides',
    image_url: '/images/onion-rings.jpg',
    available: true
  },
  // Drinks
  {
    id: 'drink-1',
    name: 'Soft Drink',
    description: 'Coke, Sprite, Fanta, or Ginger Ale',
    base_price: 4.50,
    category: 'drinks',
    image_url: '/images/soft-drink.jpg',
    available: true
  },
  {
    id: 'drink-2',
    name: 'Milkshake',
    description: 'Vanilla, Chocolate, or Strawberry',
    base_price: 7.90,
    category: 'drinks',
    image_url: '/images/milkshake.jpg',
    available: true
  },
  {
    id: 'drink-3',
    name: 'Fresh Lemonade',
    description: 'House-made fresh lemonade',
    base_price: 5.90,
    category: 'drinks',
    image_url: '/images/lemonade.jpg',
    available: true
  },
  // Desserts
  {
    id: 'dessert-1',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    base_price: 8.90,
    category: 'desserts',
    image_url: '/images/brownie.jpg',
    available: true
  },
  {
    id: 'dessert-2',
    name: 'Apple Pie',
    description: 'Classic apple pie with cinnamon',
    base_price: 7.90,
    category: 'desserts',
    image_url: '/images/apple-pie.jpg',
    available: true
  }
];