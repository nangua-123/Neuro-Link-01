import React from 'react';
import { Bluetooth, BatteryMedium, RefreshCw } from 'lucide-react';
import { useDeviceStore } from '../../../store/useDeviceStore';
import { DeviceStatus } from '../../../interfaces/device';
import { CapsuleButton } from '../../../components/common/CapsuleButton';

export const DeviceBanner: React.FC = () => {
  const { deviceStatus, requireAuth, setDeviceStatus } = useDeviceStore();

  const handleSync = () => {
    requireAuth(() => {
      setDeviceStatus(DeviceStatus.SYNCING);
      setTimeout(() => {
        setDeviceStatus(DeviceStatus.CONNECTED);
      }, 2000);
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* 柔和的蓝牙图标容器 */}
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 relative">
          <Bluetooth size={24} />
          {deviceStatus === DeviceStatus.CONNECTED && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Neuro-Band Pro</h2>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
            {deviceStatus === DeviceStatus.CONNECTED ? (
              <>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>已连接 · 信号极佳</span>
              </>
            ) : deviceStatus === DeviceStatus.SYNCING ? (
              <>
                <span className="flex items-center"><RefreshCw size={10} className="animate-spin mr-1.5" />正在同步数据...</span>
              </>
            ) : (
              <>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"></span>未连接</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        {deviceStatus === DeviceStatus.CONNECTED || deviceStatus === DeviceStatus.SYNCING ? (
          <>
            <div className="flex items-center text-emerald-500 text-xs font-medium">
              <BatteryMedium size={14} className="mr-1" />
              85%
            </div>
            <button 
              onClick={handleSync}
              className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
              disabled={deviceStatus === DeviceStatus.SYNCING}
            >
              {deviceStatus === DeviceStatus.SYNCING ? '同步中...' : '刚刚同步'}
            </button>
          </>
        ) : (
          <CapsuleButton size="sm" onClick={handleSync}>
            {deviceStatus === DeviceStatus.DISCONNECTED ? '重新连接' : '一键绑定'}
          </CapsuleButton>
        )}
      </div>
    </div>
  );
};
