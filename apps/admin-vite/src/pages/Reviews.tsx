import React, { useState } from 'react';
import {
  Star,
  Trash2,
  MapPin,
  Clock
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const Reviews: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useAdminData();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const filtered = reviews.filter((r) => {
    if (filter !== 'ALL' && r.status !== filter) return false;
    return true;
  });

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#0b132b]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review and moderate client feedback on pieces and luxury scents before storefront display.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {pendingCount > 0 && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shadow-xs">
              {pendingCount} Pending Review
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-xl w-fit text-xs shadow-xs">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === mode
                ? 'bg-[#0b132b] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {mode === 'ALL' ? 'All' : mode.charAt(0) + mode.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filtered.map((rev) => {
          const statusColors: Record<string, string> = {
            APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
            REJECTED: 'bg-rose-50 text-rose-700 border-rose-200'
          };

          return (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-stone-300 transition-all shadow-xs"
            >
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-[#0b132b] text-sm">{rev.customerName}</span>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin size={12} className="text-stone-400" />
                    <span>{rev.location}</span>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-700 font-semibold">
                    {rev.productName}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-200'}
                    />
                  ))}
                  <span className="text-xs text-stone-500 font-medium ml-1">({rev.rating}/5)</span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-light p-3.5 rounded-xl bg-stone-50 border border-stone-200 italic">
                  “{rev.comment}”
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-light">
                  <Clock size={12} />
                  <span>Submitted {rev.date}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2.5 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[rev.status]}`}>
                  {rev.status}
                </span>

                <div className="flex items-center gap-2">
                  {rev.status !== 'APPROVED' && (
                    <button
                      onClick={() => updateReviewStatus(rev.id, 'APPROVED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}

                  {rev.status !== 'REJECTED' && (
                    <button
                      onClick={() => updateReviewStatus(rev.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm('Permanently delete review?')) {
                        deleteReview(rev.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
