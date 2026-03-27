import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Calendar as CalendarIcon, Activity, HeartHandshake, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store';
import { RecordSheet } from '../../components/CareDiary/RecordSheet';
import { DiaryTimelineCard } from '../../components/CareDiary/DiaryTimelineCard';
import { motion, AnimatePresence } from 'motion/react';
import { SafeArea, NavBar } from 'antd-mobile';

export const CareDiary: React.FC = () => {
  const navigate = useNavigate();
  const { careDiaryRecords, identity, boundPatients, currentPatientId } = useAppStore();
  
  const [showSheet, setShowSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const isPatient = identity === 'PATIENT';
  const patient = boundPatients.find(p => p.id === currentPatientId);
  const subjectLabel = isPatient ? '我' : (patient?.name || '长辈');

  // 生成最近 7 天的日期数组
  const recentDates = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const recordsList = useMemo(() => {
    return Object.values(careDiaryRecords).sort((a, b) => b.timestamp - a.timestamp);
  }, [careDiaryRecords]);

  // 统计高危症状天数
  const highRiskDays = useMemo(() => {
    return recordsList.filter(r => r.hasSevereIncident || r.bpsdSymptoms.some(s => ['hallucination', 'agitation', 'disinhibition', 'aberrant_motor'].includes(s))).length;
  }, [recordsList]);

  return (
    <div className="bg-slate-50 flex flex-col relative overflow-hidden h-full">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-blue-100/80 via-white to-transparent" />
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full">
        <SafeArea position="top" />
        <NavBar 
          backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
          onBack={() => navigate(-1)}
          className="bg-transparent shrink-0"
        >
          <span className="font-bold text-slate-800">照护日记</span>
        </NavBar>

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-6 hide-scrollbar">
          
          {/* AI Greeting */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center shadow-sm border border-blue-200/50">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">记录点滴，AI 护航</span>
          </motion.div>

          {/* 概览卡片 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-[32px] p-6 text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[24px] font-bold mb-1.5 tracking-tight">{subjectLabel}的照护概览</h2>
                  <p className="text-blue-100/80 text-[13px] font-medium">持续记录，掌握健康趋势</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <HeartHandshake className="w-6 h-6 text-blue-100" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex-1 bg-black/10 rounded-[24px] p-4 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                  <div className="text-[12px] text-white/70 mb-1 font-medium">累计记录</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-bold leading-none tracking-tighter">{recordsList.length}</span>
                    <span className="text-[13px] text-white/80 font-medium">天</span>
                  </div>
                </div>
                <div className="flex-1 bg-black/10 rounded-[24px] p-4 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                  <div className="text-[12px] text-white/70 mb-1 font-medium">高危天数</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-bold leading-none tracking-tighter">{highRiskDays}</span>
                    <span className="text-[13px] text-white/80 font-medium">天</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 日历条 (Calendar Strip) */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">近期记录</h3>
              <button 
                onClick={() => setSelectedDate('all')}
                className={`text-[13px] font-medium flex items-center gap-1 px-3 py-1 rounded-full border shadow-sm transition-all ${
                  selectedDate === 'all' 
                    ? 'bg-blue-50 text-blue-600 border-blue-200' 
                    : 'bg-white/80 backdrop-blur-md text-slate-500 border-slate-200/50 hover:bg-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                全部
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {recentDates.map(date => {
                const dateObj = new Date(date);
                const day = dateObj.getDate();
                const weekDay = ['日', '一', '二', '三', '四', '五', '六'][dateObj.getDay()];
                const isSelected = date === selectedDate;
                const hasRecord = !!careDiaryRecords[date];
                
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      flex-shrink-0 w-14 h-16 rounded-[20px] flex flex-col items-center justify-center gap-1 transition-all
                      ${isSelected 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]' 
                        : 'bg-white/80 backdrop-blur-md text-slate-600 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 hover:bg-white'
                      }
                    `}
                  >
                    <span className={`text-[11px] font-medium ${isSelected ? 'opacity-80' : 'text-slate-400'}`}>{weekDay}</span>
                    <span className="text-[16px] font-bold leading-none">{day}</span>
                    {hasRecord && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 记录列表 */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {selectedDate === 'all' ? (
                recordsList.length > 0 ? (
                  recordsList.map((record, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      key={record.id}
                    >
                      <DiaryTimelineCard record={record} subjectLabel={subjectLabel} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    key="empty-all"
                    className="bg-white/80 backdrop-blur-md rounded-[28px] p-10 text-center border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100/50">
                      <Activity className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="text-[16px] font-bold text-slate-800 mb-2">暂无任何记录</h4>
                    <p className="text-[14px] text-slate-500 max-w-[200px] mx-auto leading-relaxed mb-6">记录{subjectLabel}的日常状态，AI将为您提供更精准的照护建议</p>
                    <button 
                      onClick={() => setShowSheet(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-[14px] font-bold active:scale-95 transition-transform shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                    >
                      立即记录
                    </button>
                  </motion.div>
                )
              ) : careDiaryRecords[selectedDate] ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  key={`record-${selectedDate}`}
                >
                  <DiaryTimelineCard record={careDiaryRecords[selectedDate]} subjectLabel={subjectLabel} />
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  key={`empty-${selectedDate}`}
                  className="bg-white/80 backdrop-blur-md rounded-[28px] p-10 text-center border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100/50">
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-[16px] font-bold text-slate-800 mb-2">今日暂无记录</h4>
                  <p className="text-[14px] text-slate-500 max-w-[200px] mx-auto leading-relaxed mb-6">记录{subjectLabel}的日常状态，AI将为您提供更精准的照护建议</p>
                  <button 
                    onClick={() => setShowSheet(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-[14px] font-bold active:scale-95 transition-transform shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                  >
                    立即记录
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pt-12 pb-[calc(env(safe-area-inset-bottom)+24px)] px-5 z-50 pointer-events-none">
        <button 
          onClick={() => setShowSheet(true)}
          className="w-full bg-blue-600 text-white rounded-[24px] h-14 flex items-center justify-center gap-2 text-[16px] font-bold shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-95 transition-transform pointer-events-auto"
        >
          <Plus className="w-5 h-5 text-white" />
          添加照护记录
        </button>
      </div>

      {/* 记录弹窗 */}
      <RecordSheet 
        visible={showSheet} 
        onClose={() => setShowSheet(false)} 
        date={selectedDate}
      />
    </div>
  );
};

