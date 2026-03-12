import React from 'react';
import { NavBar, SafeArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Smartphone, Watch, Activity, Heart, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

export default function DeviceConnectView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();

  const healthApps = [
    { id: 'apple', name: 'Apple Health', icon: Heart, color: 'text-rose-500', bgColor: 'bg-rose-50' },
    { id: 'huawei', name: '华为运动健康', icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 'xiaomi', name: '小米健康', icon: Smartphone, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'oppo', name: 'OPPO 健康', icon: Heart, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  ];

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
      icon: BrainIcon,
    },
    {
      id: 'sleep_monitor',
      name: '医用级睡眠分期仪',
      desc: '深度睡眠结构分析与呼吸暂停监测',
      tags: [DiseaseTag.AD, DiseaseTag.MIGRAINE],
      icon: MoonIcon,
    }
  ];

  // 过滤出当前病种推荐的设备，如果没有特定病种，则展示全部
  const recommendedDevices = selectedDiseaseTag && selectedDiseaseTag !== DiseaseTag.NONE
    ? medicalDevices.filter(d => d.tags.includes(selectedDiseaseTag))
    : medicalDevices;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
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
            {healthApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/device-auth/${app.id}`)}
                className="bg-white rounded-[20px] p-4 flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/80 active:scale-95 transition-transform cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full ${app.bgColor} flex items-center justify-center shrink-0`}>
                  <app.icon className={`w-5 h-5 ${app.color}`} />
                </div>
                <span className="text-[14px] font-semibold text-slate-800">{app.name}</span>
              </motion.div>
            ))}
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
            {recommendedDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/80 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                    <device.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">{device.name}</h3>
                    <p className="text-[12px] text-slate-500 line-clamp-1">{device.desc}</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-300 rotate-180 shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部引导舱 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent z-10">
        <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-blue-100/50 flex items-center justify-between">
          <div>
            <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">暂无专属设备？</h4>
            <p className="text-[11px] text-slate-500 font-medium">华西定制专病硬件，支持按月租赁</p>
          </div>
          <button 
            onClick={() => navigate('/mall')}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-1 active:bg-blue-100 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            去商城
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>
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
