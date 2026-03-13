import React from 'react';
import { Bluetooth, BatteryMedium, RefreshCw, Smartphone } from 'lucide-react';
import { useAppStore, ConnectedDevice } from '../../../store';
import { CapsuleButton } from '../../../components/common/CapsuleButton';

interface DeviceBannerProps {
  device: ConnectedDevice;
}

export const DeviceBanner: React.FC<DeviceBannerProps> = ({ device }) => {
  const { disconnectDevice } = useAppStore();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        {/* 柔和的图标容器 */}
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 relative">
          {device.type === 'app' ? <Smartphone size={24} /> : <Bluetooth size={24} />}
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">{device.name}</h2>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>{device.status}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        {device.battery !== undefined && (
          <div className="flex items-center text-emerald-500 text-xs font-medium">
            <BatteryMedium size={14} className="mr-1" />
            {device.battery}%
          </div>
        )}
        <div className="text-xs text-slate-400">
          {device.syncTime}
        </div>
      </div>
    </div>
  );
};
