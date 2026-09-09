import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Star
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const Categories: React.FC = () => {
  const { categories, addCategory, deleteCategory, toggleCategoryFeatured, products } = useAdminData();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#4B2E83');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim() || 'Curated luxury collection.',
      featured: true,
      accentColor: newCatColor
    });

    setNewCatName('');
    setNewCatDesc('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#0b132b]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Organize products into departments, navigation menus, and collection groups.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b132b] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} style={{ color: '#ffffff' }} />
          <span style={{ color: '#ffffff' }}>{isAdding ? 'Close' : 'Add Category'}</span>
        </button>
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
        >
          <h3 className="text-sm font-bold text-[#0b132b]">Create New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Loungewear"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Color Marker</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 font-mono text-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-stone-700 font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Short summary for navigation and SEO..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
              className="px-5 py-2 rounded-lg bg-[#0b132b] hover:bg-black text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const actualCount = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;

          return (
            <div
              key={cat.id}
              className="rounded-2xl bg-white border border-stone-200 p-5 hover:border-stone-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.accentColor || '#4B2E83' }}
                    />
                    <span className="text-[10px] font-mono text-stone-500">
                      /{cat.slug}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleCategoryFeatured(cat.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        cat.featured
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title={cat.featured ? 'Featured on storefront' : 'Not featured'}
                    >
                      <Star size={14} fill={cat.featured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0b132b] mt-3">{cat.name}</h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed font-light">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-light">
                  <strong className="text-stone-900 font-bold">{actualCount}</strong> products
                </span>
                {cat.featured && (
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Featured
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
