// File: src/views/Manager/index.tsx
import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { Brain, Activity, Zap, ArrowLeft, Clock, Bell, FileText } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import MigraineManager from './Migraine';
import CognitiveManager from './Cognitive';
import EpilepsyManager from './Epilepsy';

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
