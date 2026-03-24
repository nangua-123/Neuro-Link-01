import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, HeartHandshake, ClipboardList, Plus, BrainCircuit, Activity, CalendarDays } from 'lucide-react';
import { CDRDiarySheet } from '../../components/CDRDiarySheet';
import { useAppStore } from '../../store';

export default function CognitiveCareView() {
  const navigate = useNavigate();
  const [isDiaryVisible, setIsDiaryVisible] = useState(false);
  const { cdrRecords } = useAppStore();

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - ts;
    const days = Math.floor(diff / (1000 * 3600 * 24));
    const timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (days === 0) return `今天 ${timeStr}`;
    if (days === 1) return `昨天 ${timeStr}`;
    return `${days}天前 ${timeStr}`;
  };

  const formattedCdr = cdrRecords.map(r => ({
    date: formatTime(r.timestamp),
    desc: r.bpsd.join('、'),
    severity: r.severity
  })).reverse();

  const displayRecords = formattedCdr.length > 0 ? formattedCdr : [
    { date: '昨天 19:30', desc: '黄昏综合征，情绪烦躁，反复要求回家。', severity: 'moderate' },
    { date: '3天前 14:00', desc: '找不到钥匙，怀疑保姆偷窃。', severity: 'mild' },
    { date: '上周 22:15', desc: '夜间游荡，试图开门外出。', severity: 'severe' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 relative overflow-hidden">
      {/* 柔和背景光晕 */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-50/80 via-blue-50/40 to-transparent" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute top-32 -left-24 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 px-4 pt-5 pb-4 flex items-center justify-between shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900">认知与记忆专区</h1>
        <div className="w-10" /> {/* 占位以居中标题 */}
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 px-4 space-y-5 pb-28 hide-scrollbar">
        {/* 核心状态舱 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-50 rounded-bl-full opacity-50" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-bold text-slate-900">照护概览</h2>
              <p className="text-[12px] text-slate-500 mt-1">已持续记录 <span className="text-blue-600 font-bold">142</span> 天</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-4 border-white shadow-sm">
              <HeartHandshake className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-50 rounded-[16px] p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium mb-1">本周异常行为</div>
              <div className="text-[24px] font-black text-slate-900 leading-none">{cdrRecords.length > 0 ? cdrRecords.length : 2} <span className="text-[12px] font-medium text-slate-400">次</span></div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-[16px] p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium mb-1">最新 CDR 评分</div>
              <div className="text-[24px] font-black text-slate-900 leading-none">1.0 <span className="text-[12px] font-medium text-slate-400">轻度</span></div>
            </div>
          </div>
        </motion.div>

        {/* BPSD 行为记录 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[15px] font-bold text-slate-900">近期 BPSD 记录</h3>
            <span className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              全部
            </span>
          </div>

          <div className="space-y-3">
            {displayRecords.map((record, index) => (
              <div key={index} className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${
                  record.severity === 'severe' ? 'bg-blue-50' : record.severity === 'moderate' ? 'bg-blue-50' : 'bg-slate-50'
                }`}>
                  <Activity className={`w-5 h-5 ${
                    record.severity === 'severe' ? 'text-blue-500' : record.severity === 'moderate' ? 'text-blue-500' : 'text-slate-500'
                  }`} />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-bold text-slate-900">{record.date}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      record.severity === 'severe' ? 'bg-blue-50 text-blue-600' : record.severity === 'moderate' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {record.severity === 'severe' ? '重度' : record.severity === 'moderate' ? '中度' : '轻度'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{record.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 动态认知量表入口 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">动态认知量表</h3>
              <p className="text-[11px] text-slate-500 font-medium">上次测评: 2026-02-15</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/assessment')}
            className="px-4 py-2 bg-blue-50 text-blue-600 text-[12px] font-bold rounded-full active:scale-95 transition-transform"
          >
            去复查
          </button>
        </motion.div>
      </div>

      {/* 底部悬浮按钮 */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-20">
        <button 
          onClick={() => setIsDiaryVisible(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded-[20px] h-14 flex items-center justify-center gap-2 text-[15px] font-bold shadow-[0_8px_24px_rgba(59,130,246,0.25)] active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
          记录 BPSD 行为
        </button>
      </div>

      <CDRDiarySheet visible={isDiaryVisible} onClose={() => setIsDiaryVisible(false)} />
    </div>
  );
}
