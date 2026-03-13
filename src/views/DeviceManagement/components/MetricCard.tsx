import React from 'react';
import { MetricData } from '../../../interfaces/device';
import { Moon, Heart, Activity, Footprints, Zap } from 'lucide-react';
import { WaveChart } from '../../../components/common/charts/WaveChart';
import { BarChart } from '../../../components/common/charts/BarChart';
import { cn } from '../../../utils/cn';

interface MetricCardProps {
  data: MetricData;
}

const iconMap = {
  SLEEP_EEG: Moon,
  VITALS: Heart,
  HRV: Activity,
  GAIT: Footprints,
  EEG_ABNORMALITY: Zap,
};

const themeMap = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-500',
    chartColor: '#6366f1',
    blob: 'bg-indigo-100/50'
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-500',
    chartColor: '#f43f5e',
    blob: 'bg-rose-100/50'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-500',
    chartColor: '#10b981',
    blob: 'bg-emerald-100/50'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-500',
    chartColor: '#f59e0b',
    blob: 'bg-amber-100/50'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const Icon = iconMap[data.type];
  const theme = themeMap[data.colorTheme];

  // 决定使用哪种图表
  const isWave = data.type === 'VITALS' || data.type === 'HRV' || data.type === 'EEG_ABNORMALITY';

  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-white/60 flex flex-col h-56 transition-transform duration-300 hover:-translate-y-1">
      {/* 装饰性弥散光晕 */}
      <div className={cn("absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl", theme.blob)}></div>

      {/* 顶部：图标与标题 */}
      <div className="flex flex-col items-start z-10">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", theme.bg, theme.text)}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-medium text-slate-500 tracking-wide">{data.title}</h3>
      </div>

      {/* 中部：抽象数据图表填充留白 */}
      <div className="absolute inset-0 top-16 bottom-16 z-0 flex items-center justify-center px-2">
        {isWave ? (
          <WaveChart data={data.chartData} dataKey="value" color={theme.chartColor} />
        ) : (
          <BarChart data={data.chartData} dataKey="value" color={theme.chartColor} />
        )}
      </div>

      {/* 底部：核心数值与趋势 */}
      <div className="mt-auto z-10 flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-slate-800 tracking-tight">{data.value}</span>
        <span className="text-sm font-medium text-slate-400">{data.unit}</span>
      </div>
      
      {/* 辅助状态描述 */}
      {data.trend && (
        <div className="z-10 mt-1 text-[11px] font-medium">
          <span className={cn(
            data.trendDirection === 'up' ? 'text-emerald-500' : 
            data.trendDirection === 'down' ? 'text-rose-500' : 'text-slate-400'
          )}>
            {data.trend}
          </span>
        </div>
      )}
    </div>
  );
};
