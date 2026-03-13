import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, ChevronRight, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DailyHealthBase } from '../../../components/DailyHealthBase';
import { DTxCard } from '../../../components/DTxCard';
import { MedicalToolbox } from '../../../components/MedicalToolbox';
import { ManagerSkeleton } from '../../../components/ManagerSkeleton';

export default function DefaultManager() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      <motion.div variants={itemVariants}>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
              专属健康管家
            </h2>
          </div>

          {/* 破冰引导舱 (Ice-breaker Fallback) */}
          <div className="bg-blue-50/80 border border-blue-100/50 rounded-[16px] p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-blue-900 tracking-tight mb-0.5">定制您的专属方案</h3>
                  <p className="text-[11px] text-blue-700/80 font-medium leading-relaxed">
                    完成 AI 预问诊或专业量表，解锁个性化健康守护。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="py-2.5 bg-blue-600 text-white rounded-[12px] font-semibold text-[12px] shadow-[0_2px_8px_rgba(37,99,235,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                >
                  <Brain className="w-3.5 h-3.5" />
                  AI 智能问诊
                </button>
                <button
                  onClick={() => navigate('/assessment')}
                  className="py-2.5 bg-white text-blue-600 border border-blue-100 rounded-[12px] font-semibold text-[12px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  专业量表测评
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DailyHealthBase />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="space-y-3">
          <div className="px-1">
            <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">今日干预</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              完成今日的脑力挑战，保持大脑活力
            </p>
          </div>
          <DTxCard 
            title="空间记忆连连看"
            description="通过趣味连线游戏，锻炼短期记忆与空间感知能力，建议每日完成 15 分钟。"
            icon={Brain}
            theme="indigo"
            streak={0}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MedicalToolbox />
      </motion.div>
    </motion.div>
  );
}
