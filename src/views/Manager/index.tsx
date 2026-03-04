// File: src/views/Manager/index.tsx
import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { Brain, Activity, Zap, ArrowLeft, Clock, Bell, FileText } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import MigraineManager from './Migraine';

export default function ManagerView() {
  const { selectedDiseaseTag, hasSignedAgreement } = useAppStore();
  const navigate = useNavigate();

  // 合规拦截：未签署协议直接踢回首页
  if (!hasSignedAgreement) {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (selectedDiseaseTag) {
      case DiseaseTag.AD:
        return <CognitiveManager />;
      case DiseaseTag.EPILEPSY:
        return <EpilepsyManager />;
      case DiseaseTag.MIGRAINE:
        return <MigraineManager />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p>请先选择专病方向</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-4 sticky top-0 z-10 border-b border-slate-100/50">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium text-slate-800">居家专病管家</h1>
          <div className="w-10 h-10" /> {/* Placeholder for balance */}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}

const CognitiveManager = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">认知护航管家</h2>
      </div>
      <p className="text-blue-50 text-sm leading-relaxed relative z-10 opacity-90">
        您的 24 小时专属认知健康守护者。我们将为您提供个性化的干预训练与日常照护指导。
      </p>
    </div>

    <PlaceholderCards />
  </motion.div>
);

const EpilepsyManager = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">癫痫护航管家</h2>
      </div>
      <p className="text-emerald-50 text-sm leading-relaxed relative z-10 opacity-90">
        发作记录、用药提醒与紧急预警。我们与您共同管理每一次健康波动。
      </p>
    </div>

    <PlaceholderCards />
  </motion.div>
);

const PlaceholderCards = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { icon: Clock, title: '日常打卡', desc: '建设中...' },
      { icon: FileText, title: '健康档案', desc: '建设中...' },
      { icon: Bell, title: '用药提醒', desc: '建设中...' },
      { icon: Activity, title: '指标监测', desc: '建设中...' },
    ].map((item, idx) => (
      <div key={idx} className="bg-white p-6 rounded-[28px] shadow-sm shadow-slate-100 border border-slate-100/50 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <item.icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-700">{item.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);
