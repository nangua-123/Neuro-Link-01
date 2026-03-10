// File: src/views/Device/index.tsx
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, SafeArea, Modal } from 'antd-mobile';
import { HeartOutline } from 'antd-mobile-icons';
import { Bluetooth, Battery, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bluetoothService } from '../../services/bluetooth';
import { IoTDevice } from '../../interfaces/mall_device';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';

export default function DeviceView() {
  const navigate = useNavigate();
  const { identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;
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
      <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center p-6 text-white animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-600 opacity-50" />
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-8 relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          <HeartOutline fontSize={48} className="text-white" />
        </div>
        <h1 className="text-[28px] font-bold mb-4 tracking-tight text-center relative z-10">检测到持续异常放电</h1>
        <p className="text-[16px] text-white/90 text-center mb-12 leading-relaxed relative z-10">
          {isFamily ? '系统已自动通知其他紧急联系人' : '系统已自动通知紧急联系人'}<br/>并尝试呼叫 120
        </p>
        <button 
          onClick={() => setIsRecallTriggered(false)}
          className="w-full max-w-[280px] bg-white text-red-500 rounded-[24px] font-bold py-4 text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.1)] active:scale-95 transition-transform relative z-10"
        >
          {isFamily ? '长辈已安全 (解除警报)' : '我已安全 (解除警报)'}
        </button>
      </div>
    );
  }

  // 未连接态：极简 AirPods 级交互
  if (!device) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
        {/* 极浅弥散暖色渐变背景 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
          <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
          <NavBar 
            onBack={() => navigate(-1)} 
            backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
            className="font-medium text-slate-900"
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 relative z-10">
          <div className="relative mb-12">
            {/* 呼吸光晕效果 */}
            <div className={`absolute inset-0 bg-blue-500/20 rounded-full scale-150 ${isConnecting ? 'animate-ping' : 'animate-pulse'}`} />
            <div className="relative w-32 h-32 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center z-10 border border-slate-100/50">
              <Bluetooth size={48} className={isConnecting ? 'text-blue-600 animate-bounce' : 'text-blue-600'} />
            </div>
          </div>
          
          <h2 className="text-[22px] font-semibold text-slate-900 mb-3 tracking-tight">靠近设备以连接</h2>
          <p className="text-[14px] text-slate-500 text-center mb-12 leading-relaxed">请确保您的 Neuro-Band 手环电量充足<br/>并靠近手机</p>
          
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-[200px] rounded-[24px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 shadow-[0_8px_24px_rgba(79,70,229,0.25)] active:scale-95 transition-transform flex items-center justify-center disabled:opacity-70"
          >
            {isConnecting ? '连接中...' : '点击连接'}
          </button>
        </div>
      </div>
    );
  }

  // 已连接态：夜间静谧看板 (深色模式)
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <NavBar 
        onBack={() => navigate(-1)} 
        backArrow={<ChevronLeft className="w-6 h-6 text-white/80" />}
        right={<span onClick={handleDisconnect} className="text-[13px] text-white/50 active:text-white/80 transition-colors">断开</span>}
        className="bg-transparent border-none font-medium tracking-wide"
        style={{ '--title-color': '#fff' } as any}
      >
        夜间体征看板
      </NavBar>
      
      <div className="flex-1 p-5 overflow-y-auto">
        {/* 设备状态头部 */}
        <div className="flex justify-between items-center mb-6 bg-[#141414] p-4 rounded-[24px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Bluetooth className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <div className="text-[15px] font-medium text-white/90 tracking-wide">{device.deviceName}</div>
              <div className="text-[11px] text-white/40 font-mono mt-0.5">{device.macAddress}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <Battery size={14} />
            <span className="text-[12px] font-mono font-medium">{device.batteryLevel}%</span>
          </div>
        </div>

        {/* 核心监测数据网格 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#141414] p-5 rounded-[24px] border border-white/5 flex flex-col justify-between aspect-square shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-500/5 rounded-full blur-xl" />
            <div className="text-[13px] text-white/50 flex items-center gap-1.5 font-medium relative z-10">
              <HeartOutline className="text-rose-500 text-lg" /> 实时心率
            </div>
            <div className="flex items-baseline gap-1 mt-auto relative z-10">
              <span className="text-[48px] font-light font-mono text-white tracking-tighter">68</span>
              <span className="text-[13px] text-white/40 font-medium">bpm</span>
            </div>
          </div>
          <div className="bg-[#141414] p-5 rounded-[24px] border border-white/5 flex flex-col justify-between aspect-square shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
            <div className="text-[13px] text-white/50 font-medium relative z-10 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 血氧饱和度
            </div>
            <div className="flex items-baseline gap-1 mt-auto relative z-10">
              <span className="text-[48px] font-light font-mono text-emerald-400 tracking-tighter">98</span>
              <span className="text-[13px] text-white/40 font-medium">%</span>
            </div>
          </div>
        </div>

        {/* 脑电波趋势 (占位) */}
        <div className="bg-[#141414] p-5 rounded-[24px] border border-white/5 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
          <div className="text-[13px] text-white/50 font-medium mb-4 relative z-10">实时脑电活动 (EEG)</div>
          <div className="h-28 w-full flex items-center justify-center border border-dashed border-white/10 rounded-[16px] relative z-10 bg-black/20">
            <span className="text-[12px] text-white/30 font-mono tracking-widest">EEG Signal Streaming...</span>
          </div>
        </div>

        <div className="text-center text-[11px] text-white/30 mt-8 leading-relaxed font-medium">
          系统正在持续监测{isFamily ? '长辈' : '您'}的体征数据<br/>如遇极端情况将自动触发熔断报警
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
