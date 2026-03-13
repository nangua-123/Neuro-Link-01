// File: src/views/Device/index.tsx
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, SafeArea, Modal } from 'antd-mobile';
import { HeartOutline } from 'antd-mobile-icons';
import { Bluetooth, Battery, ChevronLeft, Activity, Moon, Zap, Info, Watch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

// 简易数字滚动组件
const CountUp = ({ end, duration = 1.5 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const safeEnd = Number(end) || 0;

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(safeEnd * easeProgress));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [safeEnd, duration]);

  return <span>{count}</span>;
};

export default function DeviceView() {
  const navigate = useNavigate();
  const { isDeviceBound, vitals, selectedDiseaseTag, unbindDevice } = useAppStore();

  const handleDisconnect = () => {
    Modal.confirm({
      content: '确定断开设备吗？断开后将无法为您提供实时异常预警。',
      confirmText: '断开',
      cancelText: '取消',
      onConfirm: () => {
        unbindDevice();
        Toast.show({ content: '已断开连接' });
      },
    });
  };

  const renderBentoCard = (title: string, icon: React.ReactNode, value: number, unit: string, colorClass: string) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-[16px] p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between aspect-square relative overflow-hidden`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass.replace('text-', 'bg-').replace('500', '50')}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${colorClass}` })}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-[13px] font-medium text-slate-500 mb-1">{title}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-[32px] font-bold text-slate-900 tracking-tighter">
            <CountUp end={value} />
          </span>
          <span className="text-[12px] font-medium text-slate-400">{unit}</span>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 ${colorClass.replace('text-', 'bg-')}`} />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-100/50">
        <NavBar 
          onBack={() => navigate(-1)} 
          backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
          right={isDeviceBound && <span onClick={handleDisconnect} className="text-[13px] text-slate-400 active:text-slate-600">断开</span>}
        >
          <span className="font-medium text-slate-900">我的健康设备</span>
        </NavBar>
      </div>

      <div className="flex-1 p-5 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isDeviceBound ? (
            <motion.div
              key="bound"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* 设备状态卡片 */}
              <div className="bg-white rounded-[16px] p-4 mb-6 border border-blue-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative">
                    <Bluetooth className="text-blue-600 w-5 h-5" />
                    {/* 心跳呼吸灯 */}
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-slate-900">Neuro-Band Pro</div>
                    <div className="text-[12px] text-slate-400 mt-0.5">
                      已连接 · 实时同步中
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-emerald-500">
                    <Battery size={14} />
                    <span className="text-[13px] font-bold font-mono">85%</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid Dashboard */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {renderBentoCard('睡眠质量', <Moon />, vitals.deepSleepRatio, '% 深睡', 'text-indigo-500')}
                {renderBentoCard('实时心率', <HeartOutline />, vitals.heartRate, 'bpm', 'text-rose-500')}
                {renderBentoCard('HRV 压力', <Activity />, vitals.hrv, 'ms', 'text-emerald-500')}
                
                {/* 专病动态卡片 */}
                {selectedDiseaseTag === DiseaseTag.EPILEPSY ? (
                  renderBentoCard('脑电稳定性', <Zap />, vitals.eegStability, '%', 'text-amber-500')
                ) : (
                  renderBentoCard('日常步数', <Activity />, vitals.steps, '步', 'text-orange-500')
                )}
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-50/50 rounded-[16px] p-4 border border-blue-100/30 flex gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-700/80 leading-relaxed font-medium">
                  系统正在持续监测您的体征数据，如遇极端情况将自动触发熔断报警并通知紧急联系人。
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unbound"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center pt-10 pb-6"
            >
              {/* 引导连接舱 */}
              <div className="w-full bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative z-10">
                  <Watch className="w-10 h-10 text-blue-500" />
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
                </div>
                
                <h3 className="text-[18px] font-bold text-slate-900 mb-2 relative z-10">开启全天候健康守护</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-8 relative z-10">
                  连接智能穿戴设备，AI 管家将为您提供基于实时体征的个性化健康报告与突发风险预警。
                </p>

                <Button 
                  color="primary" 
                  className="w-full h-12 rounded-full font-bold text-[15px] shadow-lg shadow-blue-200 relative z-10"
                  onClick={() => navigate('/device-connect')}
                >
                  去绑定设备
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部按钮 (仅在已连接时显示) */}
      <AnimatePresence>
        {isDeviceBound && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="p-5 bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30"
          >
            <Button 
              block 
              className="h-12 rounded-full font-bold text-[15px] bg-slate-50 text-slate-600 border-none"
              onClick={() => navigate('/device-connect')}
            >
              连接新设备
            </Button>
            <SafeArea position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

