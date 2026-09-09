import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Eye,
  AlertCircle,
  Sparkles,
  PackageCheck,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { ProductItem } from '../data/mockData';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock, formatCurrency, currency } = useAdminData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    category: 'Kaftans',
    price: '45000',
    priceGBP: '28',
    salePrice: '',
    salePriceGBP: '',
    sku: '',
    stock: '15',
    threshold: '5',
    colors: 'Midnight Navy, Royal Purple',
    sizes: 'One Size (Fluid Drape)',
    description: '',
    image: '',
    isPublished: true,
    isFeatured: false
  });

  // Category prefixes for SKU generation
  const catPrefixes: Record<string, string> = {
    Kaftans: 'KAFTAN',
    'Trouser Sets': 'TSET',
    Loungewear: 'LNG',
    Diffusers: 'DIF',
    Cushions: 'CSH',
    Jewellery: 'JWL'
  };

  const generateSKU = (name: string, category: string) => {
    const prefix = catPrefixes[category] || 'IFEMI';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${prefix}-BLU-${rand}`;
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, filename: file.name })
        });
        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({ ...prev, image: data.url }));
        } else {
          setForm((prev) => ({ ...prev, image: base64 }));
        }
      } catch (err) {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Kaftans',
      price: '45000',
      priceGBP: '28',
      salePrice: '',
      salePriceGBP: '',
      sku: generateSKU('', 'Kaftans'),
      stock: '15',
      threshold: '5',
      colors: 'Midnight Navy, Royal Purple',
      sizes: 'One Size (Fluid Drape)',
      description: 'Crafted with premium natural fibres and fluid drape.',
      image: '',
      isPublished: true,
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      priceGBP: String(product.priceGBP || 25),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      salePriceGBP: product.salePriceGBP ? String(product.salePriceGBP) : '',
      sku: product.sku,
      stock: String(product.stock),
      threshold: String(product.threshold),
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      description: product.description,
      image: product.image,
      isPublished: product.isPublished,
      isFeatured: product.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    const payload = {
      name: form.name.trim(),
      slug: form.name.trim().toLowerCase().replace(/\s+/g, '-'),
      category: form.category,
      price: Number(form.price),
      priceGBP: Number(form.priceGBP) || Math.round(Number(form.price) / 1600),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      salePriceGBP: form.salePriceGBP ? Number(form.salePriceGBP) : null,
      sku: form.sku || generateSKU(form.name, form.category),
      stock: Number(form.stock),
      threshold: Number(form.threshold),
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      description: form.description,
      image: form.image,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const categories = ['ALL', 'Kaftans', 'Trouser Sets', 'Loungewear', 'Diffusers', 'Cushions', 'Jewellery'];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#0b132b]">
      {/* Header & New Product Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage product catalog, inventory tracking, and dual-currency pricing (₦ and £).
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b132b] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} style={{ color: '#ffffff' }} />
          <span style={{ color: '#ffffff' }}>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search product name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0b132b] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category / SKU</th>
                <th className="px-5 py-3.5">Price (NGN / GBP)</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Featured</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    No products match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const isLow = prod.stock <= prod.threshold;
                  const isOut = prod.stock === 0;

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 text-xs block">{prod.name}</span>
                            <span className="text-[11px] text-stone-400 block max-w-xs truncate mt-0.5">
                              {prod.colors.join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="font-medium text-stone-800 block">{prod.category}</span>
                        <span className="font-mono text-[11px] text-stone-400 inline-block mt-0.5">
                          {prod.sku}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-bold text-stone-900 font-mono text-xs">
                          {currency === 'GBP' ? `£${prod.priceGBP || Math.round(prod.price / 1600)}` : `₦${prod.price.toLocaleString()}`}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {currency === 'GBP' ? `₦${prod.price.toLocaleString()}` : `£${prod.priceGBP || Math.round(prod.price / 1600)}`}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-stone-100 rounded-lg border border-stone-200 p-0.5">
                            <button
                              onClick={() => adjustStock(prod.id, -1)}
                              disabled={prod.stock <= 0}
                              className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded disabled:opacity-30 cursor-pointer"
                            >
                              -
                            </button>
                            <span
                              className={`px-2 font-mono font-bold text-xs ${
                                isOut
                                  ? 'text-rose-600'
                                  : isLow
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => adjustStock(prod.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              isOut
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : isLow
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isOut ? 'Out of stock' : isLow ? 'Low stock' : 'In stock'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => updateProduct(prod.id, { isFeatured: !prod.isFeatured })}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            prod.isFeatured
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'text-stone-300 border-stone-200 hover:text-stone-500'
                          }`}
                          title="Toggle homepage featured status"
                        >
                          <Star size={15} fill={prod.isFeatured ? '#d97706' : 'none'} />
                        </button>
                      </td>

                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => updateProduct(prod.id, { isPublished: !prod.isPublished })}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                            prod.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${prod.isPublished ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                          <span>{prod.isPublished ? 'Live' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-[#0b132b] hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${prod.name}"?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div>
                <h3 className="text-base font-bold text-[#0b132b]">
                  {editingProduct ? 'Edit Product' : 'Add New Luxury Piece'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Configure product details, dual-currency pricing in ₦ and £, and photography.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm({
                        ...form,
                        name,
                        sku: form.sku || generateSKU(name, form.category)
                      });
                    }}
                    placeholder="e.g. Silk Kaftan"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setForm({
                        ...form,
                        category: newCat,
                        sku: generateSKU(form.name, newCat)
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  >
                    {categories.filter((c) => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">SKU</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-stone-500"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, sku: generateSKU(form.name, form.category) })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      title="Generate new SKU"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Price (NGN ₦)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => {
                      const priceVal = e.target.value;
                      const gbpVal = Math.round(Number(priceVal) / 1600);
                      setForm({
                        ...form,
                        price: priceVal,
                        priceGBP: String(gbpVal > 0 ? gbpVal : 20)
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Price (GBP £)</label>
                  <input
                    type="number"
                    required
                    value={form.priceGBP}
                    onChange={(e) => setForm({ ...form, priceGBP: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    required
                    value={form.threshold}
                    onChange={(e) => setForm({ ...form, threshold: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Image Upload / URL</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 cursor-pointer transition-colors font-medium">
                          <Upload size={14} />
                          <span>{isUploading ? 'Uploading...' : 'Choose Photo from Computer'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-stone-400 text-[11px]">or enter URL below</span>
                      </div>
                      <input
                        type="text"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="/images/products/... or https://..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono text-[11px] focus:outline-none focus:border-stone-500"
                      />
                    </div>
                    {form.image && (
                      <div className="w-16 h-20 rounded-lg border border-stone-200 bg-stone-50 overflow-hidden shrink-0">
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    placeholder="e.g. Midnight Navy, Royal Purple"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="e.g. S, M, L, XL or One Size"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Luxury fabric composition, artisanal tailoring details, and origin..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="rounded border-stone-300 text-[#0b132b]"
                  />
                  <span className="text-stone-700 font-semibold">Publish immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded border-stone-300 text-amber-500"
                  />
                  <span className="text-stone-700 font-semibold">Feature on Homepage</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
                  className="px-5 py-2 rounded-xl bg-[#0b132b] hover:bg-black text-white font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
