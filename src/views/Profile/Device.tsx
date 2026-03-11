import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Button } from 'antd-mobile';
import { motion } from 'motion/react';
import { ChevronRight, Watch, Plus, Bluetooth } from 'lucide-react';
import { useAppStore } from '../../store';

export default function DeviceView() {
  const navigate = useNavigate();
  const { isDeviceBound } = useAppStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100/50">
        <NavBar 
          onBack={() => navigate(-1)}
          backArrow={<ChevronRight className="rotate-180 w-6 h-6 text-slate-600" />}
        >
          <span className="font-medium text-slate-800">我的设备</span>
        </NavBar>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {!isDeviceBound ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-slate-200 rounded-full animate-ping opacity-20" />
              <Watch className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">暂无绑定设备</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-[240px] leading-relaxed">
              绑定 Neuro-Band 智能穿戴设备，开启全天候健康体征监测。
            </p>
            <Button 
              color="primary" 
              className="w-48 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
              onClick={() => navigate('/mall')}
            >
              前往商城选购
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[16px] flex items-center justify-center border border-slate-200/50 shadow-sm">
                    <Watch className="w-7 h-7 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Neuro-Band Pro</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <Bluetooth className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">已连接</span>
                    </p>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                  电量 85%
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">固件版本</div>
                  <div className="text-sm font-semibold text-slate-700">v2.1.4</div>
                </div>
                <div className="text-center border-l border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">同步时间</div>
                  <div className="text-sm font-semibold text-slate-700">刚刚</div>
                </div>
                <div className="text-center border-l border-slate-100">
                  <div className="text-xs text-slate-400 mb-1">设备状态</div>
                  <div className="text-sm font-semibold text-emerald-600">正常</div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full rounded-[20px] border-dashed border-2 border-slate-200 text-slate-500 h-14 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">添加新设备</span>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
