import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../../store';
import { Zap, AlertTriangle, Plus, Pill, Calendar, Activity, ShieldAlert, ArrowRight } from 'lucide-react';

export default function MigraineManager() {
  const { painkillerDays, recordPainkiller } = useAppStore();
  
  // MOH 熔断机制：每月止痛药服用天数 >= 15 天为红线
  const isMOHRisk = painkillerDays >= 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 模块一：头痛状态看板与 MOH 红色防火墙 (Status Overview) */}
      <div 
        className={`relative overflow-hidden rounded-[32px] p-6 text-white shadow-xl transition-all duration-500 ${
          isMOHRisk 
            ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20' 
            : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/20'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center space-x-3 mb-6 relative z-10">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            {isMOHRisk ? <ShieldAlert className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
          </div>
          <h2 className="text-xl font-semibold tracking-tight">偏头痛管家</h2>
        </div>

        <div className="relative z-10">
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-light tracking-tighter">{painkillerDays}</span>
            <span className="text-sm font-medium opacity-80">天 / 本月止痛药</span>
          </div>
          
          <div className="mt-4">
            {isMOHRisk ? (
              <div className="flex items-start space-x-2 bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                <AlertTriangle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-snug">
                  本月止痛药使用已达红线，极易诱发药物过度使用性头痛 (MOH)！请立即停止滥用并联系医生。
                </p>
              </div>
            ) : (
              <p className="text-sm opacity-90 leading-relaxed">
                距离 MOH 风险红线还有 <span className="font-bold">{15 - painkillerDays}</span> 天。请谨慎使用单纯止痛药，记录诱因更重要。
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 模块二：头痛发作日记与干预流 (Daily Actions) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 px-2">发作干预</h3>
        
        {/* 一键记录头痛 */}
        <button 
          onClick={() => alert('Mock: 弹出头痛记录表单（疼痛等级、诱因如熬夜/经期等）')}
          className="w-full bg-white p-5 rounded-[28px] shadow-sm shadow-slate-100 border border-slate-100/50 flex items-center justify-between group hover:border-violet-200 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-500 group-hover:bg-violet-100 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-base font-semibold text-slate-800">记录今日头痛</h4>
              <p className="text-xs text-slate-500 mt-0.5">记录疼痛等级与发作诱因</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-400 transition-colors" />
        </button>

        {/* 服药打卡 */}
        <div className="bg-white p-5 rounded-[28px] shadow-sm shadow-slate-100 border border-slate-100/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-800">服用止痛药</h4>
              <p className="text-xs text-slate-500 mt-0.5">布洛芬 / 散利痛等单纯止痛药</p>
            </div>
          </div>
          <button 
            onClick={recordPainkiller}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors active:scale-95"
          >
            打卡
          </button>
        </div>
      </div>

      {/* 模块三：医患连接与服务 (Medical Services) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 px-2">医疗服务</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-5 rounded-[28px] shadow-sm shadow-slate-100 border border-slate-100/50 flex flex-col items-start space-y-3 text-left group hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">CGRP 靶向药</h4>
              <p className="text-xs text-slate-500 mt-1">特效药申请评估</p>
            </div>
          </button>

          <button className="bg-white p-5 rounded-[28px] shadow-sm shadow-slate-100 border border-slate-100/50 flex flex-col items-start space-y-3 text-left group hover:border-blue-200 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">历史日历</h4>
              <p className="text-xs text-slate-500 mt-1">头痛趋势回顾</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
