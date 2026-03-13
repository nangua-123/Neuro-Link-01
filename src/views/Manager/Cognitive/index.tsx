import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Moon, Sun, Coffee, ChevronRight, FileText, HeartHandshake, CheckCircle2, Brain, MapPin, Plus, Sparkles } from 'lucide-react';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { DailyHealthBase } from '../../../components/DailyHealthBase';
import { DTxCard } from '../../../components/DTxCard';
import { CDRDiarySheet } from '../../../components/CDRDiarySheet';
import { MedicalToolbox } from '../../../components/MedicalToolbox';
import { VisitSummaryModal } from '../../../components/VisitSummaryModal';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { useAppStore } from '../../../store';
import { UserIdentity } from '../../../interfaces/user';
import { DiseaseTag } from '../../../configs/constants';
import { showComingSoon } from '../../../utils/ui';
import { ManagerSkeleton } from '../../../components/ManagerSkeleton';

export default function CognitiveManager() {
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;
  const [isLoading, setIsLoading] = useState(true);
  const [isCDRDiaryVisible, setIsCDRDiaryVisible] = useState(false);
  const [isVisitSummaryVisible, setIsVisitSummaryVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
      className="space-y-4 pb-8"
    >
      <motion.div variants={itemVariants}><StatusOverview isFamily={isFamily} /></motion.div>
      <motion.div variants={itemVariants}><DataInsights isFamily={isFamily} onOpenVisitSummary={() => setIsVisitSummaryVisible(true)} /></motion.div>
      <motion.div variants={itemVariants}><DailyHealthBase /></motion.div>
      <motion.div variants={itemVariants}><DailyActions isFamily={isFamily} onOpenCDRDiary={() => setIsCDRDiaryVisible(true)} /></motion.div>
      <motion.div variants={itemVariants}><MedicalServices isFamily={isFamily} /></motion.div>
      <motion.div variants={itemVariants}><MedicalToolbox /></motion.div>
      <CDRDiarySheet visible={isCDRDiaryVisible} onClose={() => setIsCDRDiaryVisible(false)} />
      <VisitSummaryModal visible={isVisitSummaryVisible} onClose={() => setIsVisitSummaryVisible(false)} diseaseTag={DiseaseTag.AD} />
    </motion.div>
  );
}

function StatusOverview({ isFamily }: { isFamily: boolean }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
          {isFamily ? '长辈认知守护' : '我的认知守护'}
        </h2>
        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {/* LBS Security Fence Banner */}
        <div 
          onClick={() => showComingSoon('LBS 安全围栏', '主人，正在与 IoT 设备进行位置服务联调，即将上线。')}
          className="bg-gradient-to-br from-emerald-50 to-white border-none rounded-[20px] p-3.5 flex items-center justify-between shadow-[0_8px_24px_rgba(16,185,129,0.08)] cursor-pointer active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-200/30 transition-colors" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-[14px] bg-emerald-100/80 text-emerald-600 flex items-center justify-center relative shadow-inner">
              <MapPin className="w-5 h-5 relative z-10" />
              <div className="absolute inset-0 bg-emerald-300 rounded-[14px] animate-ping opacity-20" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-emerald-900 tracking-tight mb-0.5">
                LBS 安全围栏
              </h3>
              <p className="text-[11px] text-emerald-700/80 font-medium">
                当前位于安全活动区
              </p>
            </div>
          </div>
        </div>

        {/* Training Status Capsule */}
        <div 
          onClick={() => showComingSoon('脑力训练', '主人，个性化认知训练计划生成中，敬请期待。')}
          className="bg-gradient-to-br from-blue-50 to-white border-none rounded-[20px] p-3.5 flex items-center justify-between shadow-[0_8px_24px_rgba(59,130,246,0.08)] cursor-pointer active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-200/30 transition-colors" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-[14px] bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-inner">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-blue-900 tracking-tight mb-0.5">
                脑力训练 <span className="text-[15px] ml-1">2/5 天</span>
              </h3>
              <p className="text-[11px] text-blue-700/80 font-medium">
                本周还需完成 3 天训练
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataInsights({ isFamily, onOpenVisitSummary }: { isFamily: boolean, onOpenVisitSummary: () => void }) {
  const { cognitiveTrainingData } = useAppStore();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">健康趋势解析</h3>
        <button 
          onClick={onOpenVisitSummary}
          className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full active:scale-95 transition-transform flex items-center gap-1"
        >
          <Sparkles className="w-2.5 h-2.5" />
          AI 智能复诊小结
        </button>
      </div>
      <TrendBarChart 
        data={cognitiveTrainingData} 
        title={isFamily ? "长辈近 7 日脑力训练时长" : "近 7 日脑力训练时长"}
        subtitle={isFamily ? "督促长辈每日坚持 15 分钟数字疗法" : "坚持每日 15 分钟数字疗法"}
        valueFormatter={(val) => `${val} 分钟`}
        color="#6366f1" // indigo-500
        complianceRate={85}
        complianceLabel="完成率"
      />
    </div>
  );
}



function DailyActions({ isFamily, onOpenCDRDiary }: { isFamily: boolean, onOpenCDRDiary: () => void }) {
  const { sleepRating, rateSleep } = useAppStore();

  return (
    <div className="space-y-2.5">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">今日干预</h3>
      </div>

      {isFamily && (
        <button 
          onClick={onOpenCDRDiary}
          className="w-full bg-blue-50 hover:bg-blue-100 transition-colors p-2.5 rounded-[12px] border border-blue-100/50 flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-[12px] font-bold text-blue-900">记录照护日记</h4>
              <p className="text-[9px] text-blue-700/70 mt-0.5 font-medium">记录长辈精神行为症状 (BPSD)</p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Plus className="w-3.5 h-3.5 text-blue-500" />
          </div>
        </button>
      )}

      {/* DTx Training Card */}
      <DTxCard 
        title="空间记忆连连看"
        description={isFamily ? "锻炼长辈短期记忆与空间感知" : "锻炼短期记忆与空间感知"}
        icon={Brain}
        theme="indigo"
        streak={3}
      />

      {/* Caregiver Micro-Follow-up (Only for Family) */}
      {isFamily && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-[10px] bg-amber-50 flex items-center justify-center text-amber-500">
              <Moon className="w-3 h-3" />
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-slate-900">照护微随访</h4>
              <p className="text-[8px] text-slate-500 font-medium">长辈昨晚睡眠质量如何？</p>
            </div>
          </div>
          
          <div className="flex space-x-1.5">
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
                  className={`flex-1 py-1 rounded-[8px] flex flex-col items-center justify-center space-y-0.5 transition-all duration-300 ${
                    isActive ? `${option.activeBg} shadow-sm` : `${option.bg} hover:bg-slate-100`
                  }`}
                >
                  <option.icon className={`w-3 h-3 ${isActive ? option.activeText : option.color}`} />
                  <span className={`text-[8px] font-medium ${isActive ? option.activeText : option.color}`}>
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

function MedicalServices({ isFamily }: { isFamily: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2.5">
      <div className="px-1">
        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">医疗服务</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2.5">
        <ServiceCard 
          icon={FileText}
          title={isFamily ? "长辈复查动态量表" : "复查动态量表"}
          desc="CDR 临床痴呆评定量表"
          color="blue"
          onClick={() => navigate('/assessment?diseaseTag=AD')}
        />
        {isFamily && (
          <ServiceCard 
            icon={HeartHandshake}
            title="照护者心理支持"
            desc="家属减负与专业心理疏导"
            color="indigo"
            onClick={() => showComingSoon('心理咨询室筹备中', '主人，专业的心理疏导团队正在入驻，敬请期待。')}
          />
        )}
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
      className="bg-white rounded-[12px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all duration-300"
    >
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 rounded-[10px] flex items-center justify-center ${colorStyles[color]}`}>
          <Icon className="w-3 h-3" />
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-slate-900">{title}</h4>
          <p className="text-[8px] text-slate-500 mt-0.5 font-medium">{desc}</p>
        </div>
      </div>
      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
        <ChevronRight className="w-3 h-3 text-slate-400" />
      </div>
    </motion.div>
  );
}
