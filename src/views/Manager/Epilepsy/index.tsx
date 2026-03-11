// File: src/views/Manager/Epilepsy/index.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, Calendar, Phone, Video, ShieldAlert, Plus } from 'lucide-react';
import { useRecallStore, DangerLevel, RecallReason } from '../../../store/recall';
import { Button, Popup, Radio, Space } from 'antd-mobile';
import SeizureCalendar from './SeizureCalendar';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { DailyHealthBase } from '../../../components/DailyHealthBase';
import { MedicationTracker } from '../../../components/MedicationTracker';
import { SeizureDiarySheet } from '../../../components/SeizureDiarySheet';
import { MedicalToolbox } from '../../../components/MedicalToolbox';
import { VisitSummaryModal } from '../../../components/VisitSummaryModal';
import { useAppStore } from '../../../store';
import { UserIdentity } from '../../../interfaces/user';
import { DiseaseTag } from '../../../configs/constants';
import { showComingSoon } from '../../../utils/ui';
import { ManagerSkeleton } from '../../../components/ManagerSkeleton';

export default function EpilepsyManager() {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isDiarySheetVisible, setIsDiarySheetVisible] = useState(false);
  const [isVisitSummaryVisible, setIsVisitSummaryVisible] = useState(false);
  const [duration, setDuration] = useState<string>('');
  const { triggerRecall } = useRecallStore();
  const { isDeviceBound, identity, epilepsyAdherenceData } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setCountdown(3);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isRecording && countdown === 0) {
      setIsRecording(false);
      setShowQuestion(true);
    }
    return () => clearTimeout(timer);
  }, [isRecording, countdown]);

  const handleSubmit = () => {
    setShowQuestion(false);
    if (duration === 'OVER_5_MIN') {
      triggerRecall({
        level: DangerLevel.CRITICAL,
        reason: RecallReason.EPILEPSY_STATUS,
        message: isFamily ? '长辈癫痫发作已超过 5 分钟，极可能进入癫痫持续状态！' : '您癫痫发作已超过 5 分钟，极可能进入癫痫持续状态！',
        patientId: 'current_user',
        timestamp: Date.now()
      });
    }
  };

  const daysWithoutSeizure = 142;
  const adherenceRate = epilepsyAdherenceData.find(d => d.date === '今日')?.value || 0;

  // 动态颜色逻辑：天数长（>30天）用绿色，天数短（<=30天）用橙色预警
  const isSafe = daysWithoutSeizure > 30;
  
  const statusClasses = isSafe ? {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    textColor: 'text-white',
    textLight: 'text-emerald-50'
  } : {
    bg: 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    textColor: 'text-white',
    textLight: 'text-orange-50'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isLoading) return <ManagerSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-10"
    >
      {/* 1. 专属核心舱 (Status Overview) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {isFamily ? '长辈癫痫护航管家' : '我的癫痫护航管家'}
          </h2>
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`relative overflow-hidden rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${statusClasses.bg}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-3">
                <div className={`p-1.5 rounded-xl backdrop-blur-md ${statusClasses.iconBg}`}>
                  <Activity className={`w-3 h-3 ${statusClasses.iconColor}`} />
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${statusClasses.textColor}`}>持续无发作</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold tracking-tighter ${statusClasses.textColor}`}>{daysWithoutSeizure}</span>
                <span className={`text-xs font-medium ${statusClasses.textLight}`}>天</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white">用药依从率</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tighter text-white">{adherenceRate}</span>
                <span className="text-xs font-medium text-blue-50">%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. 健康趋势洞察 (Data Insights) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">数据洞察</h3>
          <button 
            onClick={() => setIsVisitSummaryVisible(true)}
            className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            生成就诊摘要
          </button>
        </div>
        <TrendBarChart 
          data={epilepsyAdherenceData} 
          title={isFamily ? "长辈近 7 日用药依从性" : "近 7 日用药依从性"}
          subtitle={isFamily ? "督促长辈保持规律服药是控制发作的关键" : "保持规律服药是控制发作的关键"}
          valueFormatter={(val) => `${val}%`}
          complianceRate={95}
        />
      </motion.div>

      {/* 3. 日常健康基座 & IoT (Wearable Integration) */}
      <motion.div variants={itemVariants}>
        <DailyHealthBase />
      </motion.div>

      {/* 4. 日常干预 (Daily Actions) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="px-1 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">日常干预</h3>
        </div>

        <div className="space-y-3">
          {/* 记录发作入口 */}
          <button 
            onClick={() => setIsDiarySheetVisible(true)}
            className="w-full bg-indigo-50 hover:bg-indigo-100 transition-colors p-4 rounded-[20px] border border-indigo-100/50 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-bold text-indigo-900">{isFamily ? '记录长辈发作日记' : '记录发作日记'}</h4>
                <p className="text-[11px] text-indigo-700/70 mt-0.5 font-medium">记录发作类型、时长与诱因</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Plus className="w-4 h-4 text-indigo-500" />
            </div>
          </button>

          <MedicationTracker />

          {/* 随访倒计时 */}
          <div className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 mt-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">V1 孕 12 周随访</p>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">还有 5 天</span>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">请准备近期脑电图报告，并完成孕期焦虑自评量表。</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. 医患连接与服务 (Medical Services) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">深度服务</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileTap={{ scale: 0.96 }}
            className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 cursor-pointer group hover:border-blue-200 transition-colors"
            onClick={() => showComingSoon('专家复诊通道建设中', '华西癫痫专病团队的在线复诊通道正在进行最后的合规测试。')}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">专家在线复诊</h3>
            <p className="text-[10px] text-slate-500 font-medium">华西专病团队</p>
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.96 }}
            className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 cursor-pointer group hover:border-purple-200 transition-colors"
            onClick={() => setShowCalendar(true)}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">发作日记</h3>
            <p className="text-[10px] text-slate-500 font-medium">趋势与回顾</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MedicalToolbox />
      </motion.div>

      {/* 紧急录像悬浮球 */}
      <div className="fixed inset-0 max-w-md mx-auto right-0 left-0 pointer-events-none z-40">
        <button 
          onClick={startRecording}
          className="absolute bottom-24 right-6 pointer-events-auto flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-rose-400 to-red-500 text-white rounded-full shadow-[0_8px_24px_rgba(225,29,72,0.3)] active:scale-95 transition-transform"
        >
          <Video className="w-6 h-6" />
        </button>
      </div>

      {/* 模拟录像全屏遮罩 */}
      {isRecording && (
        <div className="fixed inset-0 max-w-md mx-auto right-0 left-0 z-[9000] bg-black flex flex-col items-center justify-center" style={{ touchAction: 'none' }}>
          <div className="absolute top-12 right-6 flex items-center gap-2 bg-rose-600/20 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-rose-500 font-mono text-lg font-bold">00:0{3 - countdown}</span>
          </div>
          <div className="w-24 h-24 border-2 border-white/20 rounded-full mb-6 flex items-center justify-center">
            <Video className="w-8 h-8 text-white/50" />
          </div>
          <span className="text-white text-2xl font-bold">正在录像...</span>
        </div>
      )}

      {/* 录像结束后的必选项卡片 */}
      <Popup visible={showQuestion} maskStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }} closeOnMaskClick={false}>
        <div className="p-6 sm:p-8 bg-white rounded-t-[32px]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldAlert className="w-6 h-6 text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900">发作了多久？</h3>
          </div>
          <Radio.Group value={duration} onChange={val => setDuration(val as string)}>
            <Space direction="vertical" block className="gap-3">
              <Radio value="UNDER_1_MIN" className="w-full bg-slate-50/80 p-4 sm:p-5 rounded-[24px] font-medium text-sm border-none">1分钟内</Radio>
              <Radio value="UNDER_5_MIN" className="w-full bg-slate-50/80 p-4 sm:p-5 rounded-[24px] font-medium text-sm border-none">不到5分钟</Radio>
              <Radio value="OVER_5_MIN" className="w-full bg-rose-50/80 p-4 sm:p-5 rounded-[24px] font-medium text-sm text-rose-600 border-none">
                超过5分钟了！
              </Radio>
            </Space>
          </Radio.Group>
          <Button 
            block 
            color="primary" 
            size="large" 
            className="mt-6 rounded-full font-medium text-sm h-12 bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)]" 
            disabled={!duration}
            onClick={handleSubmit}
          >
            保存记录
          </Button>
        </div>
      </Popup>

      {/* 发作日历与趋势弹窗 */}
      <Popup
        visible={showCalendar}
        onMaskClick={() => setShowCalendar(false)}
        bodyStyle={{
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          minHeight: '60vh',
          padding: '24px',
          backgroundColor: '#FAFAFA'
        }}
      >
        <SeizureCalendar />
      </Popup>

      {/* 手动记录发作日记弹窗 */}
      <SeizureDiarySheet visible={isDiarySheetVisible} onClose={() => setIsDiarySheetVisible(false)} />

      {/* 就诊摘要弹窗 */}
      <VisitSummaryModal visible={isVisitSummaryVisible} onClose={() => setIsVisitSummaryVisible(false)} diseaseTag={DiseaseTag.EPILEPSY} />
    </motion.div>
  );
}
