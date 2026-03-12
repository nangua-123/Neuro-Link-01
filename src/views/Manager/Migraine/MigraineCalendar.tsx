import React, { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { ChevronLeft, ChevronRight, Pill, AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { useAppStore } from '../../../store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function MigraineCalendar({ visible, onClose }: Props) {
  const { painkillerDates, recordPainkiller } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Count painkillers taken in the currently viewed month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const currentMonthPainkillerDays = painkillerDates.filter(d => d.startsWith(currentMonthPrefix)).length;
  const isMOHRisk = currentMonthPainkillerDays >= 15;

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isTaken = painkillerDates.includes(dateStr);
    recordPainkiller(dateStr);
    
    if (isTaken) {
      Toast.show({ content: '已撤销服药记录' });
    } else {
      Toast.show({ content: '已记录服药', icon: 'success' });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Popup 
      visible={visible} 
      onMaskClick={onClose} 
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px', 
        minHeight: '75vh', 
        padding: '24px', 
        backgroundColor: '#FAFAFA' 
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-slate-900">头痛与服药日历</h3>
        <div onClick={onClose} className="p-2 bg-slate-100 rounded-full active:scale-95 cursor-pointer">
          <X className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* MOH Status Card */}
      <div className={`mb-6 p-4 rounded-[20px] transition-colors duration-300 ${
        isMOHRisk ? 'bg-rose-50 border border-rose-100' : 'bg-violet-50 border border-violet-100'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isMOHRisk ? <ShieldAlert className="w-5 h-5 text-rose-500" /> : <Pill className="w-5 h-5 text-violet-500" />}
            <span className={`text-[14px] font-bold ${isMOHRisk ? 'text-rose-700' : 'text-violet-700'}`}>
              本月止痛药: {currentMonthPainkillerDays} 天
            </span>
          </div>
          <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
            isMOHRisk ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'
          }`}>
            {isMOHRisk ? 'MOH 高风险' : '安全范围'}
          </span>
        </div>
        <p className={`text-[11px] font-medium leading-relaxed ${isMOHRisk ? 'text-rose-600/80' : 'text-violet-600/80'}`}>
          {isMOHRisk 
            ? '警告：本月止痛药使用已达 15 天红线，极易诱发药物过度使用性头痛 (MOH)。请立即联系医生调整治疗方案。' 
            : `距离 MOH 风险红线 (15天) 还有 ${15 - currentMonthPainkillerDays} 天，请谨慎使用单纯止痛药。`}
        </p>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h4 className="text-[16px] font-bold text-slate-800">
          {year}年 {month + 1}月
        </h4>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
        <div className="grid grid-cols-7 gap-y-4 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-[11px] font-semibold text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isTaken = painkillerDates.includes(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div key={day} className="flex justify-center">
                <button
                  onClick={() => handleDayClick(day)}
                  className={`relative w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-medium transition-all duration-300 ${
                    isTaken 
                      ? 'bg-rose-500 text-white shadow-[0_2px_8px_rgba(244,63,94,0.3)]' 
                      : isToday 
                        ? 'bg-slate-100 text-slate-900 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {day}
                  {isTaken && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Pill className="w-2.5 h-2.5 text-rose-500" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>已服止痛药</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-100" />
          <span>今日</span>
        </div>
      </div>
    </Popup>
  );
}
