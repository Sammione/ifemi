import { Link } from 'react-router-dom';
import { Heart, Sparkles, Compass, Users, Feather, Flower2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-28 px-4 md:px-12 lg:px-24 pb-24 text-[var(--color-brand-navy)]">
      <div className="max-w-5xl mx-auto">
        {/* Header / Hero */}
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-brand-sand)] border border-[var(--color-brand-border)] rounded-full mb-4">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] font-semibold">
              The Ifẹ́mi Story
            </span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[var(--color-brand-navy)] leading-[1.15] mb-6 font-normal">
            Ifẹ́mi Lifestyle: <span className="italic block mt-1">Embrace Your Love for Yourself</span>
          </h1>

          <p className="text-stone-600 font-light text-base md:text-lg leading-relaxed">
            Celebrating the sacred art of self-love, nurturing rituals, and holistic well-being through curated fashion, serene scents, artful living objects, and empowering wellness experiences.
          </p>
        </header>

        {/* Brand Concept Feature Section */}
        <section className="bg-white border border-[var(--color-brand-border)] p-8 md:p-14 mb-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] font-semibold block">
                Brand Concept
              </span>
              <h2 className="font-playfair text-2xl md:text-3xl text-[var(--color-brand-navy)] font-normal leading-snug">
                “My Love” in Yoruba — A Daily Celebration of Self-Nurture
              </h2>
              <div className="space-y-4 text-stone-600 font-light leading-relaxed text-sm md:text-base">
                <p>
                  <strong>Ifemi Lifestyle</strong>, meaning <em>“My love”</em> in Yoruba, celebrates self-love and the importance of nurturing oneself.
                </p>
                <p>
                  The brand offers a curated selection of products and services that embody love, care, and wellness, including soothing diffusers, stylish clothing, calming candles, and beautiful homeware and unique artwork.
                </p>
                <p className="text-stone-800 font-normal italic border-l-2 border-[var(--color-brand-navy)] pl-4 my-2">
                  “Each item serves as a reminder that self-love is essential for a fulfilling life.”
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/wugtledv/image/upload/v1788966222/ifemi-lifestyle/ikat-silk-kaftan.jpg"
                  alt="Ifemi Lifestyle Concept"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                  <span className="text-white text-xs tracking-widest uppercase font-light">
                    Ifẹ́mi • Yoruba for “My Love”
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-[var(--color-brand-sand)] border border-[var(--color-brand-border)] p-8 md:p-14 mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[var(--color-brand-border)] mx-auto mb-2">
              <Compass className="w-5 h-5 text-[var(--color-brand-navy)]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-brand-muted)] font-semibold block">
              Our Mission
            </span>
            <h2 className="font-playfair text-2xl md:text-4xl text-[var(--color-brand-navy)] font-normal leading-tight">
              Inspiring Unique Journeys of Self-Love &amp; Wellness
            </h2>
            <p className="text-stone-700 font-light text-base md:text-lg leading-relaxed">
              Our mission is to inspire individuals to embrace their unique journeys of self-love and wellness. We believe that prioritising oneself radiates positivity and enhances not only personal well-being but also that of others.
            </p>
            <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed">
              Ifemi Lifestyle fosters a welcoming community where customers feel valued and empowered to prioritise their mental, emotional, and physical health.
            </p>
          </div>
        </section>

        {/* Holistic Wellness Services Callout */}
        <section className="bg-white border border-[var(--color-brand-border)] p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] font-semibold">
                  Holistic Health &amp; Services
                </span>
              </div>
              <h3 className="font-playfair text-2xl md:text-3xl text-[var(--color-brand-navy)] font-normal">
                Beyond Products: Guided Wellness Workshops &amp; Seminars
              </h3>
              <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed">
                In addition to our products, we provide wellness services focusing on holistic health, including guided wellness workshops and seminars to empower individuals to nurture their overall well-being.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col justify-center items-start md:items-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-brand-navy)] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors"
              >
                <span>Inquire About Workshops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Ifẹ́mi Collection */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-muted)] block mb-1">
              Curated Expressions of Care
            </span>
            <h3 className="font-playfair text-2xl md:text-3xl text-[var(--color-brand-navy)] font-normal">
              What We Offer
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Stylish Clothing */}
            <div className="bg-white p-7 border border-[var(--color-brand-border)] flex flex-col justify-between">
              <div>
                <Feather className="w-6 h-6 text-stone-700 mb-4" />
                <h4 className="font-playfair text-lg text-[var(--color-brand-navy)] mb-2">Stylish Clothing</h4>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Fluid kaftans and elegant loungewear designed for easy confidence, comfort, and gracious movement.
                </p>
              </div>
              <Link to="/categories/kaftans" className="mt-6 text-[10px] uppercase tracking-widest font-semibold text-[var(--color-brand-navy)] hover:text-stone-500">
                View Garments →
              </Link>
            </div>

            {/* Pillar 2: Soothing Diffusers & Calming Candles */}
            <div className="bg-white p-7 border border-[var(--color-brand-border)] flex flex-col justify-between">
              <div>
                <Flower2 className="w-6 h-6 text-stone-700 mb-4" />
                <h4 className="font-playfair text-lg text-[var(--color-brand-navy)] mb-2">Diffusers &amp; Candles</h4>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Soothing diffusers and calming scented candles formulated with pure botanicals to restore tranquility.
                </p>
              </div>
              <Link to="/categories/diffusers" className="mt-6 text-[10px] uppercase tracking-widest font-semibold text-[var(--color-brand-navy)] hover:text-stone-500">
                Explore Fragrances →
              </Link>
            </div>

            {/* Pillar 3: Homeware & Unique Artwork */}
            <div className="bg-white p-7 border border-[var(--color-brand-border)] flex flex-col justify-between">
              <div>
                <Sparkles className="w-6 h-6 text-stone-700 mb-4" />
                <h4 className="font-playfair text-lg text-[var(--color-brand-navy)] mb-2">Homeware &amp; Artwork</h4>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Handcrafted living objects, cushions, and unique artwork that transform any personal space into a serene haven.
                </p>
              </div>
              <Link to="/shop" className="mt-6 text-[10px] uppercase tracking-widest font-semibold text-[var(--color-brand-navy)] hover:text-stone-500">
                View Objects →
              </Link>
            </div>

            {/* Pillar 4: Holistic Wellness */}
            <div className="bg-white p-7 border border-[var(--color-brand-border)] flex flex-col justify-between">
              <div>
                <Users className="w-6 h-6 text-stone-700 mb-4" />
                <h4 className="font-playfair text-lg text-[var(--color-brand-navy)] mb-2">Workshops &amp; Seminars</h4>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Empowering community sessions, guided wellness circles, and holistic self-care seminars.
                </p>
              </div>
              <Link to="/contact" className="mt-6 text-[10px] uppercase tracking-widest font-semibold text-[var(--color-brand-navy)] hover:text-stone-500">
                Learn More →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center bg-[var(--color-brand-navy)] text-white p-12 md:p-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-300 block mb-3 font-light">
            Embrace Your Love for Yourself
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl mb-4 font-normal">
            Start Your Journey With Ifẹ́mi
          </h2>
          <p className="text-xs md:text-sm text-stone-300 font-light max-w-lg mx-auto mb-8 leading-relaxed">
            Discover our curated collection of self-love essentials, from fluid kaftans to calming aromatherapy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-block px-8 py-4 bg-white text-[var(--color-brand-navy)] text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-200 transition-colors"
            >
              Explore The Shop
            </Link>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 border border-white/30 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
