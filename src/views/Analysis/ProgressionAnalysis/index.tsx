import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Button } from 'antd-mobile';
import { ChevronLeft, BrainCircuit, Activity, Moon, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { WaveChart } from '../../../components/common/charts/WaveChart';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { useAppStore } from '../../../store';
import { Paywall } from '../../../components/Paywall';
import { DiseaseTag } from '../../../configs/constants';

const cognitiveData = Array.from({ length: 7 }, (_, i) => ({ value: 70 + Math.random() * 20 }));
const sleepData = [
  { date: '周一', value: 85 },
  { date: '周二', value: 90 },
  { date: '周三', value: 75 },
  { date: '周四', value: 88 },
  { date: '周五', value: 92 },
  { date: '周六', value: 80 },
  { date: '周日', value: 85 },
];

export default function ProgressionAnalysisView() {
  const navigate = useNavigate();
  const { unlockedPrivileges, selectedDiseaseTag } = useAppStore();
  const hasAccess = unlockedPrivileges.includes('progression_analysis');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleExport = () => {
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-[#FAFAFA] flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50 to-transparent opacity-80 pointer-events-none" />
      
      <NavBar 
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        className="bg-transparent relative z-10"
      >
        <span className="font-medium text-slate-900">衰退延缓评估报告</span>
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
              <BrainCircuit className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">衰退延缓评估报告</h1>
              <p className="text-[12px] text-slate-500 mt-1 font-medium">综合脑力游戏通关率与睡眠质量，评估干预效果</p>
            </div>
          </div>
        </motion.div>

        {/* Content Section with Blur for Non-Premium */}
        <div className="relative">
          {!hasAccess && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-[28px]">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-2">解锁高级评估报告</h3>
                <p className="text-[13px] text-slate-500 mb-6">
                  获取基于华西专病知识库的深度认知衰退预测模型与个性化干预方案。
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

          <div className={`space-y-6 ${!hasAccess ? 'opacity-30 pointer-events-none' : ''}`}>
            {/* Cognitive Trend Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <h2 className="text-[16px] font-bold text-slate-800">认知评分趋势</h2>
                </div>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5% 较上周</span>
              </div>
              
              <div className="h-48 w-full bg-slate-50/50 rounded-[16px] border border-slate-100/50 p-4">
                <WaveChart data={cognitiveData} dataKey="value" color="bg-blue-500" />
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-[16px] border border-blue-100">
                <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
                  本周脑力游戏平均通关率达到 85%，认知评分整体呈平稳上升趋势。建议继续保持每日 15 分钟的脑力唤醒训练。
                </p>
              </div>
            </motion.div>

            {/* Sleep Correlation Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-5 h-5 text-blue-500" />
                <h2 className="text-[16px] font-bold text-slate-800">睡眠质量交叉分析</h2>
              </div>
              
              <div className="h-48 w-full">
                <TrendBarChart 
                  data={sleepData} 
                  title="" 
                  subtitle="" 
                  color="bg-blue-500"
                  hideHeader
                  className="!p-0 !bg-transparent !shadow-none !border-none"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <div className="mt-0.5">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-800">AI 洞察</h3>
                  <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                    数据显示，当深度睡眠得分超过 80 分时，次日的认知测试成绩平均提升 12%。高质量的睡眠是延缓认知衰退的重要基石。
                  </p>
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
            {isSimulating ? '获取中...' : (hasAccess ? '获取最新评估结果' : '解锁高级功能')}
          </Button>
        </div>
      </div>
      <SafeArea position="bottom" />

      {showPaywall && (
        <Paywall 
          title="解锁衰退延缓评估"
          description="该深度报告需要高精度的临床级睡眠与脑电数据支撑。购买并绑定「高精度睡眠监测仪 Max」，即可终身解锁该报告及所有高阶管家服务。"
          equipmentId={selectedDiseaseTag === DiseaseTag.AD ? "sleep_monitor_max" : undefined}
          onClose={() => setShowPaywall(false)} 
        />
      )}
    </div>
  );
}
