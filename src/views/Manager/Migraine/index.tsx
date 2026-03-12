import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../../store';
import { Zap, AlertTriangle, Plus, Pill, Calendar, Activity, ShieldAlert, ArrowRight, RotateCcw } from 'lucide-react';
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
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {isFamily ? '长辈偏头痛管家' : '我的偏头痛管家'}
          </h2>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMOHRisk ? 'bg-rose-50' : 'bg-violet-50'}`}>
            {isMOHRisk ? <ShieldAlert className="w-4 h-4 text-rose-500" /> : <Zap className="w-4 h-4 text-violet-500" />}
          </div>
        </div>

        <div 
          className={`relative overflow-hidden rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 ${
            isMOHRisk 
              ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20 text-white' 
              : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/20 text-white'
          }`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-4xl font-bold tracking-tighter">{currentMonthPainkillerDays}</span>
              <span className="text-xs font-medium opacity-80">天 / 本月止痛药</span>
            </div>
            
            <div>
              {isMOHRisk ? (
                <div className="flex items-start space-x-2 bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                  <AlertTriangle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <p className="text-[10px] font-medium leading-relaxed">
                    {isFamily ? '长辈本月止痛药使用已达红线，极易诱发药物过度使用性头痛 (MOH)！请立即协助停止滥用并联系医生。' : '本月止痛药使用已达红线，极易诱发药物过度使用性头痛 (MOH)！请立即停止滥用并联系医生。'}
                  </p>
                </div>
              ) : (
                <p className="text-xs opacity-90 leading-relaxed font-medium">
                  距离 MOH 风险红线还有 <span className="font-bold text-sm">{15 - currentMonthPainkillerDays}</span> 天。{isFamily ? '请提醒长辈谨慎使用单纯止痛药，记录诱因更重要。' : '请谨慎使用单纯止痛药，记录诱因更重要。'}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 模块二：健康趋势洞察 (Data Insights) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">数据洞察</h3>
          <button 
            onClick={() => setIsVisitSummaryVisible(true)}
            className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            生成就诊摘要
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
          <h3 className="text-base font-bold text-slate-900 tracking-tight">发作干预</h3>
        </div>
        
        {/* 一键记录头痛 */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDiarySheetVisible(true)}
          className="w-full bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center justify-between group hover:border-violet-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 group-hover:bg-violet-100 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-900">{isFamily ? '记录长辈头痛' : '记录今日头痛'}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">记录疼痛等级与发作诱因</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500" />
          </div>
        </motion.button>

        {/* 服药打卡 */}
        <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{isFamily ? '长辈服用止痛药' : '服用止痛药'}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">布洛芬 / 散利痛等单纯止痛药</p>
            </div>
          </div>
          {isTakenToday ? (
            <div className="flex items-center gap-2">
              <div className="text-[12px] font-semibold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full">
                今日已服
              </div>
              <button 
                onClick={() => {
                  recordPainkiller(todayStr);
                  Toast.show({ content: '已撤销服药记录' });
                }}
                className="p-1.5 text-slate-300 hover:text-slate-500 active:bg-slate-100 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                recordPainkiller(todayStr);
                Toast.show({ content: '已记录服药', icon: 'success' });
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-full hover:bg-slate-800 transition-colors active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            >
              打卡
            </button>
          )}
        </div>
      </motion.div>

      {/* 模块五：医患连接与服务 (Medical Services) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">医疗服务</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/assessment?diseaseTag=Migraine')}
            className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-2 text-left group hover:border-indigo-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">CGRP 靶向药</h4>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">特效药申请评估</p>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCalendarVisible(true)}
            className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-2 text-left group hover:border-blue-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">历史日历</h4>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">头痛与用药回顾</p>
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
