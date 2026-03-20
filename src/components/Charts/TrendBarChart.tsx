import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Sparkles } from 'lucide-react';
import { TrendDataPoint } from '../../interfaces/manager_dashboard';

interface TrendBarChartProps {
  data: TrendDataPoint[];
  title: string;
  subtitle?: string;
  dataKey?: string;
  height?: number;
  color?: string;
  valueFormatter?: (val: number) => string;
  complianceRate?: number;
  complianceLabel?: string;
  aiInsight?: string;
  hideHeader?: boolean;
  className?: string;
}

export const TrendBarChart: React.FC<TrendBarChartProps> = ({
  data,
  title,
  subtitle,
  dataKey = 'value',
  height = 140,
  color = '#3b82f6', // default blue-500
  valueFormatter = (val) => `${val}`,
  complianceRate,
  complianceLabel = '达标率',
  aiInsight,
  hideHeader = false,
  className = ''
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center gap-3 relative overflow-hidden h-[60px] ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-white opacity-50" />
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shadow-inner relative z-10 shrink-0">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
        <div className="relative z-10 flex-1">
          <p className="text-[12px] font-bold text-slate-700 leading-tight">数据采集中</p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
            连续打卡 3 天后，AI 将为您生成专属趋势分析
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 ${className}`}>
      {!hideHeader && (
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {complianceRate !== undefined && (
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-medium mb-0.5">{complianceLabel}</div>
              <div className="text-[18px] font-bold text-emerald-500 tracking-tight">{complianceRate}%</div>
            </div>
          )}
        </div>
      )}
      
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              hide={true} 
              domain={[0, 'dataMax + 20']} 
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 text-white text-[11px] px-2 py-1 rounded-lg shadow-lg font-medium">
                      {payload[0].payload.label || payload[0].payload.date}: {valueFormatter(payload[0].value as number)}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 4, 4]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {aiInsight && (
        <div className="mt-4 pt-4 border-t border-slate-100/60">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              <span className="text-slate-900 font-bold mr-1">AI 洞察:</span>
              {aiInsight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
