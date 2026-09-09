import { Link } from 'react-router-dom';

const categories = [
  {
    name: "Kaftans",
    slug: "kaftans",
    description: "Flowing silhouettes in natural silk blends designed for fluid movement and comfort.",
    count: "Collection",
    image: ""
  },
  {
    name: "Trouser Sets",
    slug: "trouser-sets",
    description: "Coordinated two-piece ensembles with high-waisted tailored trousers and crossover blouses.",
    count: "Collection",
    image: ""
  },
  {
    name: "Loungewear",
    slug: "loungewear",
    description: "Featherweight washed silk loungewear tailored for relaxed elegance.",
    count: "Collection",
    image: ""
  },
  {
    name: "Diffusers",
    slug: "diffusers",
    description: "Botanical home fragrances blended with cedar, oud, and golden amber.",
    count: "Home Scents",
    image: "/images/products/diffuser-1.jpg"
  },
  {
    name: "Cushions",
    slug: "cushions",
    description: "Textured cotton cushions handwoven with geometric motifs.",
    count: "Collection",
    image: ""
  },
  {
    name: "Jewellery",
    slug: "jewellery",
    description: "Sculptural drop earrings cast in solid recycled brass.",
    count: "Collection",
    image: ""
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24 text-[var(--color-brand-navy)]">
      {/* Header */}
      <header className="mb-14 max-w-xl pb-8 border-b border-[var(--color-brand-border)]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] font-normal block mb-2">Collections</span>
        <h1 className="font-playfair text-4xl md:text-5xl font-normal text-[var(--color-brand-navy)] mb-3">All Categories</h1>
        <p className="text-stone-600 font-light text-sm leading-relaxed">
          Explore our range of apparel, home scents, and tactile living accents.
        </p>
      </header>

      {/* Categories Grid with Editorial Imagery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/categories/${category.slug}`}
            className="group bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className="aspect-[4/3] w-full overflow-hidden relative bg-[#0B132B]">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0B132B] via-[#141F3D] to-[#0B132B] flex flex-col justify-between p-8 border-b border-stone-800">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono">
                    Ifẹ́mi Atelier
                  </span>
                  <div className="w-12 h-[1px] bg-[#C5A880]/30" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 text-[var(--color-brand-navy)] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 backdrop-blur-xs">
                {category.count}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-playfair text-2xl text-[var(--color-brand-charcoal)] group-hover:text-[var(--color-brand-purple)] transition-colors mb-3">
                  {category.name}
                </h2>
                <p className="text-gray-500 font-light text-xs leading-relaxed line-clamp-3">
                  {category.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Explore Line</span>
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--color-brand-purple)] group-hover:translate-x-1 transition-transform">
                  Shop Collection →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
