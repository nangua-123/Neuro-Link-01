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
      className="space-y-6 pb-10"
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
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {isFamily ? '长辈认知守护' : '我的认知守护'}
        </h2>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <Brain className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      {/* LBS Security Fence Banner */}
      <div className="bg-emerald-50 border border-emerald-100/50 rounded-full p-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-[13px] font-bold text-emerald-900 tracking-tight">防走失守护</span>
          <span className="text-[11px] text-emerald-700/80 font-medium ml-1">当前位于安全活动区</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
          <MapPin className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}

function DataInsights({ isFamily, onOpenVisitSummary }: { isFamily: boolean, onOpenVisitSummary: () => void }) {
  const { cognitiveTrainingData } = useAppStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">数据洞察</h3>
        <button 
          onClick={onOpenVisitSummary}
          className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
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
    <div className="space-y-3">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">今日干预</h3>
      </div>

      {isFamily && (
        <button 
          onClick={onOpenCDRDiary}
          className="w-full bg-blue-50 hover:bg-blue-100 transition-colors p-4 rounded-[20px] border border-blue-100/50 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-[14px] font-bold text-blue-900">记录照护日记</h4>
              <p className="text-[11px] text-blue-700/70 mt-0.5 font-medium">记录长辈精神行为症状 (BPSD)</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Plus className="w-4 h-4 text-blue-500" />
          </div>
        </button>
      )}

      {/* DTx Training Card */}
      <DTxCard 
        title="空间记忆连连看"
        description={isFamily ? "通过趣味连线游戏，锻炼长辈短期记忆与空间感知能力，建议每日完成 15 分钟。" : "通过趣味连线游戏，锻炼短期记忆与空间感知能力，建议每日完成 15 分钟。"}
        icon={Brain}
        theme="indigo"
        streak={3}
      />

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

function MedicalServices({ isFamily }: { isFamily: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">医疗服务</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
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
            onClick={() => showComingSoon('心理咨询室筹备中', '专业的心理疏导团队正在入驻，敬请期待。')}
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
