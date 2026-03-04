import React, { useState } from 'react';
import { NavBar, Result, SafeArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { AssessmentEngine } from '../../components/AssessmentEngine';
import { scale_cognitive_crf_history } from '../../configs/scales';

export default function CRFAssessmentView() {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = (answers: Record<string, any>) => {
    console.log('【CRF 测评完成】生成的答卷 Payload:', answers);
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
            title="信息已提交"
            description="您的既往史信息已成功录入系统。"
          />
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar onBack={() => navigate(-1)} className="bg-white border-b border-gray-100">
        既往史信息采集
      </NavBar>
      <div className="flex-1 overflow-y-auto pt-6">
        <AssessmentEngine schema={scale_cognitive_crf_history} onSubmit={handleComplete} />
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
