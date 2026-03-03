// File: src/views/Device/index.tsx
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, SafeArea, Modal } from 'antd-mobile';
import { HeartOutline } from 'antd-mobile-icons';
import { Bluetooth, Battery } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bluetoothService } from '../../services/bluetooth';
import { IoTDevice } from '../../interfaces/mall_device';

export default function DeviceView() {
  const navigate = useNavigate();
  const [device, setDevice] = useState<IoTDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecallTriggered, setIsRecallTriggered] = useState(false);

  // 模拟全局熔断总线
  const triggerRecall = () => {
    setIsRecallTriggered(true);
    // 震动反馈 (如果设备支持)
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 1000]);
    }
  };

  useEffect(() => {
    // 组件卸载时断开连接并停止监测
    return () => {
      if (device) {
        bluetoothService.disconnect();
      }
    };
  }, [device]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const connectedDevice = await bluetoothService.scanAndConnect();
      setDevice(connectedDevice);
      Toast.show({ icon: 'success', content: '连接成功' });
      
      // 连接成功后，自动开启夜间被动熔断监测
      bluetoothService.startNightMonitoring(() => {
        triggerRecall();
      });
    } catch (error: any) {
      Toast.show({ 
        icon: 'fail', 
        content: error.message || '连接失败，请重试',
        duration: 3000
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    Modal.confirm({
      content: '确定要断开连接吗？断开后将无法进行夜间体征监测。',
      onConfirm: () => {
        bluetoothService.disconnect();
        setDevice(null);
        setIsRecallTriggered(false);
      },
    });
  };

  // 致命红线：全局熔断报警态
  if (isRecallTriggered) {
    return (
      <div className="min-h-screen bg-[#FF3141] flex flex-col items-center justify-center p-6 text-white animate-pulse">
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-8">
          <HeartOutline fontSize={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4 tracking-tight text-center">检测到持续异常放电</h1>
        <p className="text-lg text-white/90 text-center mb-12 leading-relaxed">
          系统已自动通知紧急联系人<br/>并尝试呼叫 120
        </p>
        <Button 
          block 
          size="large" 
          onClick={() => setIsRecallTriggered(false)}
          style={{ backgroundColor: 'white', color: '#FF3141', border: 'none' }}
          className="rounded-xl font-bold h-14"
        >
          我已安全 (解除警报)
        </Button>
      </div>
    );
  }

  // 未连接态：极简 AirPods 级交互
  if (!device) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar onBack={() => navigate(-1)} className="bg-transparent border-none" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
          <div className="relative mb-12">
            {/* 呼吸光晕效果 */}
            <div className={`absolute inset-0 bg-[#1677FF]/20 rounded-full scale-150 ${isConnecting ? 'animate-ping' : 'animate-pulse'}`} />
            <div className="relative w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
              <Bluetooth size={48} className={isConnecting ? 'text-[#1677FF] animate-bounce' : 'text-[#1677FF]'} />
            </div>
          </div>
          
          <h2 className="text-xl font-medium text-gray-900 mb-2">靠近设备以连接</h2>
          <p className="text-sm text-gray-500 text-center mb-12">请确保您的 Neuro-Band 手环电量充足<br/>并靠近手机</p>
          
          <Button 
            color="primary" 
            shape="rounded" 
            loading={isConnecting}
            onClick={handleConnect}
            className="w-48 h-12 font-medium shadow-md"
          >
            点击连接
          </Button>
        </div>
      </div>
    );
  }

  // 已连接态：夜间静谧看板 (深色模式)
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <NavBar 
        onBack={() => navigate(-1)} 
        right={<span onClick={handleDisconnect} className="text-xs text-gray-400">断开</span>}
        className="bg-transparent border-none"
        style={{ color: '#fff' } as React.CSSProperties}
      >
        夜间体征看板
      </NavBar>
      
      <div className="flex-1 p-5 overflow-y-auto">
        {/* 设备状态头部 */}
        <div className="flex justify-between items-center mb-8 bg-[#141414] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1677FF]/20 flex items-center justify-center">
              <Bluetooth className="text-[#1677FF]" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/90">{device.deviceName}</div>
              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{device.macAddress}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Battery size={16} />
            <span className="text-xs font-mono">{device.batteryLevel}%</span>
          </div>
        </div>

        {/* 核心监测数据网格 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 flex flex-col justify-between aspect-square">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <HeartOutline className="text-rose-500" /> 实时心率
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-4xl font-light font-mono text-white">68</span>
              <span className="text-xs text-gray-500">bpm</span>
            </div>
          </div>
          <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 flex flex-col justify-between aspect-square">
            <div className="text-xs text-gray-400">血氧饱和度</div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-4xl font-light font-mono text-emerald-400">98</span>
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* 脑电波趋势 (占位) */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 mb-6">
          <div className="text-xs text-gray-400 mb-4">实时脑电活动 (EEG)</div>
          <div className="h-24 w-full flex items-center justify-center border border-dashed border-white/10 rounded-lg">
            <span className="text-xs text-gray-600">EEG Signal Streaming...</span>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-500 mt-8">
          系统正在持续监测您的体征数据<br/>如遇极端情况将自动触发熔断报警
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
