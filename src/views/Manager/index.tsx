import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { Brain, Activity, Zap, ArrowLeft, Clock, Bell, FileText, Gamepad2, Smartphone, BookOpen, Footprints, ChevronRight, Pill, Calendar, Moon, ShieldCheck } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import SeizureDiarySheet from './Epilepsy/SeizureDiarySheet';
import MedicationPunchSheet from './Epilepsy/MedicationPunchSheet';

export default function ManagerView() {
  const { selectedDiseaseTag, hasSignedAgreement } = useAppStore();
  const navigate = useNavigate();

  const [showSeizureDiary, setShowSeizureDiary] = useState(false);
  const [showMedicationPunch, setShowMedicationPunch] = useState(false);

  // 合规拦截：未签署协议直接踢回首页
  if (!hasSignedAgreement) {
    return <Navigate to="/" replace />;
  }

  // ==========================================
  // 区块 B：专病智能核心舱 (Dynamic Top Section)
  // ==========================================
  const renderCoreCabin = () => {
    switch (selectedDiseaseTag) {
      case DiseaseTag.EPILEPSY:
        return (
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowSeizureDiary(true)}
              className="bg-white rounded-[28px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden cursor-pointer group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-indigo-100/80" />
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 relative z-10">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-[15px] text-slate-800 tracking-tight mb-0.5 relative z-10">发作日记</h3>
              <p className="text-slate-400 text-[11px] relative z-10">记录异常放电</p>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowMedicationPunch(true)}
              className="bg-white rounded-[28px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden cursor-pointer group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-blue-100/80" />
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 relative z-10">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[15px] text-slate-800 tracking-tight mb-0.5 relative z-10">用药打卡</h3>
              <p className="text-slate-400 text-[11px] relative z-10">今日待服 2 项</p>
            </motion.div>
          </div>
        );
      case DiseaseTag.MIGRAINE:
        return (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden flex items-center justify-between group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-rose-100/80" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-rose-500" />
                </div>
                <span className="text-rose-500 text-[10px] font-semibold tracking-wider uppercase">核心任务</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-800 tracking-tight mb-0.5">头痛发作记录</h3>
              <p className="text-slate-400 text-[11px]">追踪频率与诱因，防范 MOH</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:bg-rose-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
            </div>
          </motion.div>
        );
      case DiseaseTag.AD:
        return (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden flex items-center justify-between group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-emerald-100/80" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-emerald-500 text-[10px] font-semibold tracking-wider uppercase">今日训练</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-800 tracking-tight mb-0.5">认知康复计划</h3>
              <p className="text-slate-400 text-[11px]">完成度 0/3 · 保持大脑活力</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:bg-emerald-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="bg-white rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden flex items-center justify-between group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-colors group-hover:bg-blue-100/80" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                </div>
                <span className="text-blue-500 text-[10px] font-semibold tracking-wider uppercase">健康基线</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-800 tracking-tight mb-0.5">开启深度测评</h3>
              <p className="text-slate-400 text-[11px]">获取您的专属脑健康管理方案</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:bg-blue-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans selection:bg-blue-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-2xl px-5 pt-12 pb-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 active:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-semibold text-slate-800 tracking-wide">居家管家</h1>
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-7">
        
        {/* 区块 B：专病智能核心舱 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">专属核心舱</h2>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">AI 动态组装</span>
          </div>
          {renderCoreCabin()}
        </section>

        {/* 区块 A：普适性脑健康基座 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">日常健康基座</h2>
            <span className="text-[10px] font-medium text-slate-400">全量开放</span>
          </div>
          
          <div className="space-y-3">
            {/* DTx Game */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-[28px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-[14px] mb-0.5">空间记忆连连看</h3>
                <p className="text-slate-400 text-[11px]">数字疗法 (DTx) · 每日 5 分钟</p>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-full">
                开始
              </div>
            </motion.div>

            {/* Daily Activity Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-lg font-bold text-slate-800 mb-0.5 tracking-tight">4<span className="text-[10px] font-medium text-slate-400 ml-0.5">h</span> 12<span className="text-[10px] font-medium text-slate-400 ml-0.5">m</span></div>
                <div className="text-[10px] text-slate-400 font-medium">今日屏幕使用</div>
              </div>
              <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-2">
                  <Footprints className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-lg font-bold text-slate-800 mb-0.5 tracking-tight">6,230</div>
                <div className="text-[10px] text-slate-400 font-medium">今日步数</div>
              </div>
            </div>
          </div>
        </section>

        {/* 区块 C：全量医疗工具箱 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">医疗工具箱</h2>
            <span className="text-[10px] font-medium text-slate-400">全部工具</span>
          </div>
          
          <div className="bg-white rounded-[32px] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
            {[
              { icon: Zap, label: '癫痫发作日记', desc: '记录发作类型与持续时间', color: 'text-indigo-500', bg: 'bg-indigo-50', onClick: () => setShowSeizureDiary(true) },
              { icon: Activity, label: '偏头痛追踪器', desc: '记录头痛程度与诱因', color: 'text-rose-500', bg: 'bg-rose-50' },
              { icon: Brain, label: '认知能力量表', desc: 'MMSE / MoCA 定期自测', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: Pill, label: '用药依从性管理', desc: '设置提醒与漏服记录', color: 'text-blue-500', bg: 'bg-blue-50', onClick: () => setShowMedicationPunch(true) },
              { icon: Moon, label: '睡眠质量日志', desc: '记录入睡困难与早醒', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((tool, idx) => (
              <motion.div 
                key={idx}
                whileTap={{ scale: 0.98, backgroundColor: '#f8fafc' }}
                onClick={tool?.onClick}
                className="flex items-center p-3 rounded-[24px] cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-2xl ${tool.bg} flex items-center justify-center flex-shrink-0 mr-3 transition-colors`}>
                  <tool.icon className={`w-5 h-5 ${tool.color}`} />
                </div>
                <div className="flex-1 border-b border-slate-50/50 pb-3 pt-1 group-last:border-0">
                  <h3 className="font-semibold text-slate-800 text-[14px] mb-0.5">{tool.label}</h3>
                  <p className="text-slate-400 text-[11px]">{tool.desc}</p>
                </div>
                <div className="pl-2 border-b border-slate-50/50 pb-3 pt-1 group-last:border-0">
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      <SeizureDiarySheet visible={showSeizureDiary} onClose={() => setShowSeizureDiary(false)} />
      <MedicationPunchSheet visible={showMedicationPunch} onClose={() => setShowMedicationPunch(false)} />
    </div>
  );
}
