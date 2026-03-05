import React, { useState, useMemo } from 'react';
import { NavBar, Toast, Popup, SafeArea } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { Check, Shield, Zap, Watch, Brain, Bluetooth, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PackageInfo {
  id: string;
  title: string;
  price: number;
  duration: string;
  hardware: string;
  features: string[];
  tag: DiseaseTag;
  theme: 'blue' | 'indigo';
  icon: React.ElementType;
}

const PACKAGES: PackageInfo[] = [
  {
    id: 'pkg_epilepsy',
    title: '癫痫生命守护包',
    price: 599,
    duration: '年',
    hardware: 'Neuro-Band Pro (长虹医疗定制版)',
    features: [
      '订阅即免费配发智能手环',
      '7x24 小时异常放电预警与自动呼救',
      '专属神经内科管家 1V1',
      'AI 脑电波趋势月度分析报告'
    ],
    tag: DiseaseTag.EPILEPSY,
    theme: 'blue',
    icon: Zap
  },
  {
    id: 'pkg_ad',
    title: '大脑 4S 店护航包',
    price: 365,
    duration: '年',
    hardware: 'BCI 脑机接口训练头环',
    features: [
      '配套 BCI 脑机接口训练头环使用权',
      '每日认知 DTx 游戏解锁',
      '月度防衰退报告',
      '专属认知康复师在线指导'
    ],
    tag: DiseaseTag.AD,
    theme: 'indigo',
    icon: Brain
  }
];

export default function MallView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag, bindDevice, isDeviceBound } = useAppStore();
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const [showBindModal, setShowBindModal] = useState(false);
  const [isBinding, setIsBinding] = useState(false);

  // Sort packages to put the matching one first
  const sortedPackages = useMemo(() => {
    const match = PACKAGES.find(p => p.tag === selectedDiseaseTag);
    const others = PACKAGES.filter(p => p.tag !== selectedDiseaseTag);
    return match ? [match, ...others] : PACKAGES;
  }, [selectedDiseaseTag]);

  const handleSubscribe = (pkgId: string) => {
    setIsSubscribing(pkgId);
    setTimeout(() => {
      setIsSubscribing(null);
      Toast.show({
        content: '支付成功，硬件已安排发货',
        icon: 'success',
        duration: 2000,
      });
      // Simulate device discovery after a short delay
      setTimeout(() => {
        setShowBindModal(true);
      }, 1000);
    }, 1500);
  };

  const handleBind = () => {
    setIsBinding(true);
    setTimeout(() => {
      setIsBinding(false);
      bindDevice();
      setShowBindModal(false);
      Toast.show({
        content: '绑定成功，已开启 24 小时守护',
        icon: 'success',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-24">
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100/50">
        <NavBar onBack={() => navigate(-1)}>
          <span className="font-medium text-slate-800">服务商城</span>
        </NavBar>
      </div>

      <div className="p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">专病生命守护服务</h1>
          <p className="text-sm text-slate-500">软硬一体化闭环，全天候医疗级护航</p>
        </div>

        <div className="space-y-6">
          {sortedPackages.map((pkg, index) => {
            const isMatch = index === 0 && pkg.tag === selectedDiseaseTag;
            const isBlue = pkg.theme === 'blue';
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80"
              >
                {isMatch && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl z-10 tracking-wider">
                    推荐匹配
                  </div>
                )}

                {/* Header Section */}
                <div className={`p-8 relative overflow-hidden ${isBlue ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  
                  <div className="relative z-10 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                        <pkg.icon className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight">{pkg.title}</h2>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-sm opacity-80">¥</span>
                      <span className="text-4xl font-bold tracking-tight">{pkg.price}</span>
                      <span className="text-sm opacity-80">/{pkg.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBlue ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      <Watch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">配套硬件</div>
                      <div className="text-sm font-semibold text-slate-900">{pkg.hardware}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isBlue ? 'bg-blue-50 text-blue-500' : 'bg-indigo-50 text-indigo-500'}`}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-slate-600 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(pkg.id)}
                    disabled={isSubscribing !== null}
                    className={`w-full py-4 rounded-2xl font-medium text-[15px] tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                      isBlue 
                        ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]' 
                        : 'bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.2)]'
                    }`}
                  >
                    {isSubscribing === pkg.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        立即订阅
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* IoT Binding Modal (AirPods Style) */}
      <Popup
        visible={showBindModal}
        onMaskClick={() => !isBinding && setShowBindModal(false)}
        bodyStyle={{
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          minHeight: '50vh',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="p-8 flex flex-col items-center relative overflow-hidden">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-10" />
          
          <AnimatePresence mode="wait">
            {!isBinding ? (
              <motion.div 
                key="discovery"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center w-full"
              >
                {/* Device Image/Icon with pulsing background */}
                <div className="relative mb-8">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-400 rounded-full blur-xl"
                  />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full shadow-xl border border-white flex items-center justify-center z-10">
                    <Watch className="w-16 h-16 text-slate-800" strokeWidth={1.5} />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                      <Bluetooth className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">Neuro-Band Pro</h2>
                <p className="text-sm text-slate-500 text-center mb-10 px-4 leading-relaxed">
                  检测到您的专属穿戴设备已开机，是否立即绑定以开启 24 小时生命体征守护？
                </p>

                <div className="w-full space-y-3">
                  <button
                    onClick={handleBind}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-medium text-[15px] shadow-[0_8px_20px_rgba(37,99,235,0.2)] active:scale-95 transition-transform"
                  >
                    立即绑定
                  </button>
                  <button
                    onClick={() => setShowBindModal(false)}
                    className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-medium text-[15px] active:scale-95 transition-transform"
                  >
                    稍后设置
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="binding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 w-full"
              >
                <div className="relative w-24 h-24 mb-8">
                  <svg className="animate-spin w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bluetooth className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">正在建立加密连接...</h3>
                <p className="text-sm text-slate-500">请保持设备靠近手机</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Popup>
    </div>
  );
}
