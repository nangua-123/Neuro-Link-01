import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Plus, 
  Watch, 
  HeartPulse, 
  Moon, 
  BrainCircuit,
  ChevronRight,
  Smartphone,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Swiper } from 'antd-mobile';
import { DiseaseTag } from '../../configs/constants';
import { DeviceManagerModal } from '../DeviceManagerModal';
import { UserIdentity } from '../../interfaces/user';

const getDeviceMetrics = (device: any, vitals: any) => {
  if (['apple', 'huawei', 'xiaomi', 'oppo'].includes(device.id)) {
    return [
      { label: '心率', value: vitals.heartRate || 72, unit: 'bpm', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-50' },
      { label: '步数', value: vitals.steps || 6500, unit: '步', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-50' },
      { label: '消耗', value: vitals.calories || 320, unit: 'kcal', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-50' },
    ];
  }
  if (device.id === 'neuro_band' || device.id === 'eeg_patch') {
    return [
      { label: '脑电平稳', value: vitals.eegStability, unit: '分', icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: 'HRV', value: vitals.hrv, unit: 'ms', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
      { label: '深睡比例', value: vitals.deepSleepRatio, unit: '%', icon: Moon, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];
  }
  if (device.id === 'bci_headband') {
    return [
      { label: '认知专注', value: 85, unit: '分', icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: '脑电平稳', value: vitals.eegStability, unit: '分', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: 'HRV', value: vitals.hrv, unit: 'ms', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];
  }
  if (device.id === 'sleep_monitor') {
    return [
      { label: '深睡比例', value: vitals.deepSleepRatio, unit: '%', icon: Moon, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: '睡眠得分', value: 92, unit: '分', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: '呼吸暂停', value: 0, unit: '次', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];
  }
  // Default fallback
  return [
    { label: 'HRV', value: vitals.hrv, unit: 'ms', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: '深睡比例', value: vitals.deepSleepRatio, unit: '%', icon: Moon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: '脑电平稳', value: vitals.eegStability, unit: '分', icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];
};

export default function IoTDashboardCard() {
  const navigate = useNavigate();
  const { connectedDevices, vitals, selectedDiseaseTag, identity } = useAppStore();
  const isBound = connectedDevices.length > 0;
  const [isManagerVisible, setIsManagerVisible] = useState(false);
  const isFamily = identity === UserIdentity.FAMILY;

  const handleBindDevice = () => {
    navigate('/device-connect');
  };

  const renderWarning = () => {
    if (selectedDiseaseTag === DiseaseTag.EPILEPSY && vitals.deepSleepRatio < 30) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-rose-50/80 rounded-[16px] p-3 border border-rose-100/50 flex items-start gap-2.5"
        >
          <div className="w-6 h-6 rounded-full bg-rose-100/80 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-rose-700">睡眠剥夺预警</h4>
            <p className="text-[11px] text-rose-600/80 mt-0.5 leading-relaxed">
              昨夜深睡比例偏低 ({vitals.deepSleepRatio}%)，睡眠不足可能诱发癫痫发作，请注意{isFamily ? '长辈' : '您'}的休息并避免过度劳累。
            </p>
          </div>
        </motion.div>
      );
    }
    if (selectedDiseaseTag === DiseaseTag.MIGRAINE && vitals.hrv < 45) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-orange-50/80 rounded-[16px] p-3 border border-orange-100/50 flex items-start gap-2.5"
        >
          <div className="w-6 h-6 rounded-full bg-orange-100/80 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-orange-700">压力水平偏高</h4>
            <p className="text-[11px] text-orange-600/80 mt-0.5 leading-relaxed">
              当前 HRV 偏低 ({vitals.hrv}ms)，交感神经较为活跃，可能诱发偏头痛，建议{isFamily ? '长辈' : '您'}进行放松训练。
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  if (!isBound) {
    // ==========================================
    // 状态一：未绑定（紧凑诱饵态）
    // ==========================================
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleBindDevice}
        className="bg-gradient-to-r from-blue-50/50 to-blue-50/50 rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(37,99,235,0.05)] border border-blue-100/50 cursor-pointer relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-[14px] bg-white text-blue-500 flex items-center justify-center shadow-sm border border-blue-50">
            <Watch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800">绑定智能穿戴设备</h4>
            <p className="text-[12px] text-slate-500 mt-0.5">开启 24h 脑电与体征监测</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm relative z-10">
          <ChevronRight className="w-4 h-4 text-blue-500" />
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 状态二：已绑定（数据赋能态，支持多设备轮播）
  // ==========================================
  return (
    <>
      <div className="relative rounded-[24px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 overflow-hidden">
        <Swiper 
          indicatorProps={{
            color: 'primary',
          }}
          style={{
            '--border-radius': '24px',
          } as any}
        >
          {[
            ...connectedDevices.map((device) => {
              const metrics = getDeviceMetrics(device, vitals);
              const DeviceIcon = ['apple', 'huawei', 'xiaomi', 'oppo'].includes(device.id) ? Smartphone : Watch;

              return (
                <Swiper.Item key={device.id}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5"
                  >
                    {/* 顶部设备状态栏 */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <DeviceIcon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900">{device.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="text-[10px] text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 border border-emerald-100/50">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              同步中
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">电量 {device.battery || 100}%</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsManagerVisible(true)}
                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center active:bg-slate-100 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    {/* 核心体征数据网格 */}
                    <div className="grid grid-cols-3 gap-3">
                      {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-white rounded-[16px] p-3.5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
                          <div className={`absolute -right-2 -top-2 w-12 h-12 ${metric.bg} rounded-full blur-xl opacity-50 pointer-events-none`} />
                          <div className="flex items-center gap-1.5 text-slate-500 mb-2 relative z-10">
                            <metric.icon className={`w-3.5 h-3.5 ${metric.color}`} />
                            <span className="text-[11px] font-medium">{metric.label}</span>
                          </div>
                          <div className="flex items-baseline gap-1 relative z-10">
                            <span className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">{metric.value}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{metric.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 疾病专属预警 */}
                    {renderWarning()}
                  </motion.div>
                </Swiper.Item>
              );
            }),
            
            /* 允许用户继续添加设备的卡片 */
            <Swiper.Item key="add-more">
              <div 
                onClick={handleBindDevice}
                className="p-5 h-full flex flex-col items-center justify-center cursor-pointer group min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-active:scale-95 transition-transform">
                  <Plus className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-[14px] font-bold text-slate-900">添加更多设备</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium text-center">
                  连接更多健康应用或医疗器械<br/>获取更全面的体征数据
                </p>
              </div>
            </Swiper.Item>
          ]}
        </Swiper>
      </div>

      <DeviceManagerModal 
        visible={isManagerVisible} 
        onClose={() => setIsManagerVisible(false)} 
      />
    </>
  );
}
