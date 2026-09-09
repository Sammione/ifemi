import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export const SalesChart: React.FC = () => {
  const { formatCurrency } = useAdminData();
  const [period, setPeriod] = useState<'7D' | '30D' | '12M'>('30D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const dataset = {
    '7D': [
      { label: 'Mon', value: 420000, orders: 12 },
      { label: 'Tue', value: 580000, orders: 15 },
      { label: 'Wed', value: 390000, orders: 9 },
      { label: 'Thu', value: 710000, orders: 19 },
      { label: 'Fri', value: 890000, orders: 24 },
      { label: 'Sat', value: 1150000, orders: 32 },
      { label: 'Sun', value: 940000, orders: 26 }
    ],
    '30D': [
      { label: 'Week 1', value: 2850000, orders: 74 },
      { label: 'Week 2', value: 3420000, orders: 88 },
      { label: 'Week 3', value: 3180000, orders: 81 },
      { label: 'Week 4', value: 4120000, orders: 106 }
    ],
    '12M': [
      { label: 'Jan', value: 8500000, orders: 210 },
      { label: 'Feb', value: 9200000, orders: 235 },
      { label: 'Mar', value: 11400000, orders: 290 },
      { label: 'Apr', value: 10100000, orders: 260 },
      { label: 'May', value: 12800000, orders: 320 },
      { label: 'Jun', value: 14200000, orders: 355 },
      { label: 'Jul', value: 13900000, orders: 340 },
      { label: 'Aug', value: 16500000, orders: 410 },
      { label: 'Sep', value: 15100000, orders: 380 },
      { label: 'Oct', value: 17400000, orders: 435 },
      { label: 'Nov', value: 21800000, orders: 540 },
      { label: 'Dec', value: 28900000, orders: 710 }
    ]
  }[period];

  const values = dataset.map((d) => d.value);
  const maxVal = Math.max(...values);
  const totalPeriodRevenue = values.reduce((a, b) => a + b, 0);
  const totalPeriodOrders = dataset.reduce((a, b) => a + b.orders, 0);

  const width = 700;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = dataset.map((d, i) => {
    const x = paddingX + (i / (dataset.length - 1)) * chartW;
    const y = height - paddingY - (d.value / maxVal) * chartH;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <h2 className="text-sm font-bold text-[#0b132b]">Revenue Overview</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Total {period === '7D' ? 'Weekly' : period === '30D' ? 'Monthly' : 'Annual'}:{' '}
            <span className="text-stone-900 font-semibold">{formatCurrency(totalPeriodRevenue)}</span> •{' '}
            <span className="text-stone-700 font-medium">{totalPeriodOrders} Orders</span>
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 self-start sm:self-auto text-xs">
          {(['7D', '30D', '12M'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setPeriod(tab);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                period === tab
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative mt-5 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0b132b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0b132b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingY - ratio * chartH;
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeOpacity="0.9"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {(ratio * maxVal) >= 1000000
                    ? `${(ratio * maxVal / 1000000).toFixed(1)}M`
                    : `${(ratio * maxVal / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Curved Line */}
          <path d={pathD} fill="none" stroke="#0b132b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={i} className="cursor-pointer">
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={height - paddingY}
                    stroke="#0b132b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.5"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '5' : '3.5'}
                  fill={isHovered ? '#0b132b' : '#334155'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <rect
                  x={pt.x - 20}
                  y={0}
                  width="40"
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#0b132b' : '#64748b'}
                  fontWeight={isHovered ? '600' : 'normal'}
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {pt.data.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute -top-2 pointer-events-none transform -translate-x-1/2 bg-stone-900 border border-stone-800 text-white rounded-lg px-3 py-2 shadow-xl z-20 text-center"
            style={{
              left: `${((points[hoveredIdx].x) / width) * 100}%`
            }}
          >
            <p className="text-[10px] text-stone-300 font-medium">
              {dataset[hoveredIdx].label}
            </p>
            <p className="text-xs font-semibold text-white mt-0.5 font-mono">
              {formatCurrency(dataset[hoveredIdx].value)}
            </p>
            <p className="text-[10px] text-stone-300">
              {dataset[hoveredIdx].orders} orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
