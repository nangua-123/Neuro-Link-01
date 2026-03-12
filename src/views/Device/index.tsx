// File: src/views/Device/index.tsx
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, SafeArea, Modal } from 'antd-mobile';
import { HeartOutline } from 'antd-mobile-icons';
import { Bluetooth, Battery, ChevronLeft, Plus, Activity, Moon, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

export default function DeviceView() {
  const navigate = useNavigate();
  const { isDeviceBound, vitals, selectedDiseaseTag, unbindDevice } = useAppStore();

  const handleDisconnect = () => {
    Modal.confirm({
      content: '确定要断开所有设备连接吗？断开后将停止实时体征监测。',
      onConfirm: () => {
        unbindDevice();
        Toast.show({ content: '已断开连接' });
      },
    });
  };

  const renderBentoCard = (title: string, icon: React.ReactNode, value: string | number, unit: string, colorClass: string, isConnected: boolean) => (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between aspect-square relative overflow-hidden`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isConnected ? colorClass.replace('text-', 'bg-').replace('500', '50') : 'bg-slate-50'}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${isConnected ? colorClass : 'text-slate-300'}` })}
        </div>
        {!isConnected && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">未连接</span>}
      </div>
      
      <div className="relative z-10">
        <div className="text-[13px] font-medium text-slate-500 mb-1">{title}</div>
        {isConnected ? (
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-bold text-slate-900 tracking-tighter">{value}</span>
            <span className="text-[12px] font-medium text-slate-400">{unit}</span>
          </div>
        ) : (
          <div className="text-[14px] font-bold text-blue-600 active:text-blue-700" onClick={() => navigate('/device-connect')}>
            去连接 →
          </div>
        )}
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 ${isConnected ? colorClass.replace('text-', 'bg-') : 'bg-slate-200'}`} />
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
          <span className="font-medium text-slate-900">智能设备管理</span>
        </NavBar>
      </div>

      <div className="flex-1 p-5 pb-32 overflow-y-auto">
        {/* 设备状态卡片 */}
        {isDeviceBound ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[28px] p-5 mb-6 border border-blue-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 relative">
                <Bluetooth className="text-blue-600 w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="text-[16px] font-bold text-slate-900">Neuro-Band Pro</div>
                <div className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-1">
                  已连接 · 信号极佳
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-emerald-500">
                <Battery size={14} />
                <span className="text-[13px] font-bold font-mono">85%</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">刚刚同步</span>
            </div>
          </motion.div>
        ) : (
          <div 
            onClick={() => navigate('/device-connect')}
            className="bg-white rounded-[28px] p-6 mb-6 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 active:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
              <Plus className="text-slate-400 w-6 h-6" />
            </div>
            <div className="text-[14px] font-bold text-slate-400">尚未连接健康设备</div>
          </div>
        )}

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {renderBentoCard('睡眠质量', <Moon />, vitals.deepSleepRatio, '% 深睡', 'text-indigo-500', isDeviceBound)}
          {renderBentoCard('实时心率', <HeartOutline />, 72, 'bpm', 'text-rose-500', isDeviceBound)}
          {renderBentoCard('HRV 压力', <Activity />, vitals.hrv, 'ms', 'text-emerald-500', isDeviceBound)}
          
          {/* 专病动态卡片 */}
          {selectedDiseaseTag === DiseaseTag.EPILEPSY ? (
            renderBentoCard('脑电稳定性', <Zap />, vitals.eegStability, '%', 'text-amber-500', isDeviceBound)
          ) : (
            renderBentoCard('日常步数', <Activity />, 4280, '步', 'text-orange-500', isDeviceBound)
          )}
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50/50 rounded-[24px] p-4 border border-blue-100/30 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-700/80 leading-relaxed font-medium">
            {isDeviceBound 
              ? '系统正在持续监测您的体征数据，如遇极端情况将自动触发熔断报警并通知紧急联系人。' 
              : '连接设备后，AI 助理将能为您提供基于实时体征的个性化脑健康报告与风险预警。'}
          </p>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="p-5 bg-white border-t border-slate-100">
        <Button 
          block 
          color="primary" 
          className="h-12 rounded-full font-bold text-[15px] shadow-lg shadow-blue-200"
          onClick={() => navigate('/device-connect')}
        >
          添加新设备
        </Button>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}

