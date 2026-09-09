import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetailClient from './ProductDetailClient';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
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
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || '/images/products/diffuser-1.jpg'],
            colors: Array.isArray(data.colors)
              ? data.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#0B132B', bgClass: 'bg-[#0B132B]' } : c)
              : [{ name: 'Standard', hex: '#0B132B', bgClass: 'bg-[#0B132B]' }],
            sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['Standard One-Size'],
            fabricCare: data.fabricCare || 'Gentle care recommended.'
          };
          setProduct(normalized);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduct(null);
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
