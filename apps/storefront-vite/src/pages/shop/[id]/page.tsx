import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetailClient from './ProductDetailClient';

const catalogDatabase: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Silk Kaftan',
    price: 45000,
    priceGBP: 28,
    salePrice: null,
    sku: 'KAFTAN-BLU-001',
    category: 'Kaftans',
    description: 'Cut for a relaxed, graceful drape in mulberry silk blend with gold filigree piping. Designed for effortless comfort and fluid movement.',
    fabricCare: '100% Mulberry Silk Blend. Dry clean recommended, or cold gentle hand wash with mild detergent. Line dry in shade.',
    images: [
      '/images/products/kaftan-1.jpg',
      '/images/products/kaftan-2.jpg',
      '/images/products/kaftan-3.jpg'
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#0B132B', bgClass: 'bg-[#0B132B]' },
      { name: 'Royal Purple', hex: '#4B2E83', bgClass: 'bg-[#4B2E83]' }
    ],
    isOneSize: true,
    stock: 14
  },
  '2': {
    id: '2',
    name: 'Crepe Trouser Set',
    price: 65000,
    priceGBP: 40,
    salePrice: 58000,
    salePriceGBP: 36,
    sku: 'TSET-PRP-002',
    category: 'Trouser Sets',
    description: 'Coordinated ensemble comprising high-waisted tailored trousers with pressed pleats and a relaxed crossover blouse.',
    fabricCare: 'Premium Crepe. Machine wash cold on delicate cycle or dry clean. Cool iron on reverse.',
    images: [
      '/images/products/trouser-1.jpg',
      '/images/products/trouser-2.jpg',
      '/images/products/trouser-blue.jpg'
    ],
    colors: [
      { name: 'Royal Purple', hex: '#4B2E83', bgClass: 'bg-[#4B2E83]' },
      { name: 'Midnight Navy', hex: '#0B132B', bgClass: 'bg-[#0B132B]' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isOneSize: false,
    stock: 8
  },
  '3': {
    id: '3',
    name: 'Silk Loungewear Set',
    price: 35000,
    priceGBP: 22,
    salePrice: null,
    sku: 'LNG-LAV-003',
    category: 'Loungewear',
    description: 'Relaxed two-piece in lightweight washed silk. Features easy drawstring trousers and an open-collar tunic.',
    fabricCare: 'Washed Silk. Hand wash cold with gentle detergent. Line dry in shade.',
    images: [
      '/images/products/loungewear-1.jpg',
      '/images/products/trouser-1.jpg'
    ],
    colors: [
      { name: 'Lavender', hex: '#E6E6FA', bgClass: 'bg-[#E6E6FA]' },
      { name: 'Ivory', hex: '#FAF9F6', bgClass: 'bg-[#FAF9F6]' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isOneSize: false,
    stock: 12
  },
  '4': {
    id: '4',
    name: 'Woven Cushion',
    price: 18000,
    priceGBP: 12,
    salePrice: 15000,
    salePriceGBP: 10,
    sku: 'CSH-IVO-004',
    category: 'Cushions',
    description: 'Textured cotton cushion handwoven with geometric motifs. Finished with subtle corner fringing.',
    fabricCare: '100% Organic Handwoven Cotton. Spot clean or dry clean.',
    images: [
      '/images/products/cushion-1.jpg',
      '/images/products/cushion-2.jpg'
    ],
    colors: [
      { name: 'Natural Cream', hex: '#FAF9F6', bgClass: 'bg-[#FAF9F6]' }
    ],
    isOneSize: true,
    stock: 20
  },
  '5': {
    id: '5',
    name: 'Amber & Oud Diffuser',
    price: 22000,
    priceGBP: 15,
    salePrice: null,
    sku: 'DIF-OUD-005',
    category: 'Diffusers',
    description: 'Warm cedarwood, agarwood, and amber resin in a refillable glass vessel. Formulated with botanical oils.',
    fabricCare: 'Rotate natural reeds weekly. Keep away from direct sunlight and heat sources.',
    images: [
      '/images/products/diffuser-1.jpg',
      '/images/products/diffuser-2.jpg'
    ],
    colors: [
      { name: 'Amber', hex: '#D4AF37', bgClass: 'bg-[#D4AF37]' }
    ],
    isOneSize: true,
    stock: 25
  },
  '6': {
    id: '6',
    name: 'Brass Drop Earrings',
    price: 18500,
    priceGBP: 12,
    salePrice: null,
    sku: 'JWL-BRS-006',
    category: 'Jewellery',
    description: 'Sculptural drop earrings cast in solid recycled brass with sterling silver posts and a polished high-shine finish.',
    fabricCare: 'Solid Recycled Brass. Store in provided pouch; clean with a soft dry cloth.',
    images: [
      '/images/products/jewellery-1.jpg',
      '/images/products/jewellery-2.jpg'
    ],
    colors: [
      { name: 'Polished Brass', hex: '#D4AF37', bgClass: 'bg-[#D4AF37]' }
    ],
    isOneSize: true,
    stock: 16
  },
  '7': {
    id: '7',
    name: 'Black Velvet Kaftan',
    price: 52000,
    priceGBP: 32,
    sku: 'KAFTAN-BLK-007',
    category: 'Kaftans',
    description: 'Rich velvet kaftan with relaxed draped sleeve and subtle gold neckline detail.',
    fabricCare: 'Silk-viscose velvet. Specialist dry clean only.',
    images: [
      '/images/products/kaftan-black.jpg',
      '/images/products/kaftan-1.jpg'
    ],
    colors: [
      { name: 'Black', hex: '#111111', bgClass: 'bg-[#111111]' }
    ],
    isOneSize: true,
    stock: 6
  },
  '8': {
    id: '8',
    name: 'Linen Trouser Set',
    price: 60000,
    priceGBP: 38,
    sku: 'TSET-BLU-008',
    category: 'Trouser Sets',
    description: 'Pure washed linen tailored set with relaxed trousers and structured buttoned top.',
    fabricCare: '100% Linen. Machine wash cold, hang dry.',
    images: [
      '/images/products/trouser-blue.jpg',
      '/images/products/trouser-2.jpg'
    ],
    colors: [
      { name: 'Lapis Blue', hex: '#2B4C7E', bgClass: 'bg-[#2B4C7E]' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isOneSize: false,
    stock: 9
  },
  '9': {
    id: '9',
    name: 'Sandalwood Diffuser',
    price: 22000,
    priceGBP: 15,
    sku: 'DIF-VAN-009',
    category: 'Diffusers',
    description: 'Creamy sandalwood, spiced vanilla, and cedar in a 250ml fluted glass decanter.',
    fabricCare: 'Rotate reeds once weekly for steady fragrance release.',
    images: [
      '/images/products/diffuser-2.jpg',
      '/images/products/diffuser-1.jpg'
    ],
    colors: [
      { name: 'Clear Glass', hex: '#EAEAEA', bgClass: 'bg-[#EAEAEA]' }
    ],
    isOneSize: true,
    stock: 18
  },
  '10': {
    id: '10',
    name: 'Gold Trim Kaftan',
    price: 48000,
    priceGBP: 30,
    sku: 'KAFTAN-GLD-010',
    category: 'Kaftans',
    description: 'Warm ochre silk kaftan with metallic woven trim along collar and cuffs.',
    fabricCare: 'Dry clean recommended.',
    images: [
      '/images/products/kaftan-2.jpg',
      '/images/products/kaftan-1.jpg'
    ],
    colors: [
      { name: 'Warm Gold', hex: '#D4AF37', bgClass: 'bg-[#D4AF37]' }
    ],
    isOneSize: true,
    stock: 11
  },
  '11': {
    id: '11',
    name: 'Crossover Crepe Ensemble',
    price: 65000,
    priceGBP: 40,
    sku: 'TSET-CRV-011',
    category: 'Trouser Sets',
    description: 'Tailored wide-leg trousers paired with an asymmetric wrap blouse.',
    fabricCare: 'Dry clean or delicate cycle cold.',
    images: [
      '/images/products/trouser-2.jpg',
      '/images/products/trouser-1.jpg'
    ],
    colors: [
      { name: 'Charcoal', hex: '#222222', bgClass: 'bg-[#222222]' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isOneSize: false,
    stock: 7
  },
  '12': {
    id: '12',
    name: 'Textured Geometric Cushion',
    price: 16000,
    priceGBP: 11,
    sku: 'CSH-GEO-012',
    category: 'Cushions',
    description: 'Heavyweight handwoven cotton cushion featuring tactile geometric weave.',
    fabricCare: 'Spot clean only.',
    images: [
      '/images/products/cushion-2.jpg',
      '/images/products/cushion-1.jpg'
    ],
    colors: [
      { name: 'Ecru', hex: '#F0EEE9', bgClass: 'bg-[#F0EEE9]' }
    ],
    isOneSize: true,
    stock: 15
  }
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(() => (id && catalogDatabase[id]) || null);
  const [loading, setLoading] = useState<boolean>(!product);

  useEffect(() => {
    if (!id) return;

    // If already in local database, use it immediately
    if (catalogDatabase[id]) {
      setProduct(catalogDatabase[id]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data) {
          const normalized = {
            ...data,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || '/images/products/kaftan-1.jpg'],
            colors: Array.isArray(data.colors)
              ? data.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#0B132B', bgClass: 'bg-[#0B132B]' } : c)
              : [{ name: 'Default', hex: '#0B132B', bgClass: 'bg-[#0B132B]' }],
            sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['Standard One-Size'],
            fabricCare: data.fabricCare || 'Gentle hand wash or dry clean recommended.'
          };
          setProduct(normalized);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Fallback to item 1 if not found
          setProduct(catalogDatabase['1']);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-brand-cream)] pt-36 px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-stone-500 animate-pulse">Loading Piece...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--color-brand-cream)] pt-36 px-6 text-center">
        <h1 className="font-playfair text-2xl text-stone-800 mb-4">Piece Not Found</h1>
        <Link to="/shop" className="text-xs uppercase tracking-widest text-stone-600 underline">
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24 text-[var(--color-brand-navy)]">
      <ProductDetailClient product={product} />
    </main>
  );
}
