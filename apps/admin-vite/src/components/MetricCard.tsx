import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color?: 'purple' | 'gold' | 'emerald' | 'blue';
  sparkline?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  trend,
  trendUp = true,
  icon: Icon,
  color = 'purple',
  sparkline = [30, 45, 35, 60, 50, 75, 90]
}) => {
  const colorStyles = {
    purple: {
      iconBg: 'bg-stone-100 text-[#0b132b] border-stone-200',
      spark: '#4b2e83'
    },
    gold: {
      iconBg: 'bg-amber-50 text-amber-900 border-amber-200',
      spark: '#d97706'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      spark: '#059669'
    },
    blue: {
      iconBg: 'bg-sky-50 text-sky-800 border-sky-200',
      spark: '#0284c7'
    }
  }[color];

  const min = Math.min(...sparkline);
  const max = Math.max(...sparkline);
  const range = max - min || 1;
  const points = sparkline
    .map((v, i) => {
      const x = (i / (sparkline.length - 1)) * 100;
      const y = 30 - ((v - min) / range) * 24;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all group">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-stone-500 tracking-wide uppercase">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${colorStyles.iconBg}`}>
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-[#0b132b] tracking-tight">
          {value}
        </h3>
        {subValue && (
          <span className="text-xs text-stone-400 font-normal">
            {subValue}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
              trendUp
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}

        {/* Micro-sparkline */}
        <div className="w-20 h-5 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 32" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={colorStyles.spark}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
