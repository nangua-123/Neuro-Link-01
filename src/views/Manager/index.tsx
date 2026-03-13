import React from 'react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import CognitiveManager from './Cognitive';
import EpilepsyManager from './Epilepsy';
import MigraineManager from './Migraine';
import DefaultManager from './Default';

export default function ManagerView() {
  const { selectedDiseaseTag } = useAppStore();

  const renderManager = () => {
    switch (selectedDiseaseTag) {
      case DiseaseTag.AD:
        return <CognitiveManager />;
      case DiseaseTag.EPILEPSY:
        return <EpilepsyManager />;
      case DiseaseTag.MIGRAINE:
        return <MigraineManager />;
      case DiseaseTag.NONE:
      default:
        return <DefaultManager />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 pt-6 px-5 pb-24">
      {renderManager()}
    </div>
  );
}
