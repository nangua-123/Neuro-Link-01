import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="pt-12 pb-4 px-5 sticky top-0 z-30 bg-[#F4F7FB]/80 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold text-slate-800 tracking-tight">{title}</h1>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.06)] border border-slate-100/80">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <p className="text-[13px] text-slate-500 leading-relaxed max-w-[85%]">
        {subtitle}
      </p>
    </div>
  );
}
