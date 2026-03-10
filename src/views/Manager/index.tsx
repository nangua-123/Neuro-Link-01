import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import CognitiveManager from './Cognitive';
import EpilepsyManager from './Epilepsy';
import MigraineManager from './Migraine';

export default function ManagerView() {
  const { selectedDiseaseTag, hasSignedAgreement } = useAppStore();

  // 合规拦截：未签署协议直接踢回首页
  if (!hasSignedAgreement) {
    return <Navigate to="/" replace />;
  }

  // 根据选择的疾病标签动态渲染对应的管家视图
  switch (selectedDiseaseTag) {
    case DiseaseTag.AD:
      return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-6 px-5">
          <CognitiveManager />
        </div>
      );
    case DiseaseTag.EPILEPSY:
      return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-6 px-5">
          <EpilepsyManager />
        </div>
      );
    case DiseaseTag.MIGRAINE:
      return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-6 px-5">
          <MigraineManager />
        </div>
      );
    default:
      // 默认回退到认知管家（或可以重定向到首页）
      return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-6 px-5">
          <CognitiveManager />
        </div>
      );
  }
}
