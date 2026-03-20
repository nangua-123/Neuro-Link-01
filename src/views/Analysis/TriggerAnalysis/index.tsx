import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Button } from 'antd-mobile';
import { ChevronLeft, Brain, Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../../../store';
import { Paywall } from '../../../components/Paywall';

const data = [
  { subject: '睡眠不足', A: 85, fullMark: 100 },
  { subject: '气压突变', A: 62, fullMark: 100 },
  { subject: '咖啡因戒断', A: 45, fullMark: 100 },
  { subject: '强光刺激', A: 30, fullMark: 100 },
  { subject: '情绪压力', A: 75, fullMark: 100 },
  { subject: '经期波动', A: 50, fullMark: 100 },
];

export default function TriggerAnalysisView() {
  const navigate = useNavigate();
  const { isPremium } = useAppStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleExport = () => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50 to-transparent opacity-80 pointer-events-none" />
      
      <NavBar 
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        className="bg-transparent relative z-10"
      >
        <span className="font-medium text-slate-900">诱因图谱分析</span>
      </NavBar>

      <div className="flex-1 p-5 flex flex-col relative z-10 space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 bg-blue-200" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-[20px] bg-blue-50 flex items-center justify-center shadow-inner">
              <Brain className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">诱因图谱分析</h1>
              <p className="text-[12px] text-slate-500 mt-1 font-medium">AI 结合 IoT 睡眠数据与日记，深度分析发作诱因</p>
            </div>
          </div>
        </motion.div>

        {/* Content Section with Blur for Non-Premium */}
        <div className="relative">
          {!isPremium && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-[28px]">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-2">解锁高级诱因分析</h3>
                <p className="text-[13px] text-slate-500 mb-6">
                  获取基于华西专病知识库的深度分析报告与个性化干预方案。
                </p>
                <Button
                  onClick={() => setShowPaywall(true)}
                  className="h-12 px-8 rounded-full text-[15px] font-bold text-white border-none shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  立即解锁
                </Button>
              </div>
            </div>
          )}

          <div className={`space-y-6 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
            {/* Radar Chart Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-[16px] font-bold text-slate-800">核心诱发因素相关性</h2>
              </div>
              
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="相关度" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[12px] font-bold border border-rose-100 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  极高风险: 睡眠不足 (85%)
                </div>
                <div className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[12px] font-bold border border-amber-100 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  高风险: 情绪压力 (75%)
                </div>
              </div>
            </motion.div>

            {/* AI Suggestions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-emerald-500" />
                <h2 className="text-[16px] font-bold text-slate-800">AI 规避建议</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-800">优化睡眠节律</h3>
                    <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                      您的偏头痛发作与“深度睡眠不足”高度相关。建议每晚 23:00 前入睡，睡前可尝试使用“暗室舒缓音频”辅助入眠。
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-800">压力管理干预</h3>
                    <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                      在工作日高压期（周二至周四），发作频率显著上升。建议在午间进行 15 分钟的正念冥想放松。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Data Privacy Notice */}
        <div className="flex items-start gap-2 px-2 mt-4 mb-8">
          <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            该功能产生的数据将经过金融级加密，仅用于您的个人健康分析与华西专病团队的医疗参考。
          </p>
        </div>

        <div className="mt-auto pb-8">
          <Button
            block
            loading={isSimulating}
            onClick={handleExport}
            className="h-14 rounded-full text-[16px] font-bold text-white border-none shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-500 to-blue-600"
          >
            {isSimulating ? '生成中...' : (isPremium ? '导出详细图谱报告' : '解锁高级功能')}
          </Button>
        </div>
      </div>
      <SafeArea position="bottom" />

      {showPaywall && (
        <Paywall 
          onClose={() => setShowPaywall(false)} 
          onUnlock={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
}
