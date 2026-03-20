import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Toast } from 'antd-mobile';
import { motion } from 'motion/react';
import { calculateReport, ScoringResult } from '../../utils/scoring';
import { Activity, AlertTriangle, Brain, ChevronRight, ShieldCheck, FileText, MapPin, Navigation, QrCode, ShoppingBag } from 'lucide-react';
import { DiseaseTag } from '../../configs/constants';
import { AgreementModal } from '../../components/AgreementModal';
import { useAppStore } from '../../store';
import NeuroPassModal from '../../components/NeuroPassModal';
import { RadarChart } from '../../components/Charts/RadarChart';
import { UserIdentity } from '../../interfaces/user';

export default function ReportView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isNeuroPassOpen, setIsNeuroPassOpen] = useState(false);
  const { hasSignedAgreement, signAgreement, setDiseaseTag, identity, setUserStage, completeAssessment } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  useEffect(() => {
    const payload = location.state?.payload || {};
    const diseaseTag = location.state?.diseaseTag || DiseaseTag.NONE;
    // Simulate network delay for scoring
    const timer = setTimeout(() => {
      setResult(calculateReport(payload, diseaseTag, isFamily));
      // Mark assessment as completed in store
      completeAssessment();
    }, 1500);
    return () => clearTimeout(timer);
  }, [location.state, isFamily, completeAssessment]);

  const handleCTAClick = () => {
    if (!result) return;
    const isMild = result.riskScore >= 80;
    
    if (isMild) {
      // 轻症留云端：进入居家管家
      const diseaseTag = location.state?.diseaseTag || DiseaseTag.NONE;
      setDiseaseTag(diseaseTag);
      setUserStage('ACTIVE'); // Upgrade user stage to ACTIVE
      if (hasSignedAgreement) {
        navigate('/manager');
      } else {
        setIsAgreementOpen(true);
      }
    } else {
      // 重症推线下：强制唤起就诊码
      setIsNeuroPassOpen(true);
    }
  };

  const handleSecondaryClick = () => {
    if (!result) return;
    const isMild = result.riskScore >= 80;
    
    if (isMild) {
      // 轻症引导去商城
      Toast.show({
        content: '健康增值服务商城即将上线，敬请期待',
        icon: 'success',
        duration: 2000,
      });
    } else {
      // 重症引导专家解读
      handleExpertConsultation();
    }
  };

  const handleAgree = () => {
    signAgreement();
    setIsAgreementOpen(false);
    setUserStage('ACTIVE'); // Ensure user stage is ACTIVE
    navigate('/manager');
  };

  const handleExpertConsultation = () => {
    Toast.show({
      content: '复核订单已生成，华西专家将在 48 小时内为您出具云端解读报告',
      icon: 'success',
      duration: 3000,
    });
  };

  const handleNavigation = (hospitalName: string) => {
    Toast.show({
      content: `正在为您导航至：${hospitalName}`,
      icon: 'loading',
      duration: 1500,
    });
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <Brain className="w-16 h-16 text-blue-400 animate-bounce mb-6 relative z-10" />
        <h2 className="text-[20px] font-bold text-white mb-2 tracking-wider relative z-10">Neuro-Link AI</h2>
        <p className="text-blue-200/60 text-[14px] tracking-widest relative z-10 font-medium">正在深度解析脑健康图谱...</p>
      </div>
    );
  }

  // 动态风险分级主题
  const themeConfig = {
    low: {
      bg: 'from-emerald-900 via-teal-900 to-slate-900',
      icon: 'text-emerald-400',
      text: 'text-emerald-400',
      radarColor: '#34d399', // emerald-400
      cardBorder: 'border-emerald-50/50',
      btnBg: 'from-emerald-600 to-teal-600',
      btnShadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
    },
    medium: {
      bg: 'from-amber-900 via-orange-900 to-slate-900',
      icon: 'text-amber-400',
      text: 'text-amber-400',
      radarColor: '#fbbf24', // amber-400
      cardBorder: 'border-amber-50/50',
      btnBg: 'from-amber-600 to-orange-600',
      btnShadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.25)]'
    },
    high: {
      bg: 'from-rose-900 via-red-900 to-slate-900',
      icon: 'text-rose-400',
      text: 'text-rose-400',
      radarColor: '#fb7185', // rose-400
      cardBorder: 'border-rose-50/50',
      btnBg: 'from-rose-600 to-red-600',
      btnShadow: 'shadow-[0_8px_20px_rgba(225,29,72,0.25)]'
    }
  };

  const riskLevel = result.riskScore >= 80 ? 'low' : result.riskScore >= 60 ? 'medium' : 'high';
  const theme = themeConfig[riskLevel];

  const radarData = result.dimensions.map(dim => ({
    subject: dim.name,
    A: dim.score,
    fullMark: 100
  }));

  const mockHospitals = [
    {
      id: 1,
      name: '四川大学华西医院 (主院区)',
      distance: '1.2km',
      tags: ['华西医联体', '三甲', '神经内科权威'],
      address: '成都市武侯区国学巷37号'
    },
    {
      id: 2,
      name: '成都市第一人民医院',
      distance: '3.5km',
      tags: ['华西医联体', '三甲'],
      address: '成都市高新区万象北路18号'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative">
      {/* Header Section with Dynamic Gradient */}
      <div className={`relative bg-gradient-to-b ${theme.bg} pt-12 pb-24 px-6 overflow-hidden rounded-b-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-colors duration-1000`}>
        {/* Watermark / Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="text-[120px] font-black tracking-tighter transform -rotate-12 select-none text-white">
            NEURO-PASS
          </div>
        </div>
        
        <NavBar 
          onBack={() => navigate(-1)} 
          className="absolute top-0 left-0 right-0 z-10"
          style={{ '--adm-color-text': 'white' } as any}
          backArrow={<span className="text-white"><ChevronRight className="rotate-180 w-6 h-6" /></span>}
        >
          <span className="text-white/90 font-bold tracking-widest text-[16px]">绝密医疗档案</span>
        </NavBar>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheck className={`w-5 h-5 ${theme.icon}`} />
            <span className={`${theme.text} text-[12px] font-bold tracking-widest uppercase`}>AI 综合评估完成</span>
          </div>
          <h1 className="text-[32px] font-bold text-white mb-2 tracking-tight leading-tight">
            {result.riskLevel}
          </h1>
          <p className="text-white/70 text-[14px] font-medium">
            {result.reportSource}
          </p>
          
          {/* Main Score Display */}
          <div className="mt-8 flex items-end space-x-3">
            <div className="text-[72px] font-bold text-white tracking-tighter leading-none">
              {result.riskScore}
            </div>
            <div className="text-white/60 text-[14px] pb-2 font-semibold tracking-wide">/ 100 综合健康指数</div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-5 -mt-12 relative z-20 space-y-5">
        
        {/* High Risk Symptoms Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white/90 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border ${theme.cardBorder}`}
        >
          <div className="flex items-center space-x-2 mb-5">
            <AlertTriangle className={`w-5 h-5 ${riskLevel === 'low' ? 'text-emerald-500' : riskLevel === 'medium' ? 'text-amber-500' : 'text-rose-500'}`} />
            <h3 className="text-slate-900 font-bold text-[18px] tracking-wide">核心发现</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {result.highRiskSymptoms.map((symptom, idx) => (
              <span 
                key={idx} 
                className={`px-3.5 py-1.5 rounded-[16px] text-[13px] font-semibold tracking-wide ${
                  symptom === '未见明显高危症状' 
                    ? 'bg-emerald-50 text-emerald-600'
                    : riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100/50' : 'bg-rose-50 text-rose-600 border border-rose-100/50'
                }`}
              >
                {symptom}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dimensions Radar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-slate-700" />
            <h3 className="text-slate-900 font-bold text-[18px] tracking-wide">多维能力图谱</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">{isFamily ? '长辈各项核心能力指标分布' : '您的各项核心能力指标分布'}</p>
          
          <div className="relative">
            {/* Watermark inside chart */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
              <Brain className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <RadarChart data={radarData} color={theme.radarColor} />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {result.dimensions.map((dim, idx) => (
              <div key={idx} className="flex justify-between items-center text-[13px] px-2">
                <span className="text-slate-600 font-medium">{dim.name}</span>
                <span className={`font-bold ${
                  dim.status === 'normal' ? 'text-emerald-500' :
                  dim.status === 'warning' ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {dim.score} 分
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* LBS Triage Card (Only for High/Medium Risk) */}
        {(riskLevel === 'high' || riskLevel === 'medium') && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-blue-50/50"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h3 className="text-slate-900 font-bold text-[18px] tracking-wide">就近协作网络 (LBS)</h3>
              </div>
              <span className="text-[12px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold">智能分流</span>
            </div>
            
            <p className="text-[14px] text-slate-500 mb-5 leading-relaxed font-medium">
              {isFamily 
                ? '检测到长辈的健康指标存在异常，建议尽快带长辈前往线下 Neuro-Link 协作医院进行复核。' 
                : '检测到您的健康指标存在异常，建议尽快前往线下 Neuro-Link 协作医院进行复核。'}
            </p>

            <div className="space-y-4">
              {mockHospitals.map(hospital => (
                <div key={hospital.id} className="p-4 rounded-[24px] bg-[#FAFAFA] border border-slate-100/80">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-[16px]">{hospital.name}</h4>
                    <span className="text-[12px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
                      {hospital.distance}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hospital.tags.map(tag => (
                      <span key={tag} className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => handleNavigation(hospital.name)}
                      className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-[20px] text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    >
                      <Navigation className="w-4 h-4" />
                      一键导航
                    </button>
                    <button 
                      onClick={() => setIsNeuroPassOpen(true)}
                      className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-[20px] text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <QrCode className="w-4 h-4" />
                      出示 Neuro-Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 底部悬浮按钮占位 */}
        <div className="h-[calc(env(safe-area-inset-bottom)+140px)] shrink-0 pointer-events-none" />
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent z-30 pointer-events-none">
        <div className="flex flex-col space-y-3 pointer-events-auto">
          <button 
            onClick={handleCTAClick}
            className={`w-full py-4 rounded-[24px] bg-gradient-to-r ${theme.btnBg} text-white font-semibold text-[16px] tracking-wide ${theme.btnShadow} transform transition active:scale-95 flex items-center justify-center space-x-2`}
          >
            {riskLevel === 'low' ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>{isFamily ? '开启长辈居家管家' : '开启居家管家'}</span>
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5" />
                <span>获取 Neuro-Pass 就诊码</span>
              </>
            )}
          </button>
          <button 
            onClick={handleSecondaryClick}
            className="w-full py-4 rounded-[24px] bg-white text-slate-700 font-semibold text-[16px] tracking-wide border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transform transition active:scale-95 flex items-center justify-center space-x-2"
          >
            {riskLevel === 'low' ? (
              <>
                <ShoppingBag className="w-5 h-5 text-slate-400" />
                <span>探索健康增值服务商城</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-slate-400" />
                <span>预约华西神经内科专家解读</span>
              </>
            )}
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>

      <AgreementModal 
        isOpen={isAgreementOpen} 
        onClose={() => setIsAgreementOpen(false)} 
        onAgree={handleAgree} 
      />

      <NeuroPassModal 
        visible={isNeuroPassOpen} 
        onClose={() => setIsNeuroPassOpen(false)} 
      />
    </div>
  );
}
