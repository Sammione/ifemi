import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Check, Heart } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Home() {
  const { formatPrice } = useCurrency();
  const { addItem, toastMessage } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [addedId, setAddedId] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const editorialCategories = [
    {
      name: 'Kaftans',
      slug: 'kaftans',
      image: '/images/products/kaftan-1.jpg',
      count: '5 Pieces'
    },
    {
      name: 'Trouser Sets',
      slug: 'trouser-sets',
      image: '',
      count: 'Atelier'
    },
    {
      name: 'Loungewear',
      slug: 'loungewear',
      image: '/images/products/loungewear-2.jpg',
      count: '4 Pieces'
    },
    {
      name: 'Diffusers & Scents',
      slug: 'diffusers',
      image: '/images/products/diffuser-1.jpg',
      count: 'Artisanal Scents'
    }
  ];

  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data: any[]) => {
        if (isMounted && Array.isArray(data)) {
          const published = data.filter((d) => d.isPublished !== false);
          setPieces(published);
        }
      })
      .catch((err) => {
        console.warn('Could not load products from API:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAdd = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      sku: product.sku
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--color-brand-navy)] text-white px-5 py-3 text-xs tracking-wider flex items-center gap-3 shadow-xl">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section — Minimal Luxury Editorial */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] mb-4 font-normal">
              Collection 2026
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[var(--color-brand-navy)] mb-6">
              Fluid Silhouettes, Tailored Grace.
            </h1>
            <p className="text-stone-600 text-sm md:text-base font-light leading-relaxed mb-8 max-w-md">
              Contemporary garments and living objects designed for ease, movement, and enduring elegance.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[var(--color-brand-navy)] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors"
              >
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/categories/kaftans"
                className="text-xs uppercase tracking-[0.2em] text-stone-700 hover:text-black font-medium transition-colors underline underline-offset-4"
              >
                Explore Kaftans
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src="/images/products/loungewear-3.jpg"
                alt="Ifẹ́mi Silk Kimono Dress"
                className="w-full h-full object-cover object-center filter contrast-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Grid: Selected Works */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-16 border-t border-[var(--color-brand-border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] block mb-1">
              Selected Pieces
            </span>
            <h2 className="font-playfair text-2xl md:text-3xl text-[var(--color-brand-navy)] font-normal">
              Signature Garments &amp; Scents
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.18em] text-[var(--color-brand-navy)] hover:text-stone-600 font-medium inline-flex items-center gap-2 transition-colors"
          >
            <span>View All ({pieces.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pieces.slice(0, 8).map((piece) => {
            const isFav = isInWishlist(piece.id);
            const isAdded = addedId === piece.id;

            return (
              <div key={piece.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
                  <Link to={`/shop/${piece.id}`} className="block w-full h-full">
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>

                  {/* Minimal actions */}
                  <button
                    onClick={() => toggleWishlist({
                      productId: piece.id,
                      name: piece.name,
                      price: piece.price,
                      category: piece.category,
                      image: piece.image
                    })}
                    aria-label="Save to wishlist"
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-stone-700 transition-colors backdrop-blur-xs cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isFav ? 'fill-stone-900 text-stone-900' : 'text-stone-600'}`}
                    />
                  </button>

                  <button
                    onClick={() => handleQuickAdd(piece)}
                    className="absolute bottom-0 inset-x-0 py-3 bg-[var(--color-brand-navy)]/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand-muted)] mb-1">
                    {piece.category}
                  </span>
                  <Link
                    to={`/shop/${piece.id}`}
                    className="font-playfair text-base font-normal text-[var(--color-brand-navy)] hover:text-stone-600 transition-colors mb-2"
                  >
                    {piece.name}
                  </Link>
                  <p className="text-xs text-stone-500 font-light line-clamp-1 mb-3">
                    {piece.description}
                  </p>
                  <div className="mt-auto pt-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-900">
                      {formatPrice(piece.price, piece.priceGBP)}
                    </span>
                    <Link
                      to={`/shop/${piece.id}`}
                      className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Feature Spotlight — Honest craftsmanship */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-20 border-t border-[var(--color-brand-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-stone-100 overflow-hidden">
              <img
                src="/images/products/kaftan-2.jpg"
                alt="Emerald Geometric Silk Kaftan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-100 overflow-hidden mt-8">
              <img
                src="/images/products/loungewear-2.jpg"
                alt="Amethyst Silk Wrap Set"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] block mb-3">
              Craft &amp; Silhouette
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-normal text-[var(--color-brand-navy)] leading-tight mb-6">
              Thoughtfully proportioned for effortless daily wear.
            </h2>
            <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed mb-6">
              Our designs focus on breathability, clean movement, and tactile luxury. Each kaftan is cut to drape naturally across diverse silhouettes, while our home objects are hand-blended with natural botanicals.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200">
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900 mb-1">Pure Fibres</h4>
                <p className="text-xs text-stone-500 font-light">Mulberry silk, woven African cotton, and fluid crepes.</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900 mb-1">Fluid Sizing</h4>
                <p className="text-xs text-stone-500 font-light">One-size draping tailored to flatter comfortably.</p>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/about"
                className="text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-stone-500 transition-colors inline-flex items-center gap-2 underline underline-offset-4"
              >
                <span>Read About Our Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-16 border-t border-[var(--color-brand-border)]">
        <div className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] block mb-1">
            Collections
          </span>
          <h2 className="font-playfair text-2xl md:text-3xl font-normal text-[var(--color-brand-navy)]">
            Explore Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorialCategories.map((cat) => (
            <Link
              key={cat.name}
              to={`/categories/${cat.slug}`}
              className="group block relative aspect-[4/5] bg-[#0B132B] overflow-hidden rounded-xs"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0B132B] via-[#141F3D] to-[#0B132B] p-6 flex flex-col justify-between border border-stone-800/80">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono">
                    Ifẹ́mi
                  </span>
                  <div className="w-8 h-[1px] bg-[#C5A880]/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-stone-300 mb-1">
                  {cat.count}
                </span>
                <h3 className="font-playfair text-xl font-normal group-hover:underline underline-offset-4">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quiet Newsletter */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-20 border-t border-[var(--color-brand-border)]">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] block mb-2">
            Stay in Touch
          </span>
          <h3 className="font-playfair text-2xl md:text-3xl font-normal text-[var(--color-brand-navy)] mb-4">
            Private Updates &amp; New Silhouettes
          </h3>
          <p className="text-xs text-stone-500 font-light mb-8 leading-relaxed">
            Receive discreet notifications when new seasonal releases and limited pieces arrive.
          </p>

          {newsletterSuccess ? (
            <div className="p-3 bg-stone-100 text-stone-800 text-xs tracking-wider uppercase">
              Thank you for subscribing.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-white border border-stone-300 px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 font-light"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--color-brand-navy)] text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
