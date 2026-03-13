import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../../store';
import { Zap, AlertTriangle, Plus, Pill, Calendar, Activity, ShieldAlert, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { DailyHealthBase } from '../../../components/DailyHealthBase';
import { MigraineDiarySheet } from '../../../components/MigraineDiarySheet';
import { MedicalToolbox } from '../../../components/MedicalToolbox';
import { VisitSummaryModal } from '../../../components/VisitSummaryModal';
import MigraineCalendar from './MigraineCalendar';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { UserIdentity } from '../../../interfaces/user';
import { DiseaseTag } from '../../../configs/constants';
import { showComingSoon } from '../../../utils/ui';
import { ManagerSkeleton } from '../../../components/ManagerSkeleton';

export default function MigraineManager() {
  const { painkillerDates, recordPainkiller, identity, vitals, migraineFrequencyData, recordMigraineAttack, isDeviceBound } = useAppStore();
  const navigate = useNavigate();
  const isFamily = identity === UserIdentity.FAMILY;
  const [isDiarySheetVisible, setIsDiarySheetVisible] = useState(false);
  const [isVisitSummaryVisible, setIsVisitSummaryVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Count painkillers taken in the current month
  const today = new Date();
  const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthPainkillerDays = painkillerDates.filter(d => d.startsWith(currentMonthPrefix)).length;
  
  // MOH 熔断机制：每月止痛药服用天数 >= 15 天为红线
  const isMOHRisk = currentMonthPainkillerDays >= 15;

  const todayStr = today.toISOString().split('T')[0];
  const isTakenToday = painkillerDates.includes(todayStr);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isLoading) return <ManagerSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-10"
    >
      {/* 模块一：头痛状态看板与 MOH 红色防火墙 (Status Overview) */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
            {isFamily ? '长辈偏头痛守护' : '我的偏头痛守护'}
          </h2>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isMOHRisk ? 'bg-rose-50' : 'bg-violet-50'}`}>
            {isMOHRisk ? <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> : <Zap className="w-3.5 h-3.5 text-violet-500" />}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* MOH Compact Banner */}
          <div 
            className={`flex items-center justify-between p-3.5 rounded-[20px] transition-all duration-500 relative overflow-hidden group ${
              isMOHRisk 
                ? 'bg-gradient-to-br from-rose-50 to-white border-none shadow-[0_8px_24px_rgba(225,29,72,0.08)]' 
                : 'bg-gradient-to-br from-violet-50 to-white border-none shadow-[0_8px_24px_rgba(139,92,246,0.08)]'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 transition-colors ${isMOHRisk ? 'bg-rose-200/20' : 'bg-violet-200/20'}`} />
            <div className="flex items-center gap-3 relative z-10">
              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 shadow-inner ${isMOHRisk ? 'bg-rose-100/80 text-rose-600' : 'bg-violet-100/80 text-violet-600'}`}>
                {isMOHRisk ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div>
                <h3 className={`text-[14px] font-bold tracking-tight mb-0.5 ${isMOHRisk ? 'text-rose-900' : 'text-violet-900'}`}>
                  {isMOHRisk ? 'MOH 风险预警' : '状态平稳'}
                </h3>
                <p className={`text-[11px] font-medium ${isMOHRisk ? 'text-rose-700/80' : 'text-violet-700/80'}`}>
                  {isMOHRisk ? `服药已达 ${currentMonthPainkillerDays} 天，请立即就医` : `本月已服药 ${currentMonthPainkillerDays} 天，未超标`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsCalendarVisible(true)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full active:scale-95 transition-transform relative z-10 shadow-sm ${
                isMOHRisk ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white' : 'bg-gradient-to-r from-violet-500 to-violet-600 text-white'
              }`}
            >
              查看日历
            </button>
          </div>

          {/* Headache Frequency Capsule */}
          <div 
            onClick={() => showComingSoon('发作频次分析', '主人，多维度发作频次与诱因分析报告即将上线。')}
            className="bg-gradient-to-br from-blue-50 to-white border-none rounded-[20px] p-3.5 flex items-center justify-between shadow-[0_8px_24px_rgba(59,130,246,0.08)] cursor-pointer active:scale-95 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-200/30 transition-colors" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-[14px] bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-inner">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-blue-900 tracking-tight mb-0.5">
                  本月发作频次 <span className="text-[15px] ml-1">{migraineFrequencyData.reduce((acc, curr) => acc + curr.value, 0)} 次</span>
                </h3>
                <p className="text-[11px] text-blue-700/80 font-medium">
                  较上月减少 2 次，控制良好
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 模块二：健康趋势洞察 (Data Insights) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">健康趋势解析</h3>
          <button 
            onClick={() => setIsVisitSummaryVisible(true)}
            className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            AI 智能复诊小结
          </button>
        </div>
        <TrendBarChart 
          data={migraineFrequencyData} 
          title={isFamily ? "长辈近 7 日头痛发作频率" : "近 7 日头痛发作频率"}
          subtitle="识别并规避诱发因素"
          valueFormatter={(val) => `${val} 次`}
          color="#8b5cf6" // violet-500
          complianceRate={85}
          complianceLabel="控制率"
        />
      </motion.div>

      {/* 模块三：日常健康基座 & IoT (Wearable Integration) */}
      <motion.div variants={itemVariants}>
        <DailyHealthBase />
      </motion.div>

      {/* 模块四：头痛发作日记与干预流 (Daily Actions) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="px-1">
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">发作干预</h3>
        </div>
        
        {/* Bento Box: 记录头痛 & 服药打卡 */}
        <div className="grid grid-cols-2 gap-2.5">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsDiarySheetVisible(true)}
            className="bg-white p-2.5 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-1.5 group hover:border-violet-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-[10px] bg-violet-50 flex items-center justify-center text-violet-500 group-hover:bg-violet-100 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">{isFamily ? '记录长辈头痛' : '记录今日头痛'}</h4>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">记录发作诱因</p>
            </div>
          </motion.button>

          <div className="bg-white p-2.5 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-1.5 relative group">
            <div className="w-7 h-7 rounded-[10px] bg-rose-50 flex items-center justify-center text-rose-500">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <div className="text-left w-full">
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">{isFamily ? '长辈服止痛药' : '服用止痛药'}</h4>
              <div className="mt-1 flex items-center justify-between w-full">
                {isTakenToday ? (
                  <div className="flex items-center gap-1">
                    <div className="text-[9px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">今日已服</div>
                    <button 
                      onClick={() => {
                        recordPainkiller(todayStr);
                        Toast.show({ content: '已撤销服药记录' });
                      }}
                      className="p-1 text-slate-300 hover:text-slate-500 active:bg-slate-100 rounded-full transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      recordPainkiller(todayStr);
                      Toast.show({ content: '已记录服药', icon: 'success' });
                    }}
                    className="w-full py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-[6px] hover:bg-slate-800 transition-colors active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                  >
                    一键打卡
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 模块五：医患连接与服务 (Medical Services) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="px-1">
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">医疗服务</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/assessment?diseaseTag=Migraine')}
            className="bg-white p-2.5 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-1.5 text-left group hover:border-indigo-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-[10px] bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-slate-900 leading-tight">前沿特效药评估</h4>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">CGRP 靶向治疗申请</p>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCalendarVisible(true)}
            className="bg-white p-2.5 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-1.5 text-left group hover:border-blue-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-[10px] bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-slate-900 leading-tight">历史日历</h4>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium">头痛与用药回顾</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MedicalToolbox />
      </motion.div>

      <MigraineDiarySheet visible={isDiarySheetVisible} onClose={() => setIsDiarySheetVisible(false)} />

      {/* 头痛与服药日历弹窗 */}
      <MigraineCalendar visible={isCalendarVisible} onClose={() => setIsCalendarVisible(false)} />

      {/* 就诊摘要弹窗 */}
      <VisitSummaryModal visible={isVisitSummaryVisible} onClose={() => setIsVisitSummaryVisible(false)} diseaseTag={DiseaseTag.MIGRAINE} />
    </motion.div>
  );
}
