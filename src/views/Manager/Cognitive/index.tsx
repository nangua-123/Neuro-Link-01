import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../../store';
import { UserIdentity } from '../../../interfaces/user';
import { Brain, MapPin, Play, Moon, Sun, Coffee, ChevronRight, FileText, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { VitalsGrid } from '../../../components/Charts/VitalsGrid';
import { IoTStatusCard } from '../../../components/IoTStatusCard';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';

export default function CognitiveManager() {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <StatusOverview isFamily={isFamily} />
      <DataInsights />
      <DailyHealthBase />
      <DailyActions isFamily={isFamily} />
      <MedicalServices />
    </motion.div>
  );
}

function StatusOverview({ isFamily }: { isFamily: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {isFamily ? '长辈今日认知状态' : '我的脑力状态'}
        </h2>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <Brain className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      {/* LBS Security Fence Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-5">
            <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-md">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-50 text-[10px] font-semibold tracking-wider uppercase">LBS 实时安全围栏</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-white text-2xl font-bold tracking-tight">当前位于安全区</span>
              </div>
              <p className="text-blue-100/90 text-xs mt-1 font-medium">
                {isFamily ? '长辈正在家中，一切安好' : '您当前处于设定的安全活动范围内'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataInsights() {
  // Mock Trend Data for Cognitive Training
  const trainingData = [
    { date: '10.21', value: 15 },
    { date: '10.22', value: 20 },
    { date: '10.23', value: 0, color: '#f59e0b' }, // Missed
    { date: '10.24', value: 15 },
    { date: '10.25', value: 30 },
    { date: '10.26', value: 15 },
    { date: '今日', value: 0, color: '#94a3b8' }, // Not started
  ];

  return (
    <TrendBarChart 
      data={trainingData} 
      title="近 7 日脑力训练时长" 
      subtitle="坚持每日 15 分钟数字疗法"
      valueFormatter={(val) => `${val} 分钟`}
      color="#6366f1" // indigo-500
    />
  );
}

function DailyHealthBase() {
  const { isDeviceBound } = useAppStore();
  
  // Mock Vitals Data
  const mockVitals = {
    hrv: 38,
    deepSleepRatio: 22,
    eegStability: 88,
    lastSyncTime: '刚刚'
  };

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">日常健康基座</h3>
      </div>
      
      <IoTStatusCard />
      
      {isDeviceBound && (
        <VitalsGrid vitals={mockVitals} />
      )}
    </div>
  );
}

function DailyActions({ isFamily }: { isFamily: boolean }) {
  const { sleepRating, rateSleep } = useAppStore();

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">今日干预</h3>
        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
          {isFamily ? '协助长辈完成今日的认知训练' : '完成今日的脑力挑战，保持大脑活力'}
        </p>
      </div>

      {/* DTx Training Card */}
      <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Brain className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-full">
              数字疗法 (DTx)
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1.5">空间记忆连连看</h4>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
            通过趣味连线游戏，锻炼短期记忆与空间感知能力，建议每日完成 15 分钟。
          </p>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => Toast.show({ content: '正在加载数字疗法游戏引擎...', icon: 'loading' })}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-[16px] font-medium text-sm transition-colors flex items-center justify-center space-x-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>开始今日训练</span>
          </motion.button>
        </div>
      </div>

      {/* Caregiver Micro-Follow-up (Only for Family) */}
      {isFamily && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">照护微随访</h4>
              <p className="text-[10px] text-slate-500 font-medium">长辈昨晚睡眠质量如何？</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {[
              { id: 1, icon: Sun, label: '安稳', color: 'text-emerald-600', bg: 'bg-emerald-50', activeBg: 'bg-emerald-500', activeText: 'text-white' },
              { id: 2, icon: Coffee, label: '一般', color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-amber-500', activeText: 'text-white' },
              { id: 3, icon: Moon, label: '易醒', color: 'text-rose-600', bg: 'bg-rose-50', activeBg: 'bg-rose-500', activeText: 'text-white' },
            ].map((option) => {
              const isActive = sleepRating === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => rateSleep(option.id)}
                  className={`flex-1 py-2.5 rounded-[16px] flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 ${
                    isActive ? `${option.activeBg} shadow-md` : `${option.bg} hover:bg-slate-100`
                  }`}
                >
                  <option.icon className={`w-4 h-4 ${isActive ? option.activeText : option.color}`} />
                  <span className={`text-[10px] font-medium ${isActive ? option.activeText : option.color}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MedicalServices() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">医疗服务</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <ServiceCard 
          icon={FileText}
          title="复查动态量表"
          desc="CDR 临床痴呆评定量表"
          color="blue"
          onClick={() => navigate('/assessment?diseaseTag=AD')}
        />
        <ServiceCard 
          icon={HeartHandshake}
          title="照护者心理支持"
          desc="家属减负与专业心理疏导"
          color="indigo"
          onClick={() => Toast.show({ content: '正在连接心理咨询师...', icon: 'loading' })}
        />
      </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc, color, onClick }: { icon: any, title: string, desc: string, color: 'blue' | 'indigo', onClick?: () => void }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all duration-300"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{desc}</p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </motion.div>
  );
}
