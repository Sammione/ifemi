
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)] pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Section: Brand Story & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 flex flex-col items-start">
            <Logo light className="mb-6" />
            <p className="text-white/60 font-light text-xs leading-relaxed max-w-sm">
              Contemporary African luxury fashion and living objects. Crafted in limited quantities with natural fibres, tailored precision, and quiet elegance.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white/5 p-8 border border-white/10 max-w-xl ml-auto w-full">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-normal">Newsletter</span>
              <h3 className="font-playfair text-xl text-white mt-1 mb-2">Private Previews</h3>
              <p className="text-white/60 font-light text-xs mb-6">
                Receive discreet notifications when new seasonal pieces and limited living objects arrive.
              </p>

              {subscribed ? (
                <div className="p-3 bg-white/10 text-white text-xs tracking-wider uppercase font-normal text-center">
                  Thank you for subscribing.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white font-light"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-[var(--color-brand-navy)] text-xs uppercase tracking-widest font-medium hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/10 text-xs">
          {/* 1. Shop */}
          <div>
            <h4 className="font-playfair text-sm text-white tracking-widest uppercase mb-5">Shop</h4>
            <ul className="space-y-3 font-light text-white/70">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Pieces</Link></li>
              <li><Link to="/categories/kaftans" className="hover:text-white transition-colors">Kaftans</Link></li>
              <li><Link to="/categories/trouser-sets" className="hover:text-white transition-colors">Trouser Sets</Link></li>
              <li><Link to="/categories/loungewear" className="hover:text-white transition-colors">Loungewear</Link></li>
              <li><Link to="/categories/diffusers" className="hover:text-white transition-colors">Diffusers</Link></li>
              <li><Link to="/categories/cushions" className="hover:text-white transition-colors">Cushions</Link></li>
              <li><Link to="/categories/jewellery" className="hover:text-white transition-colors">Jewellery</Link></li>
            </ul>
          </div>

          {/* 2. Customer Care */}
          <div>
            <h4 className="font-playfair text-sm text-white tracking-widest uppercase mb-5">Care</h4>
            <ul className="space-y-3 font-light text-white/70">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Delivery Information</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns &amp; Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors text-white font-medium">Track Orders</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* 3. Company */}
          <div>
            <h4 className="font-playfair text-sm text-white tracking-widest uppercase mb-5">Company</h4>
            <ul className="space-y-3 font-light text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Editorial</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Collections</Link></li>
              <li className="pt-2">
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-stone-400 hover:text-white text-[10px] uppercase tracking-wider"
                >
                  <span>Admin Portal</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Legal & Social */}
          <div>
            <h4 className="font-playfair text-base text-white tracking-wide uppercase mb-5">Legal & Connect</h4>
            <ul className="space-y-3 font-light text-white/70 mb-6">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>

            <h5 className="uppercase tracking-widest text-[10px] text-[var(--color-brand-lavender)] font-semibold mb-3">Follow Us</h5>
            <div className="flex gap-4 text-white/80">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 font-light gap-4">
          <p>© {new Date().getFullYear()} Ifẹ́mi Lifestyle Ltd. Lagos & London. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span>Paystack (NGN ₦)</span>
            <span>•</span>
            <span>Stripe &amp; UK Cards (GBP £)</span>
            <span>•</span>
            <span>UK Royal Mail / DPD &amp; Nigeria Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
