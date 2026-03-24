import React, { useState, useMemo } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Clock } from 'lucide-react';

interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface HistoricalData {
  timestamp: string;
  data: RadarDataPoint[];
}

interface RadarChartProps {
  data: RadarDataPoint[];
  color?: string;
  fillOpacity?: number;
  historicalData?: HistoricalData[];
}

export function RadarChart({ data, color = '#3b82f6', fillOpacity = 0.3, historicalData }: RadarChartProps) {
  // Auto-generate historical data if not provided to demonstrate the feature
  const history = useMemo(() => {
    if (historicalData && historicalData.length > 0) return historicalData;
    
    // Generate mock history based on current data
    const past1 = data.map(d => ({ ...d, A: Math.max(0, d.A - Math.floor(Math.random() * 15 + 5)) }));
    const past2 = data.map(d => ({ ...d, A: Math.max(0, d.A - Math.floor(Math.random() * 25 + 10)) }));
    
    return [
      { timestamp: '01-15', data: past2 },
      { timestamp: '02-20', data: past1 },
      { timestamp: '当前', data: data },
    ];
  }, [data, historicalData]);

  const [selectedIndex, setSelectedIndex] = useState(history.length - 1);
  const currentData = history[selectedIndex].data;

  return (
    <div className="w-full relative">
      {/* Timestamp Selector */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-4 h-4" />
          <span className="text-[13px] font-medium">时间节点</span>
        </div>
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-full border border-slate-200/50 shadow-inner">
          {history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3 py-1 text-[12px] font-bold rounded-full transition-all duration-300 ${
                selectedIndex === idx 
                  ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.timestamp}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-[24px] p-2 shadow-inner border border-white/60 relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={currentData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="能力维度"
              dataKey="A"
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={fillOpacity}
              animationDuration={800}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
