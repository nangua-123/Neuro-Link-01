import React from 'react';
import { Popup, Button, Toast } from 'antd-mobile';
import { Watch, Battery, Bluetooth, AlertCircle, Smartphone } from 'lucide-react';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

interface DeviceManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DeviceManagerModal: React.FC<DeviceManagerModalProps> = ({ visible, onClose }) => {
  const { connectedDevices, disconnectDevice } = useAppStore();
  const navigate = useNavigate();

  const handleDisconnect = (deviceId: string, deviceName: string) => {
    disconnectDevice(deviceId);
    Toast.show({ content: `已断开 ${deviceName}`, icon: 'success' });
    if (connectedDevices.length <= 1) {
      onClose();
    }
  };

  const handleAddDevice = () => {
    onClose();
    navigate('/device-connect');
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px',
        backgroundColor: '#F8FAFC',
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">智能设备管理</h2>
          <div className="text-[13px] text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            已连接 {connectedDevices.length} 台
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto space-y-3 hide-scrollbar">
          {connectedDevices.map((device) => {
            const isPhone = ['apple', 'huawei', 'xiaomi', 'oppo'].includes(device.id);
            const DeviceIcon = isPhone ? Smartphone : Watch;

            return (
              <div key={device.id} className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative border border-blue-100/50">
                    <DeviceIcon className="w-6 h-6 text-blue-600" />
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">{device.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                        已连接
                      </span>
                      {!isPhone && (
                        <span className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
                          <Battery className="w-3 h-3" /> {device.battery || 100}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDisconnect(device.id, device.name)}
                  className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center active:bg-rose-100 transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </button>
              </div>
            );
          })}

          {connectedDevices.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-[14px]">
              暂无已连接的设备
            </div>
          )}
        </div>

        <Button 
          block 
          color="primary"
          className="h-12 rounded-full font-bold text-[15px] shadow-lg shadow-blue-200 mt-2"
          onClick={handleAddDevice}
        >
          添加新设备
        </Button>
      </div>
    </Popup>
  );
};
