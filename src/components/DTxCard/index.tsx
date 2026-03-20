import React from 'react';
import { motion } from 'motion/react';
import { Play, Flame } from 'lucide-react';
import { showComingSoon } from '../../utils/ui';

interface DTxCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  theme: 'blue' | 'blue' | 'emerald';
  streak: number;
}

export function DTxCard({ title, description, icon: Icon, theme, streak }: DTxCardProps) {
  const themes = {
    blue: {
      bg: 'bg-blue-50/50',
      text: 'text-blue-600',
      gradient: 'from-blue-100/40 via-white to-white',
      button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.25)]',
      iconBg: 'bg-blue-100/80',
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      text: 'text-emerald-600',
      gradient: 'from-emerald-100/40 via-white to-white',
      button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.25)]',
      iconBg: 'bg-emerald-100/80',
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className="bg-white rounded-[20px] p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border-none relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-100 transition-opacity duration-500`} />
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 transition-colors bg-white/50" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${currentTheme.iconBg} flex items-center justify-center ${currentTheme.text} shadow-inner`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`${currentTheme.text} text-[12px] font-bold`}>
              数字疗法 (DTx)
            </span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-full border border-orange-100/50">
              <Flame className="w-3 h-3" />
              <span>连续 {streak} 天</span>
            </div>
          )}
        </div>
        <h4 className="text-[16px] font-bold text-slate-900 mb-1.5 tracking-tight">{title}</h4>
        <p className="text-[12px] text-slate-500 mb-4 leading-relaxed font-medium">
          {description}
        </p>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => showComingSoon('数字疗法引擎接入中', `主人，${title} 引擎正在与华西脑健康数据库进行联调，即将为您开放。`)}
          className={`w-full py-3 ${currentTheme.button} text-white rounded-[12px] font-medium text-[14px] transition-all flex items-center justify-center space-x-1.5 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
          <Play className="w-4 h-4 fill-current relative z-10" />
          <span className="relative z-10">开始今日训练</span>
        </motion.button>
      </div>
    </div>
  );
}
