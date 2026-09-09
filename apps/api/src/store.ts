import fs from 'fs';
import path from 'path';

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceGBP: number;
  salePrice?: number | null;
  salePriceGBP?: number | null;
  category: string;
  image: string;
  images?: string[];
  isOneSize?: boolean;
  stock: number;
  threshold?: number;
  sku: string;
  tag?: string;
  origin?: string;
  sizes?: string[];
  colors?: { name: string; hex: string; bgClass: string }[] | string[];
  description: string;
  fabricCare?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  salesCount?: number;
}

export interface OrderItemRecord {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  sku?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  email: string;
  phone: string;
  currency: 'NGN' | 'GBP';
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  deliveryStatus?: string;
  shippingRegion: string;
  shippingAddress: {
    fullName?: string;
    address: string;
    city: string;
    state: string;
    phone?: string;
    country?: string;
    postalCode?: string;
  };
  items: OrderItemRecord[];
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  image: string;
  productsCount: number;
  featured?: boolean;
}

// Default realistic luxury catalog
const defaultProducts: ProductRecord[] = [
  {
    id: '1',
    name: 'Silk Kaftan',
    slug: 'silk-kaftan',
    price: 45000,
    priceGBP: 28,
    category: 'Kaftans',
    image: '/images/products/kaftan-1.jpg',
    images: ['/images/products/kaftan-1.jpg', '/images/products/kaftan-2.jpg', '/images/products/kaftan-3.jpg'],
    isOneSize: true,
    stock: 14,
    threshold: 5,
    sku: 'KAFTAN-BLU-001',
    origin: 'Crafted in Lagos, Nigeria',
    sizes: ['UK 8 - UK 20 (Fluid Drape)'],
    colors: [
      { name: 'Midnight Navy', hex: '#0B132B', bgClass: 'bg-[#0B132B]' },
      { name: 'Royal Purple', hex: '#4B2E83', bgClass: 'bg-[#4B2E83]' }
    ],
    description: 'Mulberry silk blend with fluid drape and subtle piping. Tailored for comfort in warm climates.',
    fabricCare: '100% Mulberry Silk Blend. Dry clean or gentle hand wash.',
    isPublished: true,
    isFeatured: true,
    salesCount: 42
  },
  {
    id: '2',
    name: 'Crepe Trouser Set',
    slug: 'crepe-trouser-set',
    price: 65000,
    priceGBP: 40,
    salePrice: 58000,
    salePriceGBP: 36,
    category: 'Trouser Sets',
    image: '/images/products/trouser-1.jpg',
    images: ['/images/products/trouser-1.jpg', '/images/products/trouser-2.jpg', '/images/products/trouser-blue.jpg'],
    isOneSize: false,
    stock: 8,
    threshold: 4,
    sku: 'TSET-PRP-002',
    origin: 'Tailored in Lagos, Nigeria',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Royal Purple', hex: '#4B2E83', bgClass: 'bg-[#4B2E83]' },
      { name: 'Midnight Navy', hex: '#0B132B', bgClass: 'bg-[#0B132B]' }
    ],
    description: 'High-waisted trousers with matching crossover blouse. Clean tailored seams.',
    fabricCare: 'Premium Crepe. Machine wash cold delicate or dry clean.',
    isPublished: true,
    isFeatured: true,
    salesCount: 28
  },
  {
    id: '3',
    name: 'Silk Loungewear Set',
    slug: 'silk-loungewear-set',
    price: 35000,
    priceGBP: 22,
    category: 'Loungewear',
    image: '/images/products/loungewear-1.jpg',
    images: ['/images/products/loungewear-1.jpg'],
    isOneSize: false,
    stock: 12,
    threshold: 4,
    sku: 'LNG-LAV-003',
    origin: 'Mulberry Silk, Lagos',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Lavender Mist', hex: '#967BB6', bgClass: 'bg-[#967BB6]' },
      { name: 'Cream', hex: '#FAF9F6', bgClass: 'bg-[#FAF9F6]' }
    ],
    description: 'Relaxed two-piece in lightweight washed silk. Features easy drawstring waist.',
    fabricCare: 'Washed Silk. Hand wash cold with gentle detergent.',
    isPublished: true,
    isFeatured: true,
    salesCount: 19
  },
  {
    id: '4',
    name: 'Woven Cushion',
    slug: 'woven-cushion',
    price: 18000,
    priceGBP: 12,
    category: 'Cushions',
    image: '/images/products/cushion-1.jpg',
    images: ['/images/products/cushion-1.jpg', '/images/products/cushion-2.jpg'],
    isOneSize: true,
    stock: 20,
    threshold: 6,
    sku: 'CSH-004',
    origin: 'Handwoven in Nigeria',
    sizes: ['50 x 50 cm'],
    colors: [
      { name: 'Natural Ochre', hex: '#C68642', bgClass: 'bg-[#C68642]' }
    ],
    description: 'Textured artisanal cushion cover woven with cotton and wool yarns.',
    fabricCare: 'Spot clean or gentle hand wash.',
    isPublished: true,
    isFeatured: false,
    salesCount: 15
  },
  {
    id: '5',
    name: 'Amber & Oud Diffuser',
    slug: 'amber-oud-diffuser',
    price: 22000,
    priceGBP: 15,
    category: 'Diffusers',
    image: '/images/products/diffuser-1.jpg',
    images: ['/images/products/diffuser-1.jpg', '/images/products/diffuser-2.jpg'],
    isOneSize: true,
    stock: 16,
    threshold: 5,
    sku: 'DIF-OUD-005',
    origin: 'Hand-blended in Lagos',
    sizes: ['200ml Glass Decanter'],
    colors: [
      { name: 'Amber Glass', hex: '#78350F', bgClass: 'bg-[#78350F]' }
    ],
    description: 'Cedarwood, agarwood, and amber resin in custom decanter with reed sticks.',
    fabricCare: 'Keep away from direct sunlight.',
    isPublished: true,
    isFeatured: true,
    salesCount: 34
  },
  {
    id: '6',
    name: 'Brass Collar Necklace',
    slug: 'brass-collar-necklace',
    price: 28000,
    priceGBP: 18,
    category: 'Jewellery',
    image: '/images/products/jewellery-1.jpg',
    images: ['/images/products/jewellery-1.jpg', '/images/products/jewellery-2.jpg'],
    isOneSize: true,
    stock: 9,
    threshold: 3,
    sku: 'JWL-BRS-006',
    origin: 'Cast in Benin City',
    sizes: ['Adjustable Choker'],
    colors: [
      { name: 'Brushed Brass', hex: '#D4AF37', bgClass: 'bg-[#D4AF37]' }
    ],
    description: 'Solid brass hand-forged choker with satin finish.',
    fabricCare: 'Polish with soft dry cloth.',
    isPublished: true,
    isFeatured: false,
    salesCount: 11
  }
];

const defaultOrders: OrderRecord[] = [
  {
    id: 'ord-1001',
    orderNumber: 'IFEMI-NG-84920',
    customerName: 'Folake Adeyemi',
    email: 'folake.a@example.com',
    phone: '+234 802 334 1122',
    currency: 'NGN',
    subtotal: 65000,
    deliveryFee: 3500,
    totalAmount: 68500,
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    deliveryStatus: 'In transit with GIG Logistics',
    shippingRegion: 'NIGERIA',
    shippingAddress: {
      fullName: 'Folake Adeyemi',
      address: '12 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos - Island',
      phone: '+234 802 334 1122'
    },
    items: [
      { productId: '2', name: 'Crepe Trouser Set', quantity: 1, price: 65000, size: 'M', color: 'Royal Purple' }
    ],
    courier: 'GIG Logistics',
    trackingNumber: 'GIG-77391024',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ord-1002',
    orderNumber: 'IFEMI-UK-55192',
    customerName: 'Victoria Davies',
    email: 'vdavies@example.co.uk',
    phone: '+44 7700 900123',
    currency: 'GBP',
    subtotal: 56,
    deliveryFee: 6.5,
    totalAmount: 62.5,
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    deliveryStatus: 'Delivered by Royal Mail',
    shippingRegion: 'UK',
    shippingAddress: {
      fullName: 'Victoria Davies',
      address: '42 Highbury Grove',
      city: 'London',
      state: 'London & Greater London',
      postalCode: 'N5 2EA',
      phone: '+44 7700 900123'
    },
    items: [
      { productId: '1', name: 'Silk Kaftan', quantity: 2, price: 28 }
    ],
    courier: 'Royal Mail Tracked 24',
    trackingNumber: 'RM-GB-49201940',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultCategories: CategoryRecord[] = [
  { id: 'cat-1', name: 'Kaftans', slug: 'kaftans', image: '/images/products/kaftan-1.jpg', productsCount: 1, featured: true },
  { id: 'cat-2', name: 'Trouser Sets', slug: 'trouser-sets', image: '/images/products/trouser-1.jpg', productsCount: 1, featured: true },
  { id: 'cat-3', name: 'Loungewear', slug: 'loungewear', image: '/images/products/loungewear-1.jpg', productsCount: 1, featured: true },
  { id: 'cat-4', name: 'Cushions', slug: 'cushions', image: '/images/products/cushion-1.jpg', productsCount: 1, featured: false },
  { id: 'cat-5', name: 'Diffusers', slug: 'diffusers', image: '/images/products/diffuser-1.jpg', productsCount: 1, featured: true },
  { id: 'cat-6', name: 'Jewellery', slug: 'jewellery', image: '/images/products/jewellery-1.jpg', productsCount: 1, featured: false }
];

const DATA_FILE = path.join(__dirname, '..', 'data_store.json');

class StoreService {
  private products: ProductRecord[] = defaultProducts;
  private orders: OrderRecord[] = defaultOrders;
  private categories: CategoryRecord[] = defaultCategories;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.products) && data.products.length > 0) this.products = data.products;
        if (Array.isArray(data.orders)) this.orders = data.orders;
        if (Array.isArray(data.categories)) this.categories = data.categories;
      } else {
        this.saveToDisk();
      }
    } catch (e) {
      console.warn('Could not load data_store.json, using defaults', e);
    }
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            products: this.products,
            orders: this.orders,
            categories: this.categories,
            updatedAt: new Date().toISOString()
          },
          null,
          2
        )
      );
    } catch (e) {
      console.error('Could not persist data_store.json', e);
    }
  }

  // --- Products ---
  getAllProducts(): ProductRecord[] {
    return this.products;
  }

  getProductByIdOrSlug(idOrSlug: string): ProductRecord | undefined {
    return this.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  createProduct(item: Omit<ProductRecord, 'id'> & { id?: string }): ProductRecord {
    const newProduct: ProductRecord = {
      ...item,
      id: item.id || `prod-${Date.now()}`,
      slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      salesCount: 0
    };
    this.products.unshift(newProduct);
    this.saveToDisk();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductRecord>): ProductRecord | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    this.saveToDisk();
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    const deleted = this.products.length < initialLen;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  adjustProductStock(id: string, delta: number): ProductRecord | null {
    const product = this.products.find(p => p.id === id);
    if (!product) return null;
    product.stock = Math.max(0, product.stock + delta);
    this.saveToDisk();
    return product;
  }

  // --- Orders ---
  getAllOrders(): OrderRecord[] {
    return this.orders;
  }

  getOrderById(id: string): OrderRecord | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): OrderRecord {
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);

    // Decrement stock
    for (const item of newOrder.items) {
      if (item.productId) {
        this.adjustProductStock(item.productId, -item.quantity);
      }
    }

    this.saveToDisk();
    return newOrder;
  }

  updateOrderStatus(id: string, status: OrderRecord['orderStatus'], courier?: string, trackingNumber?: string): OrderRecord | null {
    const order = this.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.orderStatus = status;
    if (courier) order.courier = courier;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();
    this.saveToDisk();
    return order;
  }

  // --- Categories ---
  getAllCategories(): CategoryRecord[] {
    return this.categories;
  }

  createCategory(cat: Omit<CategoryRecord, 'id'>): CategoryRecord {
    const newCat: CategoryRecord = {
      ...cat,
      id: `cat-${Date.now()}`,
      productsCount: 0
    };
    this.categories.push(newCat);
    this.saveToDisk();
    return newCat;
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.categories.length;
    this.categories = this.categories.filter(c => c.id !== id);
    const deleted = this.categories.length < initialLen;
    if (deleted) this.saveToDisk();
    return deleted;
  }
}

export const store = new StoreService();
