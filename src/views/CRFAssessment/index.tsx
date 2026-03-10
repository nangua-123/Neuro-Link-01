import React, { useState } from 'react';
import { NavBar, SafeArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { AssessmentEngine } from '../../components/AssessmentEngine';
import { scale_cognitive_crf_history } from '../../configs/scales';
import { CheckCircle2, ChevronLeft } from 'lucide-react';

export default function CRFAssessmentView() {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = (answers: Record<string, any>) => {
    console.log('【CRF 测评完成】生成的答卷 Payload:', answers);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
        {/* 极浅弥散暖色渐变背景 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
          <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
          <NavBar 
            onBack={() => navigate(-1)} 
            backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
            className="font-medium text-slate-900"
          >
            测评完成
          </NavBar>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6 relative z-10">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
            <div className="absolute inset-0 bg-emerald-400 opacity-20 rounded-full animate-ping" />
            <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
          </div>
          <h2 className="text-[24px] font-bold text-slate-900 mb-3 tracking-tight">信息已提交</h2>
          <p className="text-[15px] text-slate-500 text-center leading-relaxed">
            您的既往史信息已成功录入系统。
          </p>
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
        <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <NavBar 
          onBack={() => navigate(-1)} 
          backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
          className="font-medium text-slate-900"
        >
          既往史信息采集
        </NavBar>
      </div>
      <div className="flex-1 overflow-y-auto pt-6 relative z-10">
        <AssessmentEngine schema={scale_cognitive_crf_history} onSubmit={handleComplete} />
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
