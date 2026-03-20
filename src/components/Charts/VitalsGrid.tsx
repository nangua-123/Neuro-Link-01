import React, { useState } from 'react';
import { Activity, Moon, BrainCircuit, Footprints, Settings, Plus, HeartPulse, Smartphone, Watch, Flame } from 'lucide-react';
import { useAppStore } from '../../store';
import { DeviceManagerModal } from '../DeviceManagerModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Swiper } from 'antd-mobile';

const getDeviceMetrics = (device: any, vitals: any) => {
  if (['apple', 'huawei', 'xiaomi', 'oppo'].includes(device.id)) {
    return [
      { label: '心率', value: vitals.heartRate || 72, unit: 'bpm', icon: HeartPulse, colorClass: 'text-rose-500' },
      { label: '步数', value: vitals.steps || 6500, unit: '步', icon: Footprints, colorClass: 'text-emerald-500' },
      { label: '消耗', value: vitals.calories || 320, unit: '千卡', icon: Flame, colorClass: 'text-orange-500' },
    ];
  }
  if (device.id === 'neuro_band' || device.id === 'eeg_patch') {
    return [
      { label: '脑电平稳', value: vitals.eegStability || 85, unit: '分', icon: BrainCircuit, colorClass: 'text-indigo-500' },
      { label: 'HRV', value: vitals.hrv || 42, unit: 'ms', icon: Activity, colorClass: 'text-rose-500' },
      { label: '深睡', value: vitals.deepSleepRatio || 28, unit: '%', icon: Moon, colorClass: 'text-blue-500' },
    ];
  }
  // Default
  return [
    { label: '心率', value: vitals.heartRate || 72, unit: 'bpm', icon: HeartPulse, colorClass: 'text-rose-500' },
    { label: 'HRV', value: vitals.hrv || 42, unit: 'ms', icon: Activity, colorClass: 'text-rose-500' },
    { label: '深睡', value: vitals.deepSleepRatio || 28, unit: '%', icon: Moon, colorClass: 'text-blue-500' },
  ];
};

export const VitalsGrid: React.FC = () => {
  const { vitals, connectedDevices } = useAppStore();
  const [isManagerVisible, setIsManagerVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full relative">
      <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
        <Swiper
          indicatorProps={{
            color: 'primary',
          }}
          style={{
            '--border-radius': '20px',
          } as any}
        >
          {connectedDevices.map(device => {
            const metrics = getDeviceMetrics(device, vitals);
            const DeviceIcon = ['apple', 'huawei', 'xiaomi', 'oppo'].includes(device.id) ? Smartphone : Watch;

            return (
              <Swiper.Item key={device.id}>
                <div className="pt-3 px-3 pb-7">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <DeviceIcon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-slate-900 leading-tight">{device.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded font-medium">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            实时同步
                          </div>
                          {device.battery && <span className="text-[10px] text-slate-400 font-medium">电量 {device.battery}%</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setIsManagerVisible(true)} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center active:bg-slate-100 transition-colors">
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between gap-2">
                    {metrics.map((m, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[12px] py-2 px-1">
                        <div className="flex items-center gap-1 mb-1">
                          <m.icon className={`w-3.5 h-3.5 ${m.colorClass}`} />
                          <span className="text-[11px] text-slate-500 font-medium">{m.label}</span>
                        </div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[18px] font-bold text-slate-900 tracking-tight">{m.value}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{m.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Swiper.Item>
            );
          })}

          {/* Add Device Card - Compact Horizontal Layout */}
          <Swiper.Item>
            <div className="pt-3 px-3 pb-7 h-full">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/device-connect')}
                className="h-full bg-gradient-to-br from-blue-50/40 to-slate-50/40 rounded-[16px] p-3 border border-blue-100/60 border-dashed flex items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500 shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[14px] font-bold text-slate-800">添加健康设备</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    授权同步基础体征，或接入高精度设备
                  </p>
                </div>
              </motion.div>
            </div>
          </Swiper.Item>
        </Swiper>
      </div>

      <DeviceManagerModal 
        visible={isManagerVisible} 
        onClose={() => setIsManagerVisible(false)} 
      />
    </div>
  );
};
