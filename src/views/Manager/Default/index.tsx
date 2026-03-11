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
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
              专病智能核心舱
            </h2>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">Zone B</span>
          </div>

          {/* 破冰引导舱 (Ice-breaker Fallback) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
            
            <div className="relative z-10 text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-white/20 rounded-[16px] backdrop-blur-md border border-white/20 shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold tracking-tight">开启深度测评</h3>
                  <p className="text-[12px] text-blue-100 mt-0.5 font-medium">获取您的专属疾病管家</p>
                </div>
              </div>

              <p className="text-[13px] text-blue-50/90 leading-relaxed font-medium mb-6">
                您目前尚未绑定任何专病标签。通过华西标准的 AI 预问诊或深度量表测评，我们将为您生成个性化的健康管理方案。
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 bg-white text-blue-600 rounded-[16px] font-semibold text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  进入 AI 预问诊
                </button>
                <button
                  onClick={() => navigate('/assessment')}
                  className="w-full py-3.5 bg-blue-500/20 text-white border border-blue-400/30 rounded-[16px] font-medium text-[14px] active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  直接选择量表
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
