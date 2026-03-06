import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Toast } from 'antd-mobile';
import { motion } from 'motion/react';
import { calculateReport, ScoringResult } from '../../utils/scoring';
import { Activity, AlertTriangle, Brain, ChevronRight, ShieldCheck, FileText, MapPin, Navigation, QrCode } from 'lucide-react';
import { DiseaseTag } from '../../configs/constants';
import { AgreementModal } from '../../components/AgreementModal';
import { useAppStore } from '../../store';
import NeuroPassModal from '../../components/NeuroPassModal';

export default function ReportView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isNeuroPassOpen, setIsNeuroPassOpen] = useState(false);
  const { hasSignedAgreement, signAgreement, setDiseaseTag } = useAppStore();

  useEffect(() => {
    const payload = location.state?.payload || {};
    const diseaseTag = location.state?.diseaseTag || DiseaseTag.NONE;
    // Simulate network delay for scoring
    const timer = setTimeout(() => {
      setResult(calculateReport(payload, diseaseTag));
    }, 1500);
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleCTAClick = () => {
    const diseaseTag = location.state?.diseaseTag || DiseaseTag.NONE;
    setDiseaseTag(diseaseTag);
    if (hasSignedAgreement) {
      navigate('/manager');
    } else {
      setIsAgreementOpen(true);
    }
  };

  const handleAgree = () => {
    signAgreement();
    setIsAgreementOpen(false);
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
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <Brain className="w-16 h-16 text-blue-400 animate-bounce mb-6 relative z-10" />
        <h2 className="text-xl font-medium text-white mb-2 tracking-wider relative z-10">Neuro-Link AI</h2>
        <p className="text-blue-200/60 text-sm tracking-widest relative z-10">正在深度解析脑健康图谱...</p>
      </div>
    );
  }

  const isHighRisk = result.riskScore < 80;

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative pb-40">
      {/* Header Section with Deep Tech Blue Gradient */}
      <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] pt-12 pb-24 px-6 overflow-hidden rounded-b-[40px] shadow-xl">
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
          <span className="text-white/90 font-medium tracking-widest text-sm">绝密医疗档案</span>
        </NavBar>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">AI 综合评估完成</span>
          </div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight leading-tight">
            {result.riskLevel}
          </h1>
          <p className="text-blue-200/70 text-sm font-light">
            {result.reportSource}
          </p>
          
          {/* Main Score Display */}
          <div className="mt-8 flex items-end space-x-3">
            <div className="text-7xl font-light text-white tracking-tighter leading-none">
              {result.riskScore}
            </div>
            <div className="text-blue-200/60 text-sm pb-2 font-medium tracking-wide">/ 100 综合健康指数</div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-6 -mt-12 relative z-20 space-y-6">
        
        {/* High Risk Symptoms Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-50/50"
        >
          <div className="flex items-center space-x-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-gray-900 font-semibold tracking-wide">高危症状预警</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {result.highRiskSymptoms.map((symptom, idx) => (
              <span 
                key={idx} 
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                  symptom === '未见明显高危症状' 
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600 border border-red-100/50'
                }`}
              >
                {symptom}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dimensions Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-900 font-semibold tracking-wide">多维能力图谱</h3>
          </div>
          
          <div className="space-y-6">
            {result.dimensions.map((dim, idx) => (
              <div key={idx} className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">{dim.name}</span>
                  <span className={`font-semibold ${
                    dim.status === 'normal' ? 'text-emerald-500' :
                    dim.status === 'warning' ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    {dim.score} 分
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 1, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      dim.status === 'normal' ? 'bg-emerald-400' :
                      dim.status === 'warning' ? 'bg-orange-400' : 'bg-red-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* LBS Triage Card (Only for High Risk) */}
        {isHighRisk && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50/50"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h3 className="text-gray-900 font-semibold tracking-wide">就近协作网络 (LBS)</h3>
              </div>
              <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full font-medium">智能分流</span>
            </div>
            
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              检测到您的健康指标存在异常，建议尽快前往线下 Neuro-Link 协作医院进行复核。
            </p>

            <div className="space-y-4">
              {mockHospitals.map(hospital => (
                <div key={hospital.id} className="p-4 rounded-2xl bg-[#FAFAFA] border border-slate-100/80">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800 text-[15px]">{hospital.name}</h4>
                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
                      {hospital.distance}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hospital.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => handleNavigation(hospital.name)}
                      className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      一键导航
                    </button>
                    <button 
                      onClick={() => setIsNeuroPassOpen(true)}
                      className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      出示 Neuro-Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent z-30 pointer-events-none">
        <div className="flex flex-col space-y-3 max-w-md mx-auto pointer-events-auto">
          <button 
            onClick={handleCTAClick}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-[15px] tracking-wide shadow-[0_8px_20px_rgba(79,70,229,0.25)] transform transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{result.ctaText}</span>
          </button>
          <button 
            onClick={handleExpertConsultation}
            className="w-full py-4 rounded-full bg-white text-gray-700 font-medium text-[15px] tracking-wide border border-gray-200 shadow-sm transform transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5 text-gray-400" />
            <span>预约华西神经内科专家解读</span>
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
