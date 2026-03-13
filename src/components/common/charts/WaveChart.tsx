import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface WaveChartProps {
  data: any[];
  dataKey: string;
  color: string;
}

export const WaveChart: React.FC<WaveChartProps> = ({ data, dataKey, color }) => {
  return (
    <div className="w-full h-full opacity-30 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorUv-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#colorUv-${dataKey})`} 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
