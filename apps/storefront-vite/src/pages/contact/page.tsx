import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Product & Order Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-28 px-4 md:px-12 lg:px-24 pb-24 text-[#11141A]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-14 text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-medium">
            Get in Touch
          </span>
          <h1 className="font-playfair text-3xl md:text-5xl text-[#11141A] mt-2 mb-3">
            Contact Us
          </h1>
          <p className="text-stone-600 font-light text-sm max-w-lg mx-auto leading-relaxed">
            Have a question about our collections, sizing, or delivery? Reach our offices in Lagos or London directly.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-[#11141A] text-white p-8 md:p-10 flex flex-col justify-between rounded-lg">
            <div>
              <h2 className="font-playfair text-xl mb-6 border-b border-white/10 pb-4">
                Our Offices
              </h2>

              <div className="space-y-6 text-xs font-light text-stone-300 leading-relaxed">
                {/* UK Office */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🇬🇧</span>
                    <h3 className="uppercase tracking-widest text-white font-medium text-[11px]">
                      United Kingdom
                    </h3>
                  </div>
                  <div className="flex items-start gap-2.5 mt-2 text-stone-300">
                    <MapPin size={15} className="text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <p>1654 Great Cambridge Road</p>
                      <p>Enfield, Middlesex</p>
                      <p>EN1 4TA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-white/10">
                    <Phone size={14} className="text-stone-400 shrink-0" />
                    <a href="tel:+447729412585" className="text-white hover:underline font-mono">
                      +44 7729 412585
                    </a>
                  </div>
                </div>

                {/* Nigeria Office */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🇳🇬</span>
                    <h3 className="uppercase tracking-widest text-white font-medium text-[11px]">
                      Nigeria
                    </h3>
                  </div>
                  <div className="flex items-start gap-2.5 mt-2 text-stone-300">
                    <MapPin size={15} className="text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <p>3/5 Ilaka Street</p>
                      <p>Off Coker Road, Ilupeju</p>
                      <p>Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-white/10">
                    <Phone size={14} className="text-stone-400 shrink-0" />
                    <a href="tel:+2348028299093" className="text-white hover:underline font-mono">
                      +234 802 829 9093
                    </a>
                  </div>
                </div>

                {/* Email Inquiries */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={14} className="text-stone-400" />
                    <h3 className="uppercase tracking-widest text-white font-medium text-[11px]">
                      Email
                    </h3>
                  </div>
                  <p><a href="mailto:support@ifemi.com" className="text-stone-200 hover:underline">support@ifemi.com</a></p>
                  <p className="mt-0.5"><a href="mailto:orders@ifemi.com" className="text-stone-200 hover:underline">orders@ifemi.com</a></p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href="https://wa.me/2348028299093"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Nigeria (+234 802 829 9093)</span>
              </a>
              <a
                href="https://wa.me/447729412585"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/15"
              >
                <MessageCircle size={16} />
                <span>WhatsApp UK (+44 7729 412585)</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 border border-[#E8E5DE] rounded-lg shadow-xs">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                  ✓
                </div>
                <h3 className="font-playfair text-2xl text-[#11141A] mb-2">Message Sent</h3>
                <p className="text-stone-600 font-light text-xs max-w-sm mx-auto mb-6">
                  Thank you, {form.name}. We have received your inquiry and will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 border border-stone-300 text-xs font-medium hover:border-black transition-colors rounded"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <h3 className="font-playfair text-2xl text-[#11141A] mb-4">
                  Send a Message
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-stone-700 mb-1.5 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Adaeze Okonkwo"
                      className="w-full h-10 border border-stone-300 rounded px-3 text-xs focus:outline-none focus:border-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 mb-1.5 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full h-10 border border-stone-300 rounded px-3 text-xs focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-stone-700 mb-1.5 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+234 or +44..."
                      className="w-full h-10 border border-stone-300 rounded px-3 text-xs focus:outline-none focus:border-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 mb-1.5 font-medium">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full h-10 border border-stone-300 rounded px-3 text-xs focus:outline-none focus:border-stone-800 bg-white"
                    >
                      <option>Product & Order Inquiry</option>
                      <option>Delivery & Shipping</option>
                      <option>Returns & Exchanges</option>
                      <option>Wholesale & Partnerships</option>
                      <option>General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-700 mb-1.5 font-medium">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full border border-stone-300 rounded p-3 text-xs focus:outline-none focus:border-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#11141A] text-white text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors rounded cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

