export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  priceGBP: number;
  salePrice?: number | null;
  salePriceGBP?: number | null;
  sku: string;
  stock: number;
  threshold: number;
  isPublished: boolean;
  isFeatured: boolean;
  colors: string[];
  sizes: string[];
  description: string;
  image: string;
  tag?: string;
  salesCount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  destination: string;
  city: string;
  country: string;
  date: string;
  total: number;
  totalGBP: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_DELIVERY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  courier: string;
  trackingNumber?: string;
  items: OrderItem[];
  totalAmount?: number;
  currency?: 'NGN' | 'GBP';
  createdAt?: string;
  shippingAddress?: any;
  shippingRegion?: string;
  deliveryStatus?: string;
  updatedAt?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  tier: 'VIP Platinum' | 'VIP Gold' | 'Client';
  joinedDate: string;
  lastOrderDate: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  productsCount: number;
  featured: boolean;
  accentColor: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number;
  usedCount: number;
  maxUses: number;
  active: boolean;
  expires: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  location: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  conciergeWhatsApp: string;
  showroomAddress: string;
  ukAddress?: string;
  ukPhone?: string;
  lagosDeliveryFee: number;
  nationwideDeliveryFee: number;
  ukDeliveryFeeGBP: number;
  freeDeliveryThreshold: number;
  paystackPublicKey: string;
  paystackSecretKey: string;
  enableTestMode: boolean;
  currency: 'NGN' | 'GBP';
  storefrontUrl?: string;
}

export const initialProducts: ProductItem[] = [
  {
    id: '1',
    name: 'Silk Kaftan',
    slug: 'silk-kaftan',
    category: 'Kaftans',
    price: 45000,
    priceGBP: 28,
    sku: 'KAFTAN-BLU-001',
    stock: 14,
    threshold: 5,
    isPublished: true,
    isFeatured: true,
    colors: ['Midnight Navy', 'Indigo'],
    sizes: ['One Size'],
    description: 'Mulberry silk blend with fluid drape and subtle metallic piping.',
    image: '/images/products/kaftan-1.jpg',
    salesCount: 48
  },
  {
    id: '2',
    name: 'Crepe Trouser Set',
    slug: 'crepe-trouser-set',
    category: 'Trouser Sets',
    price: 65000,
    priceGBP: 40,
    salePrice: 58000,
    salePriceGBP: 36,
    sku: 'TSET-PRP-002',
    stock: 4,
    threshold: 5,
    isPublished: true,
    isFeatured: true,
    colors: ['Royal Purple', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'High-waisted trousers with matching crossover blouse.',
    image: '/images/products/trouser-1.jpg',
    salesCount: 34
  },
  {
    id: '3',
    name: 'Silk Loungewear Set',
    slug: 'silk-loungewear-set',
    category: 'Loungewear',
    price: 35000,
    priceGBP: 22,
    sku: 'LNG-LAV-003',
    stock: 12,
    threshold: 5,
    isPublished: true,
    isFeatured: false,
    colors: ['Lavender', 'Cream'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Featherweight washed silk two-piece designed for relaxed daytime comfort.',
    image: '/images/products/loungewear-1.jpg',
    salesCount: 22
  },
  {
    id: '4',
    name: 'Woven Cushion',
    slug: 'woven-cushion',
    category: 'Cushions',
    price: 18000,
    priceGBP: 12,
    salePrice: 15000,
    salePriceGBP: 10,
    sku: 'CSH-IVO-004',
    stock: 20,
    threshold: 8,
    isPublished: true,
    isFeatured: false,
    colors: ['Ivory', 'Charcoal'],
    sizes: ['50x50cm'],
    description: 'Textured cotton cushions handwoven with traditional geometric motifs.',
    image: '/images/products/cushion-1.jpg',
    salesCount: 65
  },
  {
    id: '5',
    name: 'Amber & Oud Diffuser',
    slug: 'amber-oud-diffuser',
    category: 'Diffusers',
    price: 22000,
    priceGBP: 15,
    sku: 'DIF-OUD-005',
    stock: 2,
    threshold: 6,
    isPublished: true,
    isFeatured: true,
    colors: ['Amber Glass'],
    sizes: ['250ml'],
    description: 'Botanical home fragrance infused with cedar, dark oud, and amber resin.',
    image: '/images/products/diffuser-1.jpg',
    salesCount: 51
  },
  {
    id: '6',
    name: 'Brass Drop Earrings',
    slug: 'brass-drop-earrings',
    category: 'Jewellery',
    price: 18500,
    priceGBP: 12,
    sku: 'JWL-BRS-006',
    stock: 0,
    threshold: 5,
    isPublished: true,
    isFeatured: false,
    colors: ['Polished Brass'],
    sizes: ['One Size'],
    description: 'Sculptural drop earrings cast in solid recycled brass with sterling silver posts.',
    image: '/images/products/jewellery-1.jpg',
    salesCount: 40
  }
];

export const initialOrders: OrderRecord[] = [
  {
    id: '1',
    orderNumber: 'IFEMI-92841',
    customerName: 'Adaeze Okonkwo',
    email: 'adaeze.okonkwo@gmail.com',
    phone: '+234 803 123 4567',
    destination: 'Plot 18, Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    country: 'Nigeria',
    date: '2026-08-28 14:22',
    total: 70000,
    totalGBP: 44,
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    courier: 'GIG Logistics Express',
    trackingNumber: 'GIG-LAG-993821',
    items: [
      { id: 'item-1', productId: '1', name: 'Midnight Elegance Silk Kaftan', quantity: 1, price: 45000, size: 'One Size', image: '/images/products/kaftan-1.jpg' },
      { id: 'item-2', productId: '5', name: 'Royal Oud & Amber Home Diffuser', quantity: 1, price: 22000, size: '250ml', image: '/images/products/diffuser-1.jpg' }
    ]
  },
  {
    id: '2',
    orderNumber: 'IFEMI-92842',
    customerName: 'Lady Chidinma Adeleke',
    email: 'chidinma.adeleke@luxurygroup.ng',
    phone: '+234 812 345 6789',
    destination: '14 Aso Drive, Maitama',
    city: 'Abuja',
    country: 'Nigeria',
    date: '2026-08-29 10:15',
    total: 125000,
    totalGBP: 78,
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    courier: 'DHL Air Priority',
    trackingNumber: 'DHL-ABJ-558291',
    items: [
      { id: 'item-3', productId: '2', name: 'Royal Purple Crepe Trouser Set', quantity: 1, price: 58000, size: 'UK 12 (M)', image: '/images/products/trouser-1.jpg' },
      { id: 'item-4', productId: '1', name: 'Midnight Elegance Silk Kaftan', quantity: 1, price: 45000, size: 'One Size', image: '/images/products/kaftan-1.jpg' },
      { id: 'item-5', productId: '5', name: 'Royal Oud & Amber Home Diffuser', quantity: 1, price: 22000, size: '250ml', image: '/images/products/diffuser-1.jpg' }
    ]
  },
  {
    id: '3',
    orderNumber: 'IFEMI-92843',
    customerName: 'Folake Balogun',
    email: 'folake.b@heritageholdings.com',
    phone: '+234 802 987 6543',
    destination: '7 Tombia Street, GRA Phase 2',
    city: 'Port Harcourt',
    country: 'Nigeria',
    date: '2026-08-29 16:40',
    total: 45000,
    totalGBP: 28,
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    courier: 'RedStar Express',
    trackingNumber: 'RED-PHC-110293',
    items: [
      { id: 'item-6', productId: '1', name: 'Midnight Elegance Silk Kaftan', quantity: 1, price: 45000, size: 'One Size', image: '/images/products/kaftan-1.jpg' }
    ]
  },
  {
    id: '4',
    orderNumber: 'IFEMI-92840',
    customerName: 'Zainab Dangote-Bello',
    email: 'zainab.d@investments.co.uk',
    phone: '+44 7700 900123',
    destination: '42 Kensington High St, Flat 3B',
    city: 'London',
    country: 'United Kingdom',
    date: '2026-08-27 18:05',
    total: 180000,
    totalGBP: 112,
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    courier: 'Royal Mail Special Delivery',
    trackingNumber: 'RM-LDN-884920GB',
    items: [
      { id: 'item-7', productId: '2', name: 'Royal Purple Crepe Trouser Set', quantity: 2, price: 58000, size: 'UK 10 (S)', image: '/images/products/trouser-1.jpg' },
      { id: 'item-8', productId: '3', name: 'Lavender Whisper Silk Loungewear', quantity: 1, price: 35000, size: 'UK 10 (S)', image: '/images/products/loungewear-1.jpg' },
      { id: 'item-9', productId: '4', name: 'Handwoven Artisanal Cushion Set', quantity: 1, price: 15000, image: '/images/products/cushion-1.jpg' }
    ]
  },
  {
    id: '5',
    orderNumber: 'IFEMI-92839',
    customerName: 'Dr. Amina Bello',
    email: 'amina.bello@lagosmed.org',
    phone: '+234 809 333 4455',
    destination: 'Parkview Estate, Ikoyi',
    city: 'Lagos',
    country: 'Nigeria',
    date: '2026-08-26 11:30',
    total: 58000,
    totalGBP: 36,
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    courier: 'Lagos Dispatch Courier',
    trackingNumber: 'LGS-IKY-22019',
    items: [
      { id: 'item-10', productId: '2', name: 'Royal Purple Crepe Trouser Set', quantity: 1, price: 58000, size: 'UK 14 (L)', image: '/images/products/trouser-1.jpg' }
    ]
  }
];

export const initialCustomers: CustomerRecord[] = [
  { id: '1', name: 'Adaeze Okonkwo', email: 'adaeze.okonkwo@gmail.com', phone: '+234 803 123 4567', location: 'Lekki Phase 1, Lagos', totalOrders: 6, totalSpent: 385000, tier: 'VIP Platinum', joinedDate: 'Jan 2026', lastOrderDate: 'Aug 28, 2026' },
  { id: '2', name: 'Lady Chidinma Adeleke', email: 'chidinma.adeleke@luxurygroup.ng', phone: '+234 812 345 6789', location: 'Maitama, Abuja', totalOrders: 4, totalSpent: 265000, tier: 'VIP Gold', joinedDate: 'Mar 2026', lastOrderDate: 'Aug 29, 2026' },
  { id: '3', name: 'Folake Balogun', email: 'folake.b@heritageholdings.com', phone: '+234 802 987 6543', location: 'GRA Phase 2, Port Harcourt', totalOrders: 3, totalSpent: 143000, tier: 'Client', joinedDate: 'May 2026', lastOrderDate: 'Aug 29, 2026' },
  { id: '4', name: 'Zainab Dangote-Bello', email: 'zainab.d@investments.co.uk', phone: '+44 7700 900123', location: 'Kensington, London', totalOrders: 9, totalSpent: 720000, tier: 'VIP Platinum', joinedDate: 'Feb 2026', lastOrderDate: 'Aug 27, 2026' },
  { id: '5', name: 'Dr. Amina Bello', email: 'amina.bello@lagosmed.org', phone: '+234 809 333 4455', location: 'Ikoyi, Lagos', totalOrders: 5, totalSpent: 310000, tier: 'VIP Gold', joinedDate: 'Jan 2026', lastOrderDate: 'Aug 26, 2026' }
];

export const initialCategories: CategoryItem[] = [
  { id: '1', name: 'Kaftans', slug: 'kaftans', description: 'Flowing ceremonial silks and fluid drape silhouettes.', productsCount: 14, featured: true, accentColor: '#475569' },
  { id: '2', name: 'Trouser Sets', slug: 'trouser-sets', description: 'High-waisted tailored sets crafted in vibrant crepe.', productsCount: 8, featured: true, accentColor: '#334155' },
  { id: '3', name: 'Loungewear', slug: 'loungewear', description: 'Silken relaxation two-pieces for refined living.', productsCount: 12, featured: true, accentColor: '#1e293b' },
  { id: '4', name: 'Diffusers', slug: 'diffusers', description: 'Artisanal scents blending oud, cedarwood, and amber.', productsCount: 6, featured: false, accentColor: '#475569' },
  { id: '5', name: 'Cushions', slug: 'cushions', description: 'Handcrafted textural cushions with traditional motifs.', productsCount: 9, featured: false, accentColor: '#334155' },
  { id: '6', name: 'Jewellery', slug: 'jewellery', description: 'Architectural statement brass and sculptural earrings.', productsCount: 16, featured: false, accentColor: '#64748b' }
];

export const initialPromos: PromoCode[] = [
  { id: '1', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrder: 0, usedCount: 54, maxUses: 500, active: true, expires: '2026-12-31' },
  { id: '2', code: 'IFEMI20', type: 'PERCENTAGE', value: 20, minOrder: 100000, usedCount: 23, maxUses: 50, active: true, expires: '2026-10-15' },
  { id: '3', code: 'LAGOSVIP', type: 'FIXED', value: 10000, minOrder: 80000, usedCount: 12, maxUses: 100, active: true, expires: '2026-11-30' },
  { id: '4', code: 'LONDON50', type: 'FIXED', value: 5000, minOrder: 50000, usedCount: 8, maxUses: 50, active: false, expires: '2026-09-01' }
];

export const initialReviews: ReviewItem[] = [
  { id: '1', customerName: 'Dr. Amina Bello', productName: 'Midnight Elegance Silk Kaftan', rating: 5, comment: 'The fabric quality is truly magnificent. The drape and gold stitching made this piece a showstopper at my event in Abuja.', date: '2026-08-25', status: 'APPROVED', location: 'Abuja' },
  { id: '2', customerName: 'Lady Chidinma Adeleke', productName: 'Royal Purple Crepe Trouser Set', rating: 5, comment: 'Flawless tailoring. The waistline and trousers fit perfectly without needing any alterations in Lagos.', date: '2026-08-27', status: 'APPROVED', location: 'Lagos' },
  { id: '3', customerName: 'Ngozi Eze', productName: 'Royal Oud & Amber Home Diffuser', rating: 5, comment: 'The scent throw in my living room is intoxicating. Long-lasting and rich, everyone asks about it.', date: '2026-08-28', status: 'PENDING', location: 'Enugu' },
  { id: '4', customerName: 'Anonymous Client', productName: 'Sculptural Brass Statement Earrings', rating: 4, comment: 'Earrings are slightly heavier than expected, but stunning sculptural presence.', date: '2026-08-20', status: 'APPROVED', location: 'London' },
  { id: '5', customerName: 'Tolu Alabi', productName: 'Handwoven Artisanal Cushion Set', rating: 5, comment: 'Sublime artisanal feel. The geometric Yoruba motif elevates our entire sofa arrangement.', date: '2026-08-29', status: 'PENDING', location: 'Ibadan' }
];

export const initialSettings: StoreSettings = {
  storeName: 'ifẹ́mi Lifestyle',
  tagline: 'Modern African Fashion & Living',
  supportEmail: 'support@ifemi.com',
  supportPhone: '+234 802 829 9093',
  conciergeWhatsApp: '+2348028299093',
  showroomAddress: '3/5 Ilaka Street, Off Coker Road, Ilupeju, Lagos, Nigeria',
  ukAddress: '1654 Great Cambridge Road, Enfield Middlesex, EN1 4TA',
  ukPhone: '+44 7729 412585',
  lagosDeliveryFee: 3000,
  nationwideDeliveryFee: 6000,
  ukDeliveryFeeGBP: 20,
  freeDeliveryThreshold: 100000,
  paystackPublicKey: 'pk_live_************************',
  paystackSecretKey: 'sk_live_************************',
  enableTestMode: false,
  currency: 'NGN',
  storefrontUrl: 'https://ifemi-storefront-vite.vercel.app'
};
