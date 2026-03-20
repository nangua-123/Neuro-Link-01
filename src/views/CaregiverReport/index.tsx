import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Button } from 'antd-mobile';
import { ChevronLeft, FileText, Activity, HeartPulse, Brain, AlertTriangle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { TrendBarChart } from '../../components/Charts/TrendBarChart';
import { WaveChart } from '../../components/common/charts/WaveChart';

const mockActivityData = [
  { date: '周一', value: 65 },
  { date: '周二', value: 70 },
  { date: '周三', value: 60 },
  { date: '周四', value: 80 },
  { date: '周五', value: 75 },
  { date: '周六', value: 85 },
  { date: '周日', value: 90 },
];

const mockVitalsData = Array.from({ length: 7 }, (_, i) => ({ value: 60 + Math.random() * 30 }));

export default function CaregiverReportView() {
  const navigate = useNavigate();
  const { currentPatientId, boundPatients } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const currentPatient = boundPatients.find(p => p.id === currentPatientId);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
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
        <span className="font-medium text-slate-900">家属周报</span>
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
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
                {currentPatient ? `${currentPatient.name}的本周照护报告` : '本周照护报告'}
              </h1>
              <p className="text-[12px] text-slate-500 mt-1 font-medium">2026年3月9日 - 3月15日</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-[12px] text-slate-500">综合健康指数</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-[24px] font-bold text-slate-800 leading-none">88</span>
              <span className="text-[12px] text-emerald-500 leading-none mb-1 font-medium">良好</span>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[12px] text-slate-500">异常预警次数</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-[24px] font-bold text-slate-800 leading-none">1</span>
              <span className="text-[12px] text-slate-400 leading-none mb-1">次</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Trend Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              <h2 className="text-[16px] font-bold text-slate-800">活动量与体征趋势</h2>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <TrendBarChart 
              data={mockActivityData} 
              title="" 
              subtitle="" 
              color="#f43f5e"
              hideHeader
              className="!p-0 !bg-transparent !shadow-none !border-none"
            />
          </div>

          <div className="mt-4 p-4 bg-rose-50 rounded-[16px] border border-rose-100">
            <p className="text-[13px] text-rose-700 font-medium leading-relaxed">
              本周平均步数 6,240 步，周末活动量显著增加。心率变异性 (HRV) 保持在健康区间，未见明显异常波动。
            </p>
          </div>
        </motion.div>

        {/* Cognitive/Disease Specific Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <h2 className="text-[16px] font-bold text-slate-800">专病管理概况</h2>
            </div>
          </div>
          
          <div className="h-48 w-full bg-slate-50/50 rounded-[16px] border border-slate-100/50 p-4">
            <WaveChart data={mockVitalsData} dataKey="value" color="#6366f1" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500">用药依从性</span>
              <span className="font-bold text-slate-800">95%</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500">日记记录天数</span>
              <span className="font-bold text-slate-800">5 天</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-slate-500">AI 训练完成度</span>
              <span className="font-bold text-slate-800">80%</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-auto pb-8">
          <Button
            block
            loading={isDownloading}
            onClick={handleDownload}
            className="h-14 rounded-full text-[16px] font-bold text-slate-700 border border-slate-200 bg-white shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? '下载中...' : '下载完整 PDF 报告'}
          </Button>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
