import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Activity, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for seizures
const mockSeizures = [
  { date: new Date(2026, 2, 1), type: 'major', duration: '3min' },
  { date: new Date(2026, 2, 15), type: 'minor', duration: '1min' },
  { date: new Date(2026, 1, 10), type: 'major', duration: '4min' },
  { date: new Date(2026, 1, 22), type: 'minor', duration: '30s' },
  { date: new Date(2026, 0, 5), type: 'major', duration: '5min' },
];

const mockTrendData = [
  { month: '10月', count: 5 },
  { month: '11月', count: 4 },
  { month: '12月', count: 3 },
  { month: '1月', count: 2 },
  { month: '2月', count: 2 },
  { month: '3月', count: 1 },
];

export default function SeizureCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 4)); // Using the provided current time

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const startDayOfWeek = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  
  // Fill empty days at the beginning of the month
  const prefixDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const getSeizuresForDay = (date: Date) => {
    return mockSeizures.filter(s => isSameDay(s.date, date));
  };

  return (
    <div className="bg-white rounded-[20px] p-3 shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-slate-100/80">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[14px] font-semibold text-slate-900 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-purple-500" />
          发作日历与趋势
        </h2>
        <div className="flex items-center gap-1 bg-slate-50 rounded-full p-0.5">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-medium text-slate-700 min-w-[3.5rem] text-center">
            {format(currentDate, 'yyyy年M月', { locale: zhCN })}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-[9px] font-medium text-slate-400 py-0.5">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {prefixDays.map(i => (
            <div key={`prefix-${i}`} className="aspect-square rounded-[8px] flex items-center justify-center text-slate-300 text-[10px]">
              {/* Empty */}
            </div>
          ))}
          {days.map(day => {
            const daySeizures = getSeizuresForDay(day);
            const hasMajor = daySeizures.some(s => s.type === 'major');
            const hasMinor = daySeizures.some(s => s.type === 'minor');
            const isToday = isSameDay(day, new Date(2026, 2, 4));

            return (
              <div 
                key={day.toString()} 
                className={`aspect-square rounded-[8px] flex flex-col items-center justify-center relative ${
                  isToday ? 'bg-purple-50 border border-purple-200' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-[11px] font-medium ${isToday ? 'text-purple-700' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </span>
                <div className="flex gap-0.5 mt-0.5 absolute bottom-1">
                  {hasMajor && <div className="w-1 h-1 rounded-full bg-red-500"></div>}
                  {hasMinor && !hasMajor && <div className="w-1 h-1 rounded-full bg-orange-400"></div>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-[9px] text-slate-500">大发作</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
            <span className="text-[9px] text-slate-500">小发作</span>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[12px] font-semibold text-slate-800">近半年发作趋势</h3>
          <div className="flex items-center gap-1 text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            <TrendingDown className="w-2.5 h-2.5" />
            <span>下降 50%</span>
          </div>
        </div>
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fill: '#94a3b8' }} 
                dy={6}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fill: '#94a3b8' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '6px' }}
                itemStyle={{ color: '#8b5cf6', fontWeight: 500, fontSize: '11px' }}
                labelStyle={{ color: '#64748b', marginBottom: '2px', fontSize: '9px' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                activeDot={{ r: 3, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
