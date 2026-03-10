// File: src/views/Manager/Epilepsy/index.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, Calendar, Phone, Pill, Video, ShieldAlert } from 'lucide-react';
import { useRecallStore, DangerLevel, RecallReason } from '../../../store/recall';
import { Button, Popup, Radio, Space, Toast } from 'antd-mobile';
import SeizureCalendar from './SeizureCalendar';
import { TrendBarChart } from '../../../components/Charts/TrendBarChart';
import { VitalsGrid } from '../../../components/Charts/VitalsGrid';
import { IoTStatusCard } from '../../../components/IoTStatusCard';
import { useAppStore } from '../../../store';
import { UserIdentity } from '../../../interfaces/user';

export default function EpilepsyManager() {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [duration, setDuration] = useState<string>('');
  const { triggerRecall } = useRecallStore();
  const { isDeviceBound, medicationStatus, checkInMedication, identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

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
  const adherenceRate = 98;

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

  const medications = [
    { id: 'morning', time: '早上', name: '左乙拉西坦片 500mg', taken: medicationStatus.morning },
    { id: 'noon', time: '中午', name: '丙戊酸钠缓释片 500mg', taken: medicationStatus.noon },
    { id: 'evening', time: '晚上', name: '左乙拉西坦片 500mg', taken: medicationStatus.evening },
  ] as const;

  const handleTakeMedication = (id: 'morning' | 'noon' | 'evening') => {
    checkInMedication(id);
  };

  // Mock Trend Data
  const adherenceData = [
    { date: '10.21', value: 100 },
    { date: '10.22', value: 100 },
    { date: '10.23', value: 66, color: '#f59e0b' }, // Missed one dose
    { date: '10.24', value: 100 },
    { date: '10.25', value: 100 },
    { date: '10.26', value: 100 },
    { date: '今日', value: 33, color: '#94a3b8' }, // In progress
  ];

  // Mock Vitals Data
  const mockVitals = {
    hrv: 42,
    deepSleepRatio: 28,
    eegStability: 95,
    lastSyncTime: '刚刚'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      {/* 1. 专属核心舱 (Status Overview) */}
      <div className="space-y-3">
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
      </div>

      {/* 2. 健康趋势洞察 (Data Insights) */}
      <TrendBarChart 
        data={adherenceData} 
        title="近 7 日用药依从性" 
        subtitle="保持规律服药是控制发作的关键"
        valueFormatter={(val) => `${val}%`}
      />

      {/* 3. 日常健康基座 & IoT (Wearable Integration) */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">日常健康基座</h3>
        </div>
        
        <IoTStatusCard />
        
        {isDeviceBound && (
          <VitalsGrid vitals={mockVitals} />
        )}
      </div>

      {/* 4. 日常干预 (Daily Actions) */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">日常干预</h3>
        </div>

        <div className="space-y-2">
          {medications.map(med => (
            <div key={med.id} className="bg-white rounded-[20px] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.taken ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-500 mb-0.5">今日{med.time}</p>
                  <p className={`text-sm font-semibold ${med.taken ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{med.name}</p>
                </div>
              </div>
              {med.taken ? (
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium px-2 py-1">
                  <CheckCircle2 className="w-3 h-3" />
                  已服药
                </div>
              ) : (
                <button 
                  onClick={() => handleTakeMedication(med.id)}
                  className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                >
                  打卡
                </button>
              )}
            </div>
          ))}

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
      </div>

      {/* 5. 医患连接与服务 (Medical Services) */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">深度服务</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileTap={{ scale: 0.96 }}
            className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 cursor-pointer group hover:border-blue-200 transition-colors"
            onClick={() => Toast.show({ content: '正在连接华西专病团队...', icon: 'loading' })}
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
      </div>

      {/* 紧急录像悬浮球 */}
      <button 
        onClick={startRecording}
        className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-12 h-12 bg-rose-500 text-white rounded-full shadow-[0_8px_20px_rgba(244,63,94,0.3)] active:scale-95 transition-transform"
      >
        <Video className="w-5 h-5" />
      </button>

      {/* 模拟录像全屏遮罩 */}
      {isRecording && (
        <div className="fixed inset-0 z-[9000] bg-black flex flex-col items-center justify-center" style={{ touchAction: 'none' }}>
          <div className="absolute top-12 right-6 flex items-center gap-2 bg-rose-600/20 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-rose-500 font-mono text-lg font-bold">00:0{3 - countdown}</span>
          </div>
          <div className="w-24 h-24 border-2 border-white/20 rounded-xl mb-6 flex items-center justify-center">
            <Video className="w-8 h-8 text-white/50" />
          </div>
          <span className="text-white text-2xl font-bold">正在录像...</span>
        </div>
      )}

      {/* 录像结束后的必选项卡片 */}
      <Popup visible={showQuestion} maskStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }} closeOnMaskClick={false}>
        <div className="p-6 bg-white rounded-t-[32px]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldAlert className="w-6 h-6 text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900">发作了多久？</h3>
          </div>
          <Radio.Group value={duration} onChange={val => setDuration(val as string)}>
            <Space direction="vertical" block className="gap-3">
              <Radio value="UNDER_1_MIN" className="w-full bg-slate-50 p-4 rounded-[20px] font-medium text-sm border border-slate-100">1分钟内</Radio>
              <Radio value="UNDER_5_MIN" className="w-full bg-slate-50 p-4 rounded-[20px] font-medium text-sm border border-slate-100">不到5分钟</Radio>
              <Radio value="OVER_5_MIN" className="w-full bg-rose-50 p-4 rounded-[20px] font-medium text-sm text-rose-600 border border-rose-200">
                超过5分钟了！
              </Radio>
            </Space>
          </Radio.Group>
          <Button 
            block 
            color="primary" 
            size="large" 
            className="mt-6 rounded-[20px] font-medium text-sm h-12 bg-slate-900 border-none text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
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
    </motion.div>
  );
}
