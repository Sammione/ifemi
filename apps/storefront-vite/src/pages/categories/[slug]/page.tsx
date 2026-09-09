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
    image: "/images/products/kaftan-1.jpg",
    items: [
      { id: '1', name: 'Silk Kaftan', price: 45000, priceGBP: 28, image: '/images/products/kaftan-1.jpg' },
      { id: '7', name: 'Black Velvet Kaftan', price: 52000, priceGBP: 32, image: '/images/products/kaftan-black.jpg' },
      { id: '10', name: 'Gold Trim Kaftan', price: 48000, priceGBP: 30, image: '/images/products/kaftan-2.jpg' },
      { id: '1', name: 'Sunset Silk Kaftan', price: 46000, priceGBP: 29, image: '/images/products/kaftan-3.jpg' }
    ]
  },
  "trouser-sets": {
    name: "Trouser Sets",
    description: "Tailored coordination. High-waisted trousers with matching blouses in breathable fabrics.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "/images/products/trouser-1.jpg",
    items: [
      { id: '2', name: 'Crepe Trouser Set', price: 65000, priceGBP: 40, salePrice: 58000, salePriceGBP: 36, image: '/images/products/trouser-1.jpg' },
      { id: '8', name: 'Linen Trouser Set', price: 60000, priceGBP: 38, image: '/images/products/trouser-blue.jpg' },
      { id: '11', name: 'Crossover Crepe Ensemble', price: 65000, priceGBP: 40, image: '/images/products/trouser-2.jpg' }
    ]
  },
  loungewear: {
    name: "Loungewear",
    description: "Lightweight washed silk loungewear tailored for relaxed daytime elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/products/loungewear-1.jpg",
    items: [
      { id: '3', name: 'Silk Loungewear Set', price: 35000, priceGBP: 22, image: '/images/products/loungewear-1.jpg' },
      { id: '3', name: 'Ivory Silk Lounge Two-Piece', price: 38000, priceGBP: 24, image: '/images/products/trouser-1.jpg' }
    ]
  },
  diffusers: {
    name: "Diffusers & Scents",
    description: "Botanical home fragrances blended with cedar, agarwood, and amber resin.",
    image: "/images/products/diffuser-1.jpg",
    items: [
      { id: '5', name: 'Amber & Oud Diffuser', price: 22000, priceGBP: 15, image: '/images/products/diffuser-1.jpg' },
      { id: '9', name: 'Sandalwood Diffuser', price: 22000, priceGBP: 15, image: '/images/products/diffuser-2.jpg' }
    ]
  },
  cushions: {
    name: "Cushions",
    description: "Textured cotton cushions handwoven with geometric motifs.",
    image: "/images/products/cushion-1.jpg",
    items: [
      { id: '4', name: 'Woven Cushion', price: 18000, priceGBP: 12, salePrice: 15000, salePriceGBP: 10, image: '/images/products/cushion-1.jpg' },
      { id: '12', name: 'Textured Geometric Cushion', price: 16000, priceGBP: 11, image: '/images/products/cushion-2.jpg' }
    ]
  },
  jewellery: {
    name: "Jewellery",
    description: "Sculptural drop earrings cast in solid recycled brass.",
    image: "/images/products/jewellery-1.jpg",
    items: [
      { id: '6', name: 'Brass Drop Earrings', price: 18500, priceGBP: 12, image: '/images/products/jewellery-1.jpg' },
      { id: '6', name: 'Artisan Brass Hoops', price: 17000, priceGBP: 11, image: '/images/products/jewellery-2.jpg' }
    ]
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();
  const category = slug ? categoryData[slug] : undefined;

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
    </main>
  );
}
