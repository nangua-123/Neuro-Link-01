import React from 'react';
import { motion } from 'motion/react';
import { Play, Flame } from 'lucide-react';
import { showComingSoon } from '../../utils/ui';

interface DTxCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  theme: 'indigo' | 'blue' | 'emerald';
  streak: number;
}

export function DTxCard({ title, description, icon: Icon, theme, streak }: DTxCardProps) {
  const themes = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      gradient: 'from-indigo-50/50 to-transparent',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      gradient: 'from-blue-50/50 to-transparent',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      gradient: 'from-emerald-50/50 to-transparent',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className="bg-white rounded-[16px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-7 h-7 rounded-[10px] ${currentTheme.bg} flex items-center justify-center ${currentTheme.text}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className={`px-1.5 py-0.5 ${currentTheme.bg} ${currentTheme.text} text-[9px] font-semibold rounded-full`}>
              数字疗法 (DTx)
            </span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-semibold rounded-full border border-orange-100/50">
              <Flame className="w-3 h-3" />
              <span>连续 {streak} 天</span>
            </div>
          )}
        </div>
        <h4 className="text-[13px] font-bold text-slate-900 mb-0.5 tracking-tight">{title}</h4>
        <p className="text-[10px] text-slate-500 mb-3 leading-relaxed font-medium">
          {description}
        </p>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => showComingSoon('数字疗法引擎接入中', `${title} 引擎正在与华西脑健康数据库进行联调，即将为您开放。`)}
          className={`w-full py-2 ${currentTheme.button} text-white rounded-[10px] font-medium text-[12px] transition-colors flex items-center justify-center space-x-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>开始今日训练</span>
        </motion.button>
      </div>
    </div>
  );
}
