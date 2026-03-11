import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  complianceLabel = '达标率'
}) => {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {complianceRate !== undefined && (
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium mb-0.5">{complianceLabel}</div>
            <div className="text-[18px] font-bold text-emerald-500 tracking-tight">{complianceRate}%</div>
          </div>
        )}
      </div>
      
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
    </div>
  );
};
