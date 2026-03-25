import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea, Switch, Slider, Toast } from 'antd-mobile';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, ShieldCheck, AlertTriangle, BellRing, Navigation, Users, Clock } from 'lucide-react';

export default function LBSFenceView() {
  const navigate = useNavigate();
  const [isFenceEnabled, setIsFenceEnabled] = useState(true);
  const [radius, setRadius] = useState(500); // meters

  const handleSave = () => {
    Toast.show({
      content: '安全围栏设置已保存',
      icon: 'success',
    });
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div className="h-full bg-[#FAFAFA] flex flex-col relative overflow-y-auto hide-scrollbar">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[40%] bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <SafeArea position="top" />
        <NavBar 
          backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
          onBack={() => navigate(-1)}
          className="bg-transparent"
        >
          <span className="font-bold text-slate-800">LBS 安全围栏</span>
        </NavBar>

        <div className="flex-1 overflow-y-auto px-4 pt-2 space-y-6">
          {/* Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] p-2 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden h-[240px]"
          >
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-slate-100/50 flex flex-col items-center justify-center">
              <div className="w-full h-full opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #94a3b8 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
              
              {/* Center Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100/80 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mt-2 text-[12px] font-bold text-slate-700 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  当前位置：成都市武侯区
                </div>
              </div>

              {/* Radius Circle */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 transition-all duration-300"
                style={{ width: `${radius / 5}px`, height: `${radius / 5}px` }}
              />
            </div>
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isFenceEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className="text-[12px] font-bold text-slate-700">
                {isFenceEnabled ? '围栏守护中' : '围栏已关闭'}
              </span>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Switch */}
            <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shadow-inner transition-colors ${isFenceEnabled ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800">启用安全围栏</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">离开设定范围将自动报警</p>
                </div>
              </div>
              <Switch 
                checked={isFenceEnabled} 
                onChange={setIsFenceEnabled} 
                style={{ '--checked-color': '#10b981' }}
              />
            </div>

            {/* Radius Slider */}
            <div className={`bg-white rounded-[20px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/50 transition-opacity ${isFenceEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800">活动半径设置</h3>
                    <p className="text-[12px] text-slate-500 mt-0.5">当前设定：{radius} 米</p>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <Slider 
                  value={radius} 
                  onChange={(v) => setRadius(v as number)} 
                  min={100} 
                  max={2000} 
                  step={100}
                  marks={{
                    100: '100m',
                    1000: '1km',
                    2000: '2km'
                  }}
                  style={{ '--fill-color': '#10b981' }}
                />
              </div>
            </div>

            {/* Alert Settings */}
            <div className={`bg-white rounded-[20px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-4 transition-opacity ${isFenceEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="text-[15px] font-bold text-slate-800 mb-2">报警联动设置</h3>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100/50">
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-slate-400" />
                  <span className="text-[14px] text-slate-700 font-medium">App 弹窗与震动提醒</span>
                </div>
                <Switch defaultChecked style={{ '--checked-color': '#10b981' }} />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100/50">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="text-[14px] text-slate-700 font-medium">短信通知紧急联系人</span>
                </div>
                <Switch defaultChecked style={{ '--checked-color': '#10b981' }} />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-slate-400" />
                  <span className="text-[14px] text-slate-700 font-medium">设备端高音蜂鸣报警</span>
                </div>
                <Switch defaultChecked={false} style={{ '--checked-color': '#10b981' }} />
              </div>
            </div>
          </motion.div>

          {/* 底部悬浮按钮占位 */}
          <div className="h-[calc(env(safe-area-inset-bottom)+100px)] shrink-0 pointer-events-none" />
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100/50 z-50 pb-safe">
          <button 
            onClick={handleSave}
            className="w-full h-12 bg-emerald-500 text-white rounded-full font-bold text-[16px] shadow-[0_8px_24px_rgba(16,185,129,0.25)] active:scale-[0.98] transition-all"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
