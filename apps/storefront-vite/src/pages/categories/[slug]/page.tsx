import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCurrency } from '../../../context/CurrencyContext';

interface CategoryMeta {
  name: string;
  description: string;
  sizes?: string[];
  image: string;
  items: {
    id: string;
    name: string;
    price: number;
    priceGBP?: number;
    salePrice?: number | null;
    salePriceGBP?: number | null;
    image: string;
  }[];
}

const categoryData: Record<string, CategoryMeta> = {
  kaftans: {
    name: "Kaftans",
    description: "Flowing silhouettes in natural silk blends designed for fluid movement and ease.",
    image: "",
    items: []
  },
  "trouser-sets": {
    name: "Trouser Sets",
    description: "Tailored coordination. High-waisted trousers with matching blouses in breathable fabrics.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "",
    items: []
  },
  loungewear: {
    name: "Loungewear",
    description: "Lightweight washed silk loungewear tailored for relaxed daytime elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "",
    items: []
  },
  diffusers: {
    name: "Diffusers & Scents",
    description: "Botanical home fragrances blended with cedar, agarwood, and amber resin.",
    image: "/images/products/diffuser-1.jpg",
    items: []
  },
  cushions: {
    name: "Cushions",
    description: "Textured cotton cushions handwoven with geometric motifs.",
    image: "",
    items: []
  },
  jewellery: {
    name: "Jewellery",
    description: "Sculptural drop earrings cast in solid recycled brass.",
    image: "",
    items: []
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();
  const baseCategory = slug ? categoryData[slug] : undefined;

  const [liveItems, setLiveItems] = useState<any[]>(baseCategory ? baseCategory.items : []);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return;

    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: any[]) => {
        if (!isMounted || !Array.isArray(data)) return;

        const normalizedSlug = slug.toLowerCase().replace(/-/g, ' ');
        const matchingApiProducts = data.filter((p) => {
          if (!p.category) return false;
          const cat = p.category.toLowerCase();
          return (
            cat === normalizedSlug ||
            cat === normalizedSlug + 's' ||
            cat + 's' === normalizedSlug ||
            cat.includes(normalizedSlug) ||
            normalizedSlug.includes(cat)
          );
        });

        if (matchingApiProducts.length > 0) {
          const apiIds = new Set(matchingApiProducts.map((p) => String(p.id)));
          const defaultItems = baseCategory
            ? baseCategory.items.filter((p) => !apiIds.has(String(p.id)))
            : [];
          setLiveItems([...matchingApiProducts, ...defaultItems]);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch category products from API:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, baseCategory]);

  const category = baseCategory
    ? { ...baseCategory, items: liveItems }
    : undefined;

  if (!category) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)] pt-28">
        <div className="text-center p-12 border border-stone-200 max-w-md bg-white">
          <h1 className="font-playfair text-2xl text-[var(--color-brand-navy)] mb-4 font-normal">Category Not Found</h1>
          <p className="text-xs text-stone-500 font-light mb-6">The requested collection does not exist.</p>
          <Link to="/categories" className="px-6 py-3 bg-[var(--color-brand-navy)] text-white uppercase tracking-widest text-xs font-medium hover:bg-black transition-colors">
            ← View All Categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24 text-[var(--color-brand-navy)]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-8">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-black transition-colors">Categories</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-14 max-w-xl border-b border-[var(--color-brand-border)] pb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] font-normal block mb-2">
          Collection
        </span>
        <h1 className="font-playfair text-4xl md:text-5xl font-normal text-[var(--color-brand-navy)] mb-3">
          {category.name}
        </h1>
        <p className="text-stone-600 font-light text-sm leading-relaxed">{category.description}</p>
        {category.sizes && (
          <div className="mt-4 flex gap-2 flex-wrap items-center">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Sizes:</span>
            {category.sizes.map((s) => (
              <span key={s} className="px-2.5 py-0.5 border border-stone-300 text-[10px] text-stone-700 font-medium bg-white">{s}</span>
            ))}
          </div>
        )}
      </header>

      {/* Product Grid */}
      {category.items.length === 0 ? (
        <div className="py-24 text-center border border-stone-200 bg-white/60 p-8 rounded-lg max-w-lg mx-auto">
          <p className="font-playfair text-2xl text-[var(--color-brand-navy)] mb-2">New Pieces In Creation</p>
          <p className="text-xs text-stone-500 font-light mb-6">
            Our atelier is currently crafting new pieces for the {category.name} collection.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-[var(--color-brand-navy)] text-white text-xs uppercase tracking-widest hover:bg-black transition-colors"
          >
            Explore Available Pieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {category.items.map((item, idx) => (
            <div key={idx} className="group flex flex-col">
              <div className="aspect-[3/4] w-full bg-stone-100 relative overflow-hidden mb-4">
                <Link to={`/shop/${item.id}`} className="block w-full h-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand-muted)] mb-1">{category.name}</span>
                <Link to={`/shop/${item.id}`}>
                  <h3 className="font-playfair text-base text-[var(--color-brand-navy)] hover:text-stone-500 transition-colors mb-2 line-clamp-1 font-normal">
                    {item.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-1 flex items-center justify-between text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-stone-900">
                      {formatPrice(item.salePrice || item.price, item.salePriceGBP || item.priceGBP)}
                    </span>
                    {item.salePrice && (
                      <span className="text-[11px] text-stone-400 line-through">
                        {formatPrice(item.price, item.priceGBP)}
                      </span>
                    )}
                  </div>
                  <Link to={`/shop/${item.id}`} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
