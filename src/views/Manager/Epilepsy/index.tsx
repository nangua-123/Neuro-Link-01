// File: src/views/Manager/Epilepsy/index.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, Calendar, Phone, Pill, Video, ShieldAlert } from 'lucide-react';
import { useRecallStore, DangerLevel, RecallReason } from '../../../store/recall';
import { Button, Popup, Radio, Space } from 'antd-mobile';
import SeizureCalendar from './SeizureCalendar';

export default function EpilepsyManager() {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [duration, setDuration] = useState<string>('');
  const { triggerRecall } = useRecallStore();

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
        message: '患者癫痫发作已超过 5 分钟，极可能进入癫痫持续状态！',
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
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-100/50',
    text: 'text-emerald-600',
    textLight: 'text-emerald-600/70'
  } : {
    bg: 'bg-orange-50/40',
    border: 'border-orange-100/50',
    text: 'text-orange-600',
    textLight: 'text-orange-600/70'
  };

  const [medications, setMedications] = useState([
    { id: 1, time: '早上', name: '左乙拉西坦片 500mg', taken: true },
    { id: 2, time: '中午', name: '丙戊酸钠缓释片 500mg', taken: false },
    { id: 3, time: '晚上', name: '左乙拉西坦片 500mg', taken: false },
  ]);

  const handleTakeMedication = (id: number) => {
    setMedications(meds => meds.map(m => m.id === id ? { ...m, taken: true } : m));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">
      {/* 1. 核心状态看板 (Status Overview) */}
      <div className="bg-white px-6 pt-8 pb-8 rounded-b-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">癫痫护航管家</h1>
            <p className="text-sm text-slate-500 mt-1">为您守护每一天</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`${statusClasses.bg} border ${statusClasses.border} rounded-2xl p-4 flex flex-col justify-between`}>
            <div className={`flex items-center gap-1.5 ${statusClasses.text} mb-3`}>
              <Activity className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">持续无发作</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-semibold ${statusClasses.text} tracking-tight`}>{daysWithoutSeizure}</span>
              <span className={`text-sm ${statusClasses.textLight} font-medium`}>天</span>
            </div>
          </div>

          <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-blue-600 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">用药依从率</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-blue-600 tracking-tight">{adherenceRate}</span>
              <span className="text-sm text-blue-600/70 font-medium">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-8">
        {/* 2. 每日干预卡片流 (Daily Actions) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">今日干预</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">3 项任务</span>
          </div>
          
          <div className="space-y-3">
            {medications.map(med => (
              <div key={med.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100/80 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.taken ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-0.5">今日{med.time}</p>
                    <p className={`text-sm font-medium ${med.taken ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{med.name}</p>
                  </div>
                </div>
                {med.taken ? (
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium px-3 py-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    已服药
                  </div>
                ) : (
                  <button 
                    onClick={() => handleTakeMedication(med.id)}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl active:scale-95 transition-transform shadow-sm shadow-blue-600/20"
                  >
                    打卡
                  </button>
                )}
              </div>
            ))}

            {/* 随访倒计时 */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-indigo-100/50 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-indigo-500 flex items-center justify-center shadow-sm border border-indigo-50">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-indigo-600/80 uppercase tracking-wider">V1 孕 12 周随访</p>
                    <span className="text-xs font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-full shadow-sm border border-indigo-50">还有 5 天</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-snug">请准备近期脑电图报告，并完成孕期焦虑自评量表。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 医患连接与服务 (Medical Services) */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">深度服务</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100/80 active:scale-95 transition-transform cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-medium text-slate-900 mb-1">专家在线复诊</h3>
              <p className="text-xs text-slate-500">华西专病团队</p>
            </div>
            <div 
              className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100/80 active:scale-95 transition-transform cursor-pointer"
              onClick={() => setShowCalendar(true)}
            >
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-medium text-slate-900 mb-1">发作日记</h3>
              <p className="text-xs text-slate-500">趋势与回顾</p>
            </div>
          </div>
        </section>
      </div>

      {/* 紧急录像悬浮球 */}
      <button 
        onClick={startRecording}
        className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 bg-red-500 text-white rounded-full shadow-[0_8px_20px_rgba(239,68,68,0.3)] active:scale-95 transition-transform"
      >
        <Video className="w-6 h-6" />
      </button>

      {/* 模拟录像全屏遮罩 */}
      {isRecording && (
        <div className="fixed inset-0 z-[9000] bg-black flex flex-col items-center justify-center" style={{ touchAction: 'none' }}>
          <div className="absolute top-12 right-6 flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-mono text-lg font-bold">00:0{3 - countdown}</span>
          </div>
          <div className="w-24 h-24 border-2 border-white/20 rounded-xl mb-6 flex items-center justify-center">
            <Video className="w-8 h-8 text-white/50" />
          </div>
          <span className="text-white text-2xl font-bold">正在录像...</span>
        </div>
      )}

      {/* 录像结束后的必选项卡片 */}
      <Popup visible={showQuestion} maskStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }} closeOnMaskClick={false}>
        <div className="p-6 bg-white rounded-t-3xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldAlert className="w-6 h-6 text-slate-900" />
            <h3 className="text-xl font-semibold text-slate-900">发作了多久？</h3>
          </div>
          <Radio.Group value={duration} onChange={val => setDuration(val as string)}>
            <Space direction="vertical" block className="gap-3">
              <Radio value="UNDER_1_MIN" className="w-full bg-slate-50 p-4 rounded-2xl font-medium text-base border border-slate-100">1分钟内</Radio>
              <Radio value="UNDER_5_MIN" className="w-full bg-slate-50 p-4 rounded-2xl font-medium text-base border border-slate-100">不到5分钟</Radio>
              <Radio value="OVER_5_MIN" className="w-full bg-red-50 p-4 rounded-2xl font-medium text-base text-red-600 border border-red-200">
                超过5分钟了！
              </Radio>
            </Space>
          </Radio.Group>
          <Button 
            block 
            color="primary" 
            size="large" 
            className="mt-6 rounded-2xl font-medium text-lg h-14 bg-blue-600 border-none" 
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
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          minHeight: '60vh',
          padding: '20px',
          backgroundColor: '#F8FAFC'
        }}
      >
        <SeizureCalendar />
      </Popup>
    </div>
  );
}
