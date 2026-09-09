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

// Default luxury catalog — only authentic diffusers and user products
const defaultProducts: ProductRecord[] = [
  {
    name: "gsjs",
    slug: "gsjs",
    category: "Kaftans",
    price: 45000,
    priceGBP: 28,
    salePrice: null,
    salePriceGBP: null,
    stock: 15,
    threshold: 5,
    sku: "KAFTAN-BLU-614",
    image: "https://res.cloudinary.com/wugtledv/image/upload/v1788963089/ifemi-lifestyle/ogbcqbub3hhinrqarbiy.png",
    images: [
      "https://res.cloudinary.com/wugtledv/image/upload/v1788963089/ifemi-lifestyle/ogbcqbub3hhinrqarbiy.png"
    ],
    colors: [
      { name: "Midnight Navy", hex: "#0B132B", bgClass: "bg-[#0B132B]" },
      { name: "Royal Purple", hex: "#4B2E83", bgClass: "bg-[#4B2E83]" }
    ],
    sizes: [
      "One Size (Fluid Drape)"
    ],
    description: "Crafted with premium natural fibres and fluid drape.",
    fabricCare: "Gentle care recommended.",
    isPublished: true,
    isFeatured: true,
    id: "prod-1788963096074",
    salesCount: 1
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
    subtotal: 22000,
    deliveryFee: 3000,
    totalAmount: 25000,
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    deliveryStatus: 'Order confirmed and packed. Awaiting courier pickup.',
    shippingRegion: 'LAGOS',
    shippingAddress: {
      fullName: 'Folake Adeyemi',
      address: '14 Admiralty Way',
      city: 'Lekki Phase 1',
      state: 'Lagos',
      phone: '+234 802 334 1122',
      country: 'Nigeria'
    },
    items: [
      {
        productId: '5',
        name: 'Amber & Oud Diffuser',
        quantity: 1,
        price: 22000,
        sku: 'DIF-OUD-005'
      }
    ],
    courier: 'GIG Logistics Express',
    trackingNumber: 'GIG-7821948',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultCategories: CategoryRecord[] = [
  { id: 'cat-1', name: 'Kaftans', slug: 'kaftans', image: '', productsCount: 1, featured: true },
  { id: 'cat-2', name: 'Trouser Sets', slug: 'trouser-sets', image: '', productsCount: 0, featured: true },
  { id: 'cat-3', name: 'Loungewear', slug: 'loungewear', image: '', productsCount: 0, featured: true },
  { id: 'cat-4', name: 'Cushions', slug: 'cushions', image: '', productsCount: 0, featured: false },
  { id: 'cat-5', name: 'Diffusers', slug: 'diffusers', image: '/images/products/diffuser-1.jpg', productsCount: 1, featured: true },
  { id: 'cat-6', name: 'Jewellery', slug: 'jewellery', image: '', productsCount: 0, featured: false }
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
