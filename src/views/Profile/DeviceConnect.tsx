import React, { useState } from 'react';
import { NavBar, SafeArea, Popup, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Smartphone, Watch, Activity, Heart, ShoppingBag, Bluetooth, ShieldCheck, FileText, BrainCircuit, Moon } from 'lucide-react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

const medicalDevices = [
  {
    id: 'neuro_band',
    name: 'Neuro-Band Pro 预警手环',
    desc: '支持异常脑电与抽搐高精度识别',
    tags: [DiseaseTag.EPILEPSY],
    icon: Watch,
  },
  {
    id: 'eeg_patch',
    name: '动态脑电贴 (24h)',
    desc: '医疗级长程脑电监测',
    tags: [DiseaseTag.EPILEPSY],
    icon: Activity,
  },
  {
    id: 'bci_headband',
    name: 'BCI 认知训练头环',
    desc: '精准采集认知波段，辅助数字疗法',
    tags: [DiseaseTag.AD],
    icon: BrainCircuit,
  },
  {
    id: 'sleep_monitor',
    name: '医用级睡眠分期仪',
    desc: '深度睡眠结构分析与呼吸暂停监测',
    tags: [DiseaseTag.AD, DiseaseTag.MIGRAINE],
    icon: Moon,
  }
];

export default function DeviceConnectView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag, connectDevice, bindDevice, purchasedAssets, ownedEquipments, activateAsset, connectedDevices } = useAppStore();
  
  const [pairingDevice, setPairingDevice] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleDeviceClick = (device: any) => {
    // Check if it's a medical device and not purchased
    const isMedicalDevice = medicalDevices.some(d => d.id === device.id);
    const isOwned = ownedEquipments.includes(device.id);
    
    if (isMedicalDevice && !isOwned) {
      Toast.show({
        content: '尚未获取该设备，请先前往商城了解或购买',
        icon: 'fail',
        duration: 2000,
      });
      setTimeout(() => {
        navigate(`/equipments/${device.id}`);
      }, 1000);
      return;
    }

    setPairingDevice(device);
    // 模拟蓝牙搜索 2 秒后弹出授权协议
    setTimeout(() => {
      setShowAuthModal(true);
    }, 2000);
  };

  const handleAgreeAndBind = () => {
    if (pairingDevice) {
      connectDevice({
        id: pairingDevice.id,
        name: pairingDevice.name,
        type: 'hardware',
        status: '已连接 · 信号极佳',
        syncTime: '刚刚同步',
        battery: 85
      });
      bindDevice();
      
      // If this was a purchased asset, activate it
      if (purchasedAssets.includes(pairingDevice.id)) {
        activateAsset(pairingDevice.id);
      }
    }
    setShowAuthModal(false);
    setPairingDevice(null);
    navigate('/manager', { replace: true });
  };

  const healthApps = [
    { id: 'apple', name: 'Apple Health', icon: Heart, color: 'text-rose-500', bgColor: 'bg-rose-50' },
    { id: 'huawei', name: '华为运动健康', icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 'xiaomi', name: '小米健康', icon: Smartphone, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'oppo', name: 'OPPO 健康', icon: Heart, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  ];

  const availableHealthApps = healthApps.filter(app => !connectedDevices.some(cd => cd.id === app.id));

  // 过滤出当前病种推荐的设备，如果没有特定病种，则展示全部
  const recommendedDevices = selectedDiseaseTag && selectedDiseaseTag !== DiseaseTag.NONE
    ? medicalDevices.filter(d => d.tags.includes(selectedDiseaseTag))
    : medicalDevices;

  const pendingDevices = medicalDevices.filter(d => purchasedAssets.includes(d.id));
  const otherRecommendedDevices = recommendedDevices.filter(d => !purchasedAssets.includes(d.id) && !connectedDevices.some(cd => cd.id === d.id));

  return (
    <div className="max-w-md mx-auto h-full overflow-y-auto hide-scrollbar bg-[#F8FAFC] shadow-2xl relative flex flex-col">
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-100/50">
        <NavBar 
          onBack={() => navigate(-1)}
          backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        >
          <span className="font-medium text-slate-900">添加健康数据</span>
        </NavBar>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        {/* 通用健康应用 */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">健康应用</h2>
            <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
              如果您已有智能手表/手环，可直接授权同步基础体征，无需额外购买。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {availableHealthApps.length > 0 ? availableHealthApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/device-auth/${app.id}`)}
                className="bg-white rounded-3xl p-4 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 active:scale-95 transition-transform cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-10 h-10 rounded-full ${app.bgColor} flex items-center justify-center shrink-0 relative z-10`}>
                  <app.icon className={`w-5 h-5 ${app.color}`} />
                </div>
                <span className="text-[14px] font-semibold text-slate-800 relative z-10">{app.name}</span>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center text-slate-400 text-[13px] py-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                已连接所有支持的健康应用
              </div>
            )}
          </div>
        </div>

        {/* 专病医疗级器械 */}
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">医疗级器械</h2>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                华西专病定制，提供医疗级高精度体征监测。
              </p>
            </div>
            {selectedDiseaseTag && selectedDiseaseTag !== DiseaseTag.NONE && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
                专病推荐
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {/* 待激活的已购设备置顶显示 */}
            {pendingDevices.map((device, index) => (
              <motion.div
                key={`pending-${device.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleDeviceClick(device)}
                className="bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-3xl p-4 flex items-center justify-between shadow-[0_4px_20px_rgba(59,130,246,0.08)] border border-blue-200/60 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-blue-100 shrink-0 shadow-sm relative">
                    <device.icon className="w-6 h-6 text-blue-600" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[15px] font-bold text-slate-900">{device.name}</h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">待连接</span>
                    </div>
                    <p className="text-[12px] text-slate-500 line-clamp-1">您的设备已就绪，点击一键直连</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-full shadow-sm relative z-10 shrink-0">
                  立即连接
                </button>
              </motion.div>
            ))}

            {/* 其他推荐设备 */}
            {otherRecommendedDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => handleDeviceClick(device)}
                className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                    <device.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">{device.name}</h3>
                    <p className="text-[12px] text-slate-500 line-clamp-1">{device.desc}</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-300 rotate-180 shrink-0 relative z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部引导舱 */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent z-10">
        <div className="bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-blue-100/50 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">暂无专属设备？</h4>
            <p className="text-[11px] text-slate-500 font-medium">华西定制专病硬件，支持按月租赁</p>
          </div>
          <button 
            onClick={() => navigate('/equipments')}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-1 active:bg-blue-100 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            去商城
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>

      {/* 蓝牙配对与 JIT 授权拦截 Modal */}
      <Popup
        visible={!!pairingDevice}
        onMaskClick={() => {
          if (!showAuthModal) setPairingDevice(null);
        }}
        bodyStyle={{
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          minHeight: '50vh',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="p-8 flex flex-col items-center relative overflow-hidden min-h-[50vh]">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-10" />
          
          <AnimatePresence mode="wait">
            {!showAuthModal ? (
              <motion.div 
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center w-full flex-1"
              >
                {/* 蓝牙波纹搜索动效 */}
                <div className="relative mb-10 flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-20 h-20 bg-blue-500 rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.8, 2.2], opacity: [0.8, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    className="absolute w-20 h-20 bg-blue-400 rounded-full"
                  />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-[0_8px_30px_rgba(59,130,246,0.3)] flex items-center justify-center z-10">
                    <Bluetooth className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-[20px] font-bold text-slate-900 mb-2 tracking-tight">正在寻找设备...</h3>
                <p className="text-[14px] text-slate-500 font-medium">请将 {pairingDevice?.name} 靠近手机</p>
              </motion.div>
            ) : (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col w-full"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-[22px] font-bold text-slate-900 mb-3 text-center tracking-tight">三方电子联合数据授权</h2>
                <p className="text-[14px] text-slate-500 mb-6 text-center leading-relaxed">
                  为提供精准的 AI 预警与专病分析服务，我们需要获取您的设备体征数据（包含心率、血氧、脑电波等）。
                </p>
                
                <div className="bg-slate-50 rounded-[16px] p-4 mb-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-[13px] font-medium text-slate-700">授权内容包含：</span>
                  </div>
                  <ul className="text-[12px] text-slate-500 space-y-2 pl-8 list-disc">
                    <li>24小时连续体征数据采集</li>
                    <li>AI 算法云端分析与建模</li>
                    <li>紧急情况下的医疗联动共享</li>
                  </ul>
                </div>

                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleAgreeAndBind}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-[24px] font-medium text-[16px] shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-95 transition-transform"
                  >
                    同意授权并绑定
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      setPairingDevice(null);
                    }}
                    className="w-full py-4 bg-white text-slate-500 rounded-[24px] font-medium text-[15px] active:bg-slate-50 transition-colors"
                  >
                    暂不授权
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Popup>
    </div>
  );
}

// Simple inline icons for specific medical devices
function BrainIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  );
}

function MoonIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}
