import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Button } from 'antd-mobile';
import { ChevronLeft, FileText, Activity, Clock, ShieldCheck, Video, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { useAppStore } from '../../../store';
import { Paywall } from '../../../components/Paywall';
import { DiseaseTag } from '../../../configs/constants';

const adherenceData = [
  { date: '周一', value: 100 },
  { date: '周二', value: 100 },
  { date: '周三', value: 50 },
  { date: '周四', value: 100 },
  { date: '周五', value: 100 },
  { date: '周六', value: 100 },
  { date: '周日', value: 100 },
];

export default function VisitSummaryView() {
  const navigate = useNavigate();
  const { unlockedPrivileges, selectedDiseaseTag } = useAppStore();
  const hasAccess = unlockedPrivileges.includes('visit_summary');
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
        <span className="font-medium text-slate-900">就诊一页纸报表</span>
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
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">就诊一页纸报表</h1>
              <p className="text-[12px] text-slate-500 mt-1 font-medium">汇总发作录像与漏服次数，复诊直接给医生看</p>
            </div>
          </div>
        </motion.div>

        {/* Core Metrics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-rose-500" />
              <span className="text-[13px] font-bold text-slate-600">近30天发作</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-black text-slate-900 tracking-tight">2</span>
              <span className="text-[12px] font-medium text-slate-500">次</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-[13px] font-bold text-slate-600">最长持续时间</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-black text-slate-900 tracking-tight">3</span>
              <span className="text-[12px] font-medium text-slate-500">分钟</span>
            </div>
          </div>
        </motion.div>

        {/* Adherence Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-[16px] font-bold text-slate-800">用药依从率分析</h2>
          </div>
          
          <div className="h-48 w-full">
            <TrendBarChart 
              data={adherenceData} 
              title="" 
              subtitle="" 
              color="bg-emerald-500"
              hideHeader
              className="!p-0 !bg-transparent !shadow-none !border-none"
            />
          </div>

          <div className="mt-4 p-4 bg-emerald-50 rounded-[16px] border border-emerald-100">
            <p className="text-[13px] text-emerald-700 font-medium leading-relaxed">
              近 7 天用药依从率高达 95%，仅周三中午漏服一次。继续保持规律服药是控制发作的关键。
            </p>
          </div>
        </motion.div>

        {/* Video Archive Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              <h2 className="text-[16px] font-bold text-slate-800">发作录像归档</h2>
            </div>
            <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">已整理 2 份</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-[16px] border border-slate-100/50">
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-700">2026年3月10日 发作记录</span>
                <span className="text-[11px] text-slate-400 mt-0.5">持续 2 分钟，伴随抽搐</span>
              </div>
              <Button size="mini" className="rounded-full text-blue-600 bg-blue-50 border-none font-bold">查看</Button>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-[16px] border border-slate-100/50">
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-700">2026年2月25日 发作记录</span>
                <span className="text-[11px] text-slate-400 mt-0.5">持续 3 分钟，意识丧失</span>
              </div>
              <Button size="mini" className="rounded-full text-blue-600 bg-blue-50 border-none font-bold">查看</Button>
            </div>
          </div>
        </motion.div>

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
            {isSimulating ? '生成中...' : (hasAccess ? '生成 PDF 报表' : '解锁并生成 PDF 报表')}
          </Button>
        </div>
      </div>
      <SafeArea position="bottom" />
      {showPaywall && (
        <Paywall 
          onClose={() => setShowPaywall(false)} 
          equipmentId={selectedDiseaseTag === DiseaseTag.EPILEPSY ? "neuro_band_pro" : undefined}
          title="解锁复诊一页纸"
          description="该深度报告需要高精度的临床级体征数据支撑。购买并绑定「Neuro-Band Pro 预警手环」，即可终身解锁该报告及所有高阶管家服务。"
        />
      )}
    </div>
  );
}
