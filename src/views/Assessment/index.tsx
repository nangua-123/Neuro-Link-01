// File: src/views/Assessment/index.tsx
import React, { useState } from 'react';
import { NavBar, Result, SafeArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { ILAE_SCHEMA } from '../../configs/scales/ilae';
import { MOCA_AVLT_SCHEMA } from '../../configs/scales/moca_avlt';
import DynamicScale from '../../components/DynamicScale';

export default function AssessmentView() {
  const navigate = useNavigate();
  // 1. 从 Zustand 获取当前的 DiseaseTag
  const { selectedDiseaseTag } = useAppStore();
  const [isCompleted, setIsCompleted] = useState(false);

  // 2. 动态加载对应 Schema
  const currentSchema = selectedDiseaseTag === DiseaseTag.EPILEPSY 
    ? ILAE_SCHEMA 
    : MOCA_AVLT_SCHEMA;

  const handleComplete = (answers: Record<string, any>) => {
    // 3. 测评完成后，将生成的 answers Payload 打印到控制台
    console.log('【测评完成】生成的答卷 Payload:', answers);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-gray-100">
          测评完成
        </NavBar>
        <div className="flex-1 flex flex-col justify-center pb-20">
          <Result
            status="success"
            title="测评已完成"
            description="正在为您生成华西 AI 脑健康风险分层报告..."
          />
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-gray-100">
        深度医学测评
      </NavBar>
      <div className="flex-1 overflow-y-auto">
        <DynamicScale schema={currentSchema} onComplete={handleComplete} />
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
