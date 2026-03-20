import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea } from 'antd-mobile';
import { ChevronLeft, Sparkles, Activity, Brain, Pill, CalendarCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { RadarChart } from '../../components/Charts/RadarChart';

export default function HealthReportView() {
  const navigate = useNavigate();
  const { identity } = useAppStore();
  const isFamily = identity === 'FAMILY';

  const radarData = [
    { subject: '认知功能', A: 85, fullMark: 100 },
    { subject: '情绪状态', A: 90, fullMark: 100 },
    { subject: '睡眠质量', A: 75, fullMark: 100 },
    { subject: '用药依从', A: 95, fullMark: 100 },
    { subject: '发作控制', A: 88, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/80 to-transparent opacity-50 pointer-events-none" />
      
      <NavBar 
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        className="bg-transparent relative z-10"
      >
        <span className="font-medium text-slate-900">健康数据大屏</span>
      </NavBar>

      <div className="flex-1 px-4 pb-8 space-y-4 relative z-10 overflow-y-auto">
        
        {/* AI 核心简报 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[20px] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100/80"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">AI 综合分析</h2>
              <p className="text-[10px] text-slate-500">基于近 30 天多维数据生成</p>
            </div>
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
            {isFamily ? '长辈' : '您'}本月整体健康状况良好。用药依从性极高（95%），有效控制了偏头痛的发作频次。但睡眠质量存在波动，深睡比例偏低，建议增加日间户外活动。
          </p>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-emerald-50/50 rounded-[12px] p-2.5 border border-emerald-100/50">
              <div className="flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">健康指数</span>
              </div>
              <div className="text-[20px] font-black text-emerald-600">88<span className="text-[10px] font-medium ml-0.5">分</span></div>
            </div>
            <div className="flex-1 bg-amber-50/50 rounded-[12px] p-2.5 border border-amber-100/50">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-bold text-amber-700">需关注</span>
              </div>
              <div className="text-[13px] font-bold text-amber-600 mt-1">睡眠质量波动</div>
            </div>
          </div>
        </motion.div>

        {/* 多维能力雷达图 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[20px] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100/80"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-blue-500" />
              多维能力图谱
            </h3>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">近 30 天</span>
          </div>
          <div className="relative h-48 -mt-4">
            <RadarChart data={radarData} color="#6366f1" />
          </div>
        </motion.div>

        {/* 核心指标 Bento Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[20px] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Pill className="w-4 h-4 text-emerald-500" />
              <span className="text-[12px] font-bold text-slate-700">用药依从</span>
            </div>
            <div>
              <div className="text-[24px] font-black text-slate-800">95<span className="text-[12px] font-medium text-slate-500 ml-0.5">%</span></div>
              <div className="text-[10px] text-emerald-500 font-medium mt-0.5">↑ 较上月提升 5%</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[20px] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <CalendarCheck className="w-4 h-4 text-blue-500" />
              <span className="text-[12px] font-bold text-slate-700">无发作天数</span>
            </div>
            <div>
              <div className="text-[24px] font-black text-slate-800">28<span className="text-[12px] font-medium text-slate-500 ml-0.5">天</span></div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">本月共发作 2 次</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2 bg-white rounded-[20px] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100/80"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-[12px] font-bold text-slate-700">睡眠与体征趋势</span>
              </div>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">IoT 同步正常</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-[12px]">
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">平均深睡时长</div>
                <div className="text-[16px] font-bold text-slate-800">1<span className="text-[10px] font-medium text-slate-500 mx-0.5">h</span>45<span className="text-[10px] font-medium text-slate-500 ml-0.5">m</span></div>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">平均静息心率</div>
                <div className="text-[16px] font-bold text-slate-800">68<span className="text-[10px] font-medium text-slate-500 ml-0.5">bpm</span></div>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">血氧饱和度</div>
                <div className="text-[16px] font-bold text-slate-800">98<span className="text-[10px] font-medium text-slate-500 ml-0.5">%</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
