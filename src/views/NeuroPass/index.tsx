import React, { useEffect, useState } from 'react';
import { NavBar, Card, Button, Tag, Skeleton, SafeArea } from 'antd-mobile';
import { CheckCircleFill, ExclamationCircleFill, EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { triageEngine } from '../../services/triageEngine';
import { TriageResult, RiskLevel } from '../../interfaces/triage';
import { ChevronLeft, Check, AlertCircle, MapPin } from 'lucide-react';

export default function NeuroPassView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TriageResult | null>(null);

  useEffect(() => {
    // 模拟从上一个页面传递过来的 answers，这里使用空对象触发 Mock 逻辑
    const mockAnswers = { 'q_memory': 2 }; // 强制触发红灯测试
    
    triageEngine.generateTriageReport(mockAnswers, selectedDiseaseTag)
      .then(res => {
        setResult(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Triage failed:', err);
        setLoading(false);
      });
  }, [selectedDiseaseTag]);

  if (loading || !result) {
    return (
      <div className="h-full bg-[#FAFAFA] p-6 overflow-y-auto hide-scrollbar">
        <Skeleton.Title animated className="mt-4 mb-8 h-8 w-1/2 rounded-full" />
        <div className="space-y-4">
          <Skeleton.Paragraph lineCount={5} animated className="rounded-xl" />
        </div>
      </div>
    );
  }

  // 绿灯：会员转化卡片
  if (result.riskLevel === RiskLevel.GREEN) {
    return (
      <div className="h-full bg-[#FAFAFA] flex flex-col relative overflow-hidden">
        {/* 极浅弥散暖色渐变背景 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
          <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <NavBar 
            onBack={() => navigate(-1)}
            backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
          >
            <span className="font-medium text-slate-900">测评结果</span>
          </NavBar>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center pt-16 relative z-10 overflow-y-auto hide-scrollbar">
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6 shadow-[0_8px_30px_rgba(16,185,129,0.12)] border border-emerald-100/50">
            <Check className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
          </div>
          <h2 className="text-[24px] font-bold mt-2 mb-3 text-slate-900 tracking-tight text-center">{result.suggestionTitle}</h2>
          <p className="text-slate-500 text-center text-[15px] leading-relaxed px-4 mb-12 font-medium">
            {result.suggestionDetail}
          </p>
          
          <div className="w-full bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex justify-between items-center relative z-10 mb-8">
              <div>
                <div className="font-semibold text-slate-900 text-[18px] mb-1">Neuro-Link 基础会员</div>
                <div className="text-[13px] text-slate-500 font-medium">解锁日常脑力训练与健康档案</div>
              </div>
              <div className="text-[24px] font-bold text-blue-600 tracking-tight">
                ¥9.9<span className="text-[13px] font-medium text-slate-400 ml-0.5">/月</span>
              </div>
            </div>
            
            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-[24px] font-medium text-[16px] shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-95 transition-transform relative z-10">
              立即开通
            </button>
          </div>
        </div>
        <SafeArea position="bottom" />
      </div>
    );
  }

  // 红/黄灯：Neuro-Pass 电子凭证 (登机牌风格)
  const isRed = result.riskLevel === RiskLevel.RED;
  const themeColorClass = isRed ? 'text-rose-500' : 'text-amber-500';
  const themeBgClass = isRed ? 'bg-rose-500' : 'bg-amber-500';
  const themeBorderClass = isRed ? 'border-rose-100' : 'border-amber-100';
  const themeLightBgClass = isRed ? 'bg-rose-50' : 'bg-amber-50';

  return (
    <div className="h-full bg-[#141414] flex flex-col relative overflow-hidden">
      {/* Dark mode background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-[10%] -right-[10%] w-[80%] h-[50%] ${isRed ? 'bg-rose-900/20' : 'bg-amber-900/20'} blur-3xl`} />
        <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] bg-blue-900/10 blur-3xl" />
      </div>

      <div className="bg-[#141414]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/5">
        <NavBar 
          onBack={() => navigate(-1)} 
          backArrow={<ChevronLeft className="w-6 h-6 text-white/80" />}
        >
          <span className="font-medium text-white tracking-wide">Neuro-Pass 专属绿通</span>
        </NavBar>
      </div>
      
      <div className="flex-1 p-5 pt-8 relative z-10 overflow-y-auto hide-scrollbar">
        {/* 登机牌主体 */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
          
          {/* 顶部状态条 */}
          <div className={`h-2.5 w-full ${themeBgClass}`} />

          {/* 警告头部 */}
          <div className="p-8 border-b-2 border-dashed border-slate-200 relative">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-[20px] ${themeLightBgClass} ${themeBorderClass} border`}>
                <AlertCircle className={`w-8 h-8 ${themeColorClass}`} strokeWidth={2} />
              </div>
              <div className="pt-1">
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-1.5 leading-tight">
                  {result.suggestionTitle}
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                  {result.suggestionDetail}
                </p>
              </div>
            </div>
            
            {/* 登机牌半圆缺口 */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#141414] rounded-full shadow-inner" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#141414] rounded-full shadow-inner" />
          </div>

          {/* 凭证核心信息区 */}
          <div className="p-8 bg-slate-50/50">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Pass Code</div>
                <div className="font-mono text-[28px] font-bold text-slate-900 tracking-tighter">
                  {result.neuroPassCode}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Valid For</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-mono text-[13px] font-semibold tracking-wide border border-blue-100">
                  {result.diseaseTag}
                </div>
              </div>
            </div>

            {/* 匹配的医疗机构 */}
            {result.recommendedClinic && (
              <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">Assigned Clinic</div>
                <div className="font-semibold text-slate-900 text-[16px] mb-2 tracking-tight">
                  {result.recommendedClinic.name}
                </div>
                <div className="flex items-center text-[13px] text-slate-500 mb-5 font-medium">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                  距您 {result.recommendedClinic.distanceKm} km · {result.recommendedClinic.address}
                </div>
                
                {/* 设备强校验 Tag */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100/80">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest w-full mb-2">Required Equipment Verified</div>
                  {result.recommendedClinic.equipmentList.map(eq => {
                    const isRequired = eq === result.requiredEquipment;
                    return (
                      <div 
                        key={eq} 
                        className={`px-3 py-1.5 rounded-[12px] font-mono text-[11px] font-semibold tracking-wide border ${
                          isRequired 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {eq}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 底部操作区 */}
          <div className="p-8 bg-white">
            <button 
              className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-medium text-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95 transition-transform tracking-wide"
            >
              一键预约该机构
            </button>
            <div className="text-center text-[12px] text-slate-400 mt-5 font-medium tracking-wide">
              凭此码在合作机构可享受免排队绿通服务
            </div>
          </div>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
