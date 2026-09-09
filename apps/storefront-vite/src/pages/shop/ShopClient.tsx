import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Heart, ShoppingBag } from 'lucide-react';

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  priceGBP?: number;
  salePrice?: number | null;
  salePriceGBP?: number | null;
  category: string;
  image: string;
  isOneSize?: boolean;
  stock: number;
  sku: string;
}

const initialProducts: CatalogProduct[] = [
  {
    id: '1',
    name: 'Silk Kaftan',
    price: 45000,
    priceGBP: 28,
    category: 'Kaftans',
    image: '/images/products/kaftan-1.jpg',
    isOneSize: true,
    stock: 14,
    sku: 'KAFTAN-BLU-001'
  },
  {
    id: '2',
    name: 'Crepe Trouser Set',
    price: 65000,
    priceGBP: 40,
    salePrice: 58000,
    salePriceGBP: 36,
    category: 'Trouser Sets',
    image: '/images/products/trouser-1.jpg',
    isOneSize: false,
    stock: 8,
    sku: 'TSET-PRP-002'
  },
  {
    id: '3',
    name: 'Silk Loungewear Set',
    price: 35000,
    priceGBP: 22,
    category: 'Loungewear',
    image: '/images/products/loungewear-1.jpg',
    isOneSize: false,
    stock: 12,
    sku: 'LNG-LAV-003'
  },
  {
    id: '4',
    name: 'Woven Cushion',
    price: 18000,
    priceGBP: 12,
    salePrice: 15000,
    salePriceGBP: 10,
    category: 'Cushions',
    image: '/images/products/cushion-1.jpg',
    isOneSize: true,
    stock: 20,
    sku: 'CSH-IVO-004'
  },
  {
    id: '5',
    name: 'Amber & Oud Diffuser',
    price: 22000,
    priceGBP: 15,
    category: 'Diffusers',
    image: '/images/products/diffuser-1.jpg',
    isOneSize: true,
    stock: 25,
    sku: 'DIF-OUD-005'
  },
  {
    id: '6',
    name: 'Brass Drop Earrings',
    price: 18500,
    priceGBP: 12,
    category: 'Jewellery',
    image: '/images/products/jewellery-1.jpg',
    isOneSize: true,
    stock: 16,
    sku: 'JWL-BRS-006'
  },
  {
    id: '7',
    name: 'Black Velvet Kaftan',
    price: 52000,
    priceGBP: 32,
    category: 'Kaftans',
    image: '/images/products/kaftan-black.jpg',
    isOneSize: true,
    stock: 6,
    sku: 'KAFTAN-BLK-007'
  },
  {
    id: '8',
    name: 'Linen Trouser Set',
    price: 60000,
    priceGBP: 38,
    category: 'Trouser Sets',
    image: '/images/products/trouser-blue.jpg',
    isOneSize: false,
    stock: 9,
    sku: 'TSET-BLU-008'
  },
  {
    id: '9',
    name: 'Sandalwood Diffuser',
    price: 22000,
    priceGBP: 15,
    category: 'Diffusers',
    image: '/images/products/diffuser-2.jpg',
    isOneSize: true,
    stock: 18,
    sku: 'DIF-VAN-009'
  },
  {
    id: '10',
    name: 'Gold Trim Kaftan',
    price: 48000,
    priceGBP: 30,
    category: 'Kaftans',
    image: '/images/products/kaftan-2.jpg',
    isOneSize: true,
    stock: 11,
    sku: 'KAFTAN-GLD-010'
  },
  {
    id: '11',
    name: 'Crossover Crepe Ensemble',
    price: 65000,
    priceGBP: 40,
    category: 'Trouser Sets',
    image: '/images/products/trouser-2.jpg',
    isOneSize: false,
    stock: 7,
    sku: 'TSET-CRV-011'
  },
  {
    id: '12',
    name: 'Textured Geometric Cushion',
    price: 16000,
    priceGBP: 11,
    category: 'Cushions',
    image: '/images/products/cushion-2.jpg',
    isOneSize: true,
    stock: 15,
    sku: 'CSH-GEO-012'
  }
];

export default function ShopClient() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    }
  }, [searchParams]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: cat }, { replace: true });
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Merge API data with initialProducts to preserve rich lookbook items
          const apiIds = new Set(data.map((d: any) => String(d.id)));
          const additionalInitial = initialProducts.filter(p => !apiIds.has(String(p.id)));
          setProducts([...data, ...additionalInitial]);
        }
      })
      .catch((err) => {
        console.warn('Could not load products from API, using catalog cache:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const categories = ['All', 'Kaftans', 'Trouser Sets', 'Loungewear', 'Diffusers', 'Cushions', 'Jewellery'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'All') {
          const pCat = (product.category || '').toLowerCase().trim();
          const sCat = selectedCategory.toLowerCase().trim();
          const matches =
            pCat === sCat ||
            pCat === sCat + 's' ||
            pCat + 's' === sCat ||
            pCat.replace(/\s+/g, '') === sCat.replace(/\s+/g, '') ||
            pCat.includes(sCat) ||
            sCat.includes(pCat);
          if (!matches) return false;
        }
        const currentPrice = product.salePrice || product.price;
        if (currentPrice > maxPrice) return false;
        if (inStockOnly && product.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [selectedCategory, sortBy, maxPrice, inStockOnly, products]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 text-[var(--color-brand-navy)]">
      {/* Header */}
      <header className="mb-14 pb-8 border-b border-[var(--color-brand-border)]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] block mb-2 font-normal">
          Collection
        </span>
        <h1 className="font-playfair text-4xl md:text-5xl font-normal text-[var(--color-brand-navy)] mb-3">
          All Pieces
        </h1>
        <p className="text-stone-600 font-light max-w-xl text-sm leading-relaxed">
          Explore our range of fluid kaftans, tailored two-pieces, artisanal home scents, and living objects.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-56 shrink-0 space-y-8">
          <div>
            <h3 className="uppercase tracking-[0.18em] text-[11px] font-semibold text-[var(--color-brand-navy)] mb-4 pb-2 border-b border-[var(--color-brand-border)]">
              Category
            </h3>
            <div className="flex flex-col space-y-2 text-xs font-light">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left py-1 transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'text-[var(--color-brand-navy)] font-semibold underline underline-offset-4'
                      : 'text-stone-500 hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="uppercase tracking-[0.18em] text-[11px] font-semibold text-[var(--color-brand-navy)]">
                Max Price
              </h3>
              <span className="text-xs font-medium text-stone-700">
                ₦{maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={70000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-brand-navy)]"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>₦15,000</span>
              <span>₦70,000</span>
            </div>
          </div>

          <div className="border-t border-[var(--color-brand-border)] pt-6">
            <label className="flex items-center gap-3 cursor-pointer text-xs tracking-wider text-stone-700 font-normal">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-brand-navy)] rounded-none"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setMaxPrice(70000);
              setInStockOnly(false);
              setSortBy('featured');
            }}
            className="w-full py-2.5 border border-stone-300 text-stone-600 text-[10px] uppercase tracking-[0.2em] font-medium hover:border-black hover:text-black transition-colors"
          >
            Reset Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-brand-border)]">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-light">
              {filteredProducts.length} piece{filteredProducts.length === 1 ? '' : 's'}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-stone-300 px-3 py-1.5 text-xs text-stone-800 font-light focus:outline-none focus:border-[var(--color-brand-navy)] uppercase tracking-wider"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => {
              const isFavorited = isInWishlist(product.id);
              return (
                <div key={product.id} className="group flex flex-col">
                  {/* Visual Image Frame */}
                  <div className="aspect-[3/4] w-full bg-stone-100 relative overflow-hidden mb-4">
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist({
                          productId: product.id,
                          name: product.name,
                          price: product.salePrice || product.price,
                          category: product.category,
                          image: product.image
                        });
                      }}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white text-stone-700 transition-colors backdrop-blur-xs"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFavorited ? 'fill-stone-900 text-stone-900' : 'text-stone-600'}`}
                      />
                    </button>

                    <Link to={`/shop/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* Quick Add Overlay */}
                    <button
                      onClick={() => addItem({
                        productId: product.id,
                        name: product.name,
                        price: product.salePrice || product.price,
                        size: product.isOneSize ? 'One Size' : 'M',
                        quantity: 1,
                        image: product.image,
                        sku: product.sku
                      })}
                      className="absolute inset-x-0 bottom-0 py-3 bg-[var(--color-brand-navy)]/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand-muted)] mb-1">
                      {product.category} {product.isOneSize && '• One Size'}
                    </span>
                    <Link to={`/shop/${product.id}`}>
                      <h3 className="font-playfair text-base text-[var(--color-brand-navy)] hover:text-stone-500 transition-colors mb-2 line-clamp-1 font-normal">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-1 flex items-center justify-between text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-stone-900">
                          {formatPrice(product.salePrice || product.price, product.salePriceGBP || product.priceGBP)}
                        </span>
                        {product.salePrice && (
                          <span className="text-[11px] text-stone-400 line-through">
                            {formatPrice(product.price, product.priceGBP)}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/shop/${product.id}`}
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
        </div>
      </div>
    </div>
  );
}
