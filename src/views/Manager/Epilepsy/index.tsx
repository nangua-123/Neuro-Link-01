// File: src/views/Manager/Epilepsy/index.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, Calendar, Phone, Video, ShieldAlert, Plus, Square, Sparkles } from 'lucide-react';
import { useRecallStore, DangerLevel, RecallReason } from '../../../store/recall';
import { Button, Popup, Radio, Space, Toast } from 'antd-mobile';
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
  const [recordingPhase, setRecordingPhase] = useState<'idle' | 'countdown' | 'recording'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [recordSeconds, setRecordSeconds] = useState(0);
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
    setRecordingPhase('countdown');
    setCountdown(3);
    setRecordSeconds(0);
  };

  const stopRecording = () => {
    setRecordingPhase('idle');
    Toast.show({ content: '录像已保存至系统相册', icon: 'success' });
    setShowQuestion(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recordingPhase === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (recordingPhase === 'countdown' && countdown === 0) {
      setRecordingPhase('recording');
    }
    return () => clearTimeout(timer);
  }, [recordingPhase, countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recordingPhase === 'recording') {
      timer = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [recordingPhase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
    } else if (duration) {
      setIsDiarySheetVisible(true);
    }
    setDuration('');
  };

  const handleSkip = () => {
    setShowQuestion(false);
    setDuration('');
  };

  const daysWithoutSeizure = 142;
  const adherenceRate = epilepsyAdherenceData.find(d => d.date === '今日')?.value || 0;

  // 动态颜色逻辑：天数长（>30天）用绿色，天数短（<=30天）用橙色预警
  const isSafe = daysWithoutSeizure > 30;
  
  const statusClasses = isSafe ? {
    bg: 'bg-emerald-50/80 border border-emerald-100/50',
    iconBg: 'bg-emerald-100 text-emerald-600',
    textColor: 'text-emerald-800',
    textLight: 'text-emerald-600/80',
    statusText: '状态极佳',
    descText: `已持续 ${daysWithoutSeizure} 天无发作，请继续保持`
  } : {
    bg: 'bg-orange-50/80 border border-orange-100/50',
    iconBg: 'bg-orange-100 text-orange-600',
    textColor: 'text-orange-800',
    textLight: 'text-orange-600/80',
    statusText: '需多加留意',
    descText: `近期有发作记录，请按时服药并避免诱因`
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
      className="space-y-4 pb-8"
    >
      {/* 1. 专属核心舱 (Status Overview) */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
            {isFamily ? '长辈癫痫守护' : '我的癫痫守护'}
          </h2>
          <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Seizure Status Capsule */}
          <div className={`rounded-[16px] p-3 flex items-center justify-between shadow-sm ${statusClasses.bg}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${statusClasses.iconBg}`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-[13px] font-bold tracking-tight mb-0.5 ${statusClasses.textColor}`}>
                  {statusClasses.statusText}
                </h3>
                <p className={`text-[10px] font-medium ${statusClasses.textLight}`}>
                  {statusClasses.descText}
                </p>
              </div>
            </div>
          </div>

          {/* Adherence Status Capsule */}
          <div className="bg-blue-50/80 border border-blue-100/50 rounded-[16px] p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-blue-100 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-blue-900 tracking-tight mb-0.5">
                  用药依从率 <span className="text-[14px] ml-1">{adherenceRate}%</span>
                </h3>
                <p className="text-[10px] text-blue-700/80 font-medium">
                  保持规律服药是控制发作的关键
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. 健康趋势洞察 (Data Insights) */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">数据洞察</h3>
          <button 
            onClick={() => setIsVisitSummaryVisible(true)}
            className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full active:scale-95 transition-transform flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5" />
            AI 智能复诊小结
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
      <motion.div variants={itemVariants} className="space-y-2.5">
        <div className="px-1 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">日常干预</h3>
        </div>

        <div className="space-y-2.5">
          {/* Bento Box: 记录发作 & 近期复诊计划 */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setIsDiarySheetVisible(true)}
              className="bg-white p-2.5 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-1.5 group hover:border-indigo-200 transition-colors text-left"
            >
              <div className="w-6 h-6 rounded-[10px] bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Activity className="w-3 h-3" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight">{isFamily ? '记录长辈发作' : '记录发作日记'}</h4>
                <p className="text-[8px] text-slate-500 mt-0.5 font-medium">记录发作类型与诱因</p>
              </div>
            </button>

            <div className="bg-white p-2.5 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-1.5 relative group text-left">
              <div className="w-6 h-6 rounded-[10px] bg-blue-50 text-blue-500 flex items-center justify-center">
                <Calendar className="w-3 h-3" />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">近期复诊计划</h4>
                </div>
                <p className="text-[8px] text-slate-500 mt-0.5 font-medium leading-relaxed">距下次复诊还有 5 天，请准备脑电图报告。</p>
              </div>
            </div>
          </div>

          <MedicationTracker />
        </div>
      </motion.div>

      {/* 5. 医患连接与服务 (Medical Services) */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <div className="px-1">
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">深度服务</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <motion.div 
            whileTap={{ scale: 0.96 }}
            className="bg-white rounded-[12px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 cursor-pointer group hover:border-blue-200 transition-colors"
            onClick={() => showComingSoon('专家复诊通道建设中', '华西癫痫专病团队的在线复诊通道正在进行最后的合规测试。')}
          >
            <div className="w-6 h-6 rounded-[10px] bg-blue-50 text-blue-500 flex items-center justify-center mb-1.5 group-hover:bg-blue-100 transition-colors">
              <Phone className="w-3 h-3" />
            </div>
            <h3 className="text-[11px] font-semibold text-slate-900 mb-0.5">专家在线复诊</h3>
            <p className="text-[8px] text-slate-500 font-medium">华西专病团队</p>
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.96 }}
            className="bg-white rounded-[12px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 cursor-pointer group hover:border-purple-200 transition-colors"
            onClick={() => setShowCalendar(true)}
          >
            <div className="w-6 h-6 rounded-[10px] bg-purple-50 text-purple-500 flex items-center justify-center mb-1.5 group-hover:bg-purple-100 transition-colors">
              <Activity className="w-3 h-3" />
            </div>
            <h3 className="text-[11px] font-semibold text-slate-900 mb-0.5">发作日记</h3>
            <p className="text-[8px] text-slate-500 font-medium">趋势与回顾</p>
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
          className="absolute bottom-20 right-5 pointer-events-auto flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-rose-400 to-red-500 text-white rounded-full shadow-[0_4px_16px_rgba(225,29,72,0.3)] active:scale-95 transition-transform"
        >
          <Video className="w-5 h-5" />
        </button>
      </div>

      {/* 模拟录像全屏遮罩 */}
      {recordingPhase !== 'idle' && (
        <div className="fixed inset-0 max-w-md mx-auto right-0 left-0 z-[9000] bg-black flex flex-col items-center justify-center" style={{ touchAction: 'none' }}>
          {recordingPhase === 'countdown' ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 border-2 border-white/20 rounded-full mb-6 flex items-center justify-center">
                <Video className="w-8 h-8 text-white/50" />
              </div>
              <span className="text-white text-4xl font-bold animate-pulse">{countdown}</span>
              <span className="text-white/50 text-sm mt-4">准备录像...</span>
            </div>
          ) : (
            <>
              <div className="absolute top-12 right-6 flex items-center gap-2 bg-rose-600/20 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-rose-500 font-mono text-lg font-bold">{formatTime(recordSeconds)}</span>
              </div>
              <div className="w-24 h-24 border-2 border-rose-500/50 rounded-full mb-6 flex items-center justify-center animate-pulse">
                <Video className="w-8 h-8 text-rose-500" />
              </div>
              <span className="text-white text-2xl font-bold mb-12">正在录像...</span>
              
              <button 
                onClick={stopRecording}
                className="absolute bottom-24 flex items-center justify-center w-20 h-20 bg-white/10 border-2 border-white/20 rounded-full active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 bg-rose-500 rounded-sm" />
              </button>
            </>
          )}
        </div>
      )}

      {/* 录像结束后的必选项卡片 */}
      <Popup visible={showQuestion} maskStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }} closeOnMaskClick={false}>
        <div className="p-6 sm:p-8 bg-white rounded-t-[32px]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldAlert className="w-6 h-6 text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900">发作了多久？</h3>
          </div>
          <p className="text-center text-[13px] text-slate-500 mb-6 font-medium">
            录像已保存。是否立即记录本次发作详情？
          </p>
          <Radio.Group value={duration} onChange={val => setDuration(val as string)}>
            <Space direction="vertical" block className="gap-3">
              <Radio value="UNDER_1_MIN" className="w-full bg-slate-50/80 p-4 sm:p-5 rounded-[24px] font-medium text-sm border-none">1分钟内</Radio>
              <Radio value="UNDER_5_MIN" className="w-full bg-slate-50/80 p-4 sm:p-5 rounded-[24px] font-medium text-sm border-none">不到5分钟</Radio>
              <Radio value="OVER_5_MIN" className="w-full bg-rose-50/80 p-4 sm:p-5 rounded-[24px] font-medium text-sm text-rose-600 border-none">
                超过5分钟了！(将触发紧急预警)
              </Radio>
            </Space>
          </Radio.Group>
          <div className="flex gap-3 mt-6">
            <Button 
              block 
              size="large" 
              className="flex-1 rounded-full font-medium text-sm h-12 bg-slate-100 border-none text-slate-600" 
              onClick={handleSkip}
            >
              稍后记录
            </Button>
            <Button 
              block 
              color="primary" 
              size="large" 
              className="flex-1 rounded-full font-medium text-sm h-12 bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)]" 
              disabled={!duration}
              onClick={handleSubmit}
            >
              继续记录
            </Button>
          </div>
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
