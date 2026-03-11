import React from 'react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import CognitiveManager from './Cognitive';
import EpilepsyManager from './Epilepsy';
import MigraineManager from './Migraine';
import DefaultManager from './Default';

export default function ManagerView() {
  const { selectedDiseaseTag, hasSignedAgreement } = useAppStore();

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
    case DiseaseTag.NONE:
    default:
      return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-6 px-5">
          <DefaultManager />
        </div>
      );
  }
}
