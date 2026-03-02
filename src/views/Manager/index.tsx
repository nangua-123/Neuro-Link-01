// File: src/views/Manager/index.tsx
import React from 'react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import EpilepsyManager from './Epilepsy';
import MigraineManager from './Migraine';

export default function ManagerView() {
  const { selectedDiseaseTag } = useAppStore();

  // 根据专病标签动态渲染管家面板
  if (selectedDiseaseTag === DiseaseTag.EPILEPSY) {
    return <EpilepsyManager />;
  }
  
  if (selectedDiseaseTag === DiseaseTag.MIGRAINE) {
    return <MigraineManager />;
  }

  // 默认或其他疾病的占位
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">居家管家 (Manager)</h1>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-gray-500 text-sm">当前专病标签：{selectedDiseaseTag}</p>
        <p className="text-gray-500 text-sm mt-2">（请在测评页将疾病标签设为 EPILEPSY 或 MIGRAINE 以查看对应管家）</p>
      </div>
    </div>
  );
}
