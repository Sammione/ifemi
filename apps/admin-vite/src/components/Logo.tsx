import React from 'react';

export const Logo: React.FC<{ light?: boolean; collapsed?: boolean }> = ({ light = false, collapsed = false }) => {
  if (collapsed) {
    return (
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs ${
        light ? 'bg-white/10 border border-white/20 text-white' : 'bg-[#0B132B] border border-stone-300 text-white'
      }`}>
        i
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
        light ? 'bg-white/10 border border-white/20 text-white' : 'bg-[#0B132B] border border-[#0B132B] text-[#FAF9F6]'
      }`}>
        i
      </div>
      <div className="flex flex-col text-left">
        <span className={`font-serif text-lg font-bold tracking-tight leading-none ${light ? 'text-white' : 'text-[#0B132B]'}`}>
          ifẹ́mi
        </span>
        <span className={`text-[10px] tracking-wider font-semibold uppercase mt-0.5 ${light ? 'text-stone-400' : 'text-stone-500'}`}>
          Atelier Suite
        </span>
      </div>
    </div>
  );
};

export default Logo;
