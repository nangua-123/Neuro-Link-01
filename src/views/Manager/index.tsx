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
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowSeizureDiary(true)}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[28px] p-5 text-white shadow-[0_8px_24px_rgba(79,70,229,0.25)] relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <Zap className="w-8 h-8 mb-3 text-indigo-100" />
              <h3 className="font-semibold text-lg tracking-wide mb-1">发作日记</h3>
              <p className="text-indigo-100 text-xs opacity-80">记录异常放电</p>
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowMedicationPunch(true)}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-[28px] p-5 text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <Pill className="w-8 h-8 mb-3 text-blue-100" />
              <h3 className="font-semibold text-lg tracking-wide mb-1">用药打卡</h3>
              <p className="text-blue-100 text-xs opacity-80">今日待服 2 项</p>
            </motion.div>
          </div>
        );
      case DiseaseTag.MIGRAINE:
        return (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgba(244,63,94,0.25)] relative overflow-hidden flex items-center justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-6 h-6 text-rose-100" />
                <span className="text-rose-100 text-sm font-medium tracking-wider uppercase">核心任务</span>
              </div>
              <h3 className="font-semibold text-2xl tracking-tight mb-1">头痛发作记录</h3>
              <p className="text-rose-100 text-sm opacity-90">追踪频率与诱因，防范 MOH</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        );
      case DiseaseTag.AD:
        return (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgba(16,185,129,0.25)] relative overflow-hidden flex items-center justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-6 h-6 text-emerald-100" />
                <span className="text-emerald-100 text-sm font-medium tracking-wider uppercase">今日训练</span>
              </div>
              <h3 className="font-semibold text-2xl tracking-tight mb-1">认知康复计划</h3>
              <p className="text-emerald-100 text-sm opacity-90">完成度 0/3 · 保持大脑活力</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] p-6 text-white shadow-[0_8px_30px_rgba(15,23,42,0.25)] relative overflow-hidden flex items-center justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheck className="w-6 h-6 text-slate-300" />
                <span className="text-slate-300 text-sm font-medium tracking-wider uppercase">健康基线</span>
              </div>
              <h3 className="font-semibold text-2xl tracking-tight mb-1">开启深度测评</h3>
              <p className="text-slate-300 text-sm opacity-90">获取您的专属脑健康管理方案</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl px-6 pt-12 pb-4 sticky top-0 z-30 border-b border-slate-100/50">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 active:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800 tracking-wide">居家管家</h1>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 区块 B：专病智能核心舱 */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">专属核心舱</h2>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">AI 动态组装</span>
          </div>
          {renderCoreCabin()}
        </section>

        {/* 区块 A：普适性脑健康基座 */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">日常健康基座</h2>
            <span className="text-xs font-medium text-slate-500">全量开放</span>
          </div>
          
          <div className="space-y-4">
            {/* DTx Game */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center space-x-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-7 h-7 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-base mb-0.5">空间记忆连连看</h3>
                <p className="text-slate-500 text-xs">数字疗法 (DTx) · 每日 5 分钟</p>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-full active:scale-95 transition-transform">
                开始
              </button>
            </motion.div>

            {/* Daily Activity Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                <Smartphone className="w-6 h-6 text-blue-500 mb-3" />
                <div className="text-2xl font-bold text-slate-800 mb-1">4<span className="text-sm font-medium text-slate-500 ml-1">h</span> 12<span className="text-sm font-medium text-slate-500 ml-1">m</span></div>
                <div className="text-xs text-slate-500 font-medium">今日屏幕使用</div>
              </div>
              <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                <Footprints className="w-6 h-6 text-emerald-500 mb-3" />
                <div className="text-2xl font-bold text-slate-800 mb-1">6,230</div>
                <div className="text-xs text-slate-500 font-medium">今日步数</div>
              </div>
            </div>
          </div>
        </section>

        {/* 区块 C：全量医疗工具箱 */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">医疗工具箱</h2>
            <span className="text-xs font-medium text-slate-500">全部工具</span>
          </div>
          
          <div className="bg-white rounded-[32px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
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
                onClick={tool.onClick}
                className="flex items-center p-4 rounded-[24px] cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center flex-shrink-0 mr-4`}>
                  <tool.icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                <div className="flex-1 border-b border-slate-50 pb-4 pt-2">
                  <h3 className="font-semibold text-slate-800 text-[15px] mb-0.5">{tool.label}</h3>
                  <p className="text-slate-400 text-xs">{tool.desc}</p>
                </div>
                <div className="pl-2 border-b border-slate-50 pb-4 pt-2">
                  <ChevronRight className="w-5 h-5 text-slate-300" />
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
