import React, { useState } from 'react';
import { Activity, Moon, BrainCircuit, Footprints, Settings, Plus, HeartPulse, Smartphone, Watch, Flame, Package, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store';
import { DeviceManagerModal } from '../DeviceManagerModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Swiper } from 'antd-mobile';

const MEDICAL_DEVICES: Record<string, { name: string, icon: any }> = {
  'neuro_band': { name: 'Neuro-Band Pro 预警手环', icon: Watch },
  'eeg_patch': { name: '动态脑电贴 (24h)', icon: Activity },
  'bci_headband': { name: 'BCI 认知训练头环', icon: BrainCircuit },
  'sleep_monitor': { name: '医用级睡眠分期仪', icon: Moon }
};

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
  const { vitals, connectedDevices, purchasedAssets } = useAppStore();
  const [isManagerVisible, setIsManagerVisible] = useState(false);
  const navigate = useNavigate();

  // Filter out purchased assets that are already connected
  const pendingAssets = purchasedAssets.filter(
    assetId => !connectedDevices.some(d => d.id === assetId)
  );

  // Unified State: Connected Devices OR Pending Devices exist
  if (connectedDevices.length > 0 || pendingAssets.length > 0) {
    return (
      <div className="w-full relative" id="vitals-grid-section">
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <Swiper
            indicatorProps={{
              color: 'primary',
            }}
            style={{
              '--border-radius': '24px',
            } as any}
          >
            {/* 1. Render Connected Devices */}
            {connectedDevices.map(device => {
              const metrics = getDeviceMetrics(device, vitals);
              const DeviceIcon = ['apple', 'huawei', 'xiaomi', 'oppo'].includes(device.id) ? Smartphone : Watch;

              return (
                <Swiper.Item key={`connected-${device.id}`}>
                  <div className="pt-4 px-4 pb-8">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100/80">
                          <DeviceIcon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-bold text-slate-800 leading-tight">{device.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex items-center gap-1 text-[12px] text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-full font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              实时同步
                            </div>
                            {device.battery && <span className="text-[12px] text-slate-400 font-medium">电量 {device.battery}%</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setIsManagerVisible(true)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center active:bg-slate-100 transition-colors">
                        <Settings className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex items-center justify-between gap-3">
                      {metrics.map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-center bg-slate-50/80 rounded-[16px] py-3 px-2">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <m.icon className={`w-4 h-4 ${m.colorClass}`} />
                            <span className="text-[12px] text-slate-500 font-medium">{m.label}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[18px] font-bold text-slate-800 tracking-tight">{m.value}</span>
                            <span className="text-[12px] text-slate-400 font-medium">{m.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Swiper.Item>
              );
            })}

            {/* 2. Render Pending Devices */}
            {pendingAssets.map(assetId => {
              const deviceDef = MEDICAL_DEVICES[assetId] || { name: '未知医疗设备', icon: Package };
              const DeviceIcon = deviceDef.icon;

              return (
                <Swiper.Item key={`pending-${assetId}`}>
                  <div className="pt-4 px-4 pb-8">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100/80">
                          <DeviceIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-bold text-slate-800 leading-tight">{deviceDef.name}</h3>
                          <p className="text-[12px] text-slate-500 mt-1">设备已在途中，预计 1-3 天送达</p>
                        </div>
                      </div>
                      <button onClick={() => navigate('/device-connect')} className="bg-blue-600 text-white text-[13px] font-bold px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">
                        去绑定
                      </button>
                    </div>

                    {/* Placeholder Metrics */}
                    <div className="flex items-center justify-between gap-3 opacity-60 grayscale">
                      {[
                        { label: '心率', icon: HeartPulse },
                        { label: '步数', icon: Footprints },
                        { label: '睡眠', icon: Moon }
                      ].map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-center bg-slate-50/80 rounded-[16px] py-3 px-2 border border-slate-100 border-dashed">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <m.icon className="w-4 h-4 text-slate-400" />
                            <span className="text-[12px] text-slate-400 font-medium">{m.label}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[18px] font-bold text-slate-300 tracking-tight">--</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Swiper.Item>
              );
            })}

            {/* 3. Add Device Card */}
            <Swiper.Item key="add-device">
              <div className="pt-4 px-4 pb-8">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 border-dashed">
                      <Plus className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-800 leading-tight">添加健康设备</h3>
                      <p className="text-[12px] text-slate-500 mt-1">授权同步基础体征，或接入高精度设备</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/device-connect')} className="bg-slate-800 text-white text-[13px] font-bold px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">
                    去添加
                  </button>
                </div>

                {/* Placeholder Features */}
                <div className="flex items-center justify-between gap-3">
                  {[
                    { label: '多端同步', icon: Smartphone, color: 'text-blue-500' },
                    { label: '医疗级', icon: Activity, color: 'text-emerald-500' },
                    { label: 'AI 预警', icon: BrainCircuit, color: 'text-indigo-500' }
                  ].map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[16px] py-3 px-2 border border-slate-100 border-dashed">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <m.icon className={`w-4 h-4 ${m.color}`} />
                      </div>
                      <span className="text-[12px] text-slate-500 font-medium">{m.label}</span>
                    </div>
                  ))}
                </div>
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
  }

  // State 3: Empty State (No devices, no purchases)
  return null;
};
