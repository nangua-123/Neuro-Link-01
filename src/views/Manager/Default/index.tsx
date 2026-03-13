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

          {/* 破冰引导舱 (Ice-breaker Fallback) - AI 管家范式重构 */}
          <div className="relative rounded-[24px] p-5 overflow-hidden shadow-[0_8px_30px_rgba(22,119,255,0.06)] group border border-blue-50/50">
            {/* 极淡的蓝紫弥散渐变背景 (Glassmorphism & Aura) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8faff] via-[#eff6ff] to-[#f5f3ff] opacity-90" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                  {/* 呼吸动效 (Breathing Animation) */}
                  <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-30" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-[0_2px_10px_rgba(37,99,235,0.1)] relative z-10">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 tracking-tight mb-0.5">定制您的专属方案</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    完成 AI 预问诊或专业量表，解锁个性化健康守护。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 大圆角胶囊状 (Capsule) 按钮，柔和微渐变，科技蓝文字，发光阴影 */}
                <button
                  onClick={() => navigate('/')}
                  className="py-3 bg-gradient-to-r from-[#eff6ff] to-[#e0e7ff] text-blue-600 rounded-full font-bold text-[13px] shadow-[0_4px_12px_rgba(37,99,235,0.1)] active:scale-95 transition-transform flex items-center justify-center gap-1.5 border border-white/60"
                >
                  <Brain className="w-4 h-4" />
                  AI 智能问诊
                </button>
                <button
                  onClick={() => navigate('/assessment')}
                  className="py-3 bg-white text-slate-600 rounded-full font-bold text-[13px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-transform flex items-center justify-center gap-1.5 border border-slate-100/80"
                >
                  <FileText className="w-4 h-4" />
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
