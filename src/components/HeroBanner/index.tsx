import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HeroBannerProps {
  title?: React.ReactNode;
  subtitle?: string;
  tag?: string;
  gradient?: string;
  iconColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HeroBanner({ 
  title, 
  subtitle, 
  tag, 
  gradient = 'from-[#2563EB] to-[#1D4ED8]',
  iconColor = 'bg-white',
  children,
  className = "px-4 mb-6 relative z-10"
}: HeroBannerProps) {
  return (
    <div className={className}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${gradient} rounded-[32px] p-6 text-white shadow-[0_8px_32px_rgba(37,99,235,0.25)] relative overflow-hidden`}
      >
        {/* Soft Glow Orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10">
          {tag && (
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full mb-4 border border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="text-[12px] font-medium text-white">{tag}</span>
            </div>
          )}
          {title && (
            <h2 className="text-[20px] font-bold leading-tight mb-2 tracking-tight text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[13px] text-blue-100 leading-relaxed mb-1 max-w-[90%]">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
