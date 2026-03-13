import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { IdentitySwitcher } from './components/IdentitySwitcher';
import { DeviceBanner } from './components/DeviceBanner';
import { DashboardGrid } from './components/DashboardGrid';
import { useDeviceStore } from '../../store/useDeviceStore';
import { useAppStore } from '../../store';
import { CapsuleButton } from '../../components/common/CapsuleButton';
import { DeviceStatus } from '../../interfaces/device';
import { useNavigate } from 'react-router-dom';

export const DeviceManagement: React.FC = () => {
  const { showAuthModal, setShowAuthModal, setHasSignedAgreement } = useDeviceStore();
  const { connectedDevices, disconnectDevice } = useAppStore();
  const [toastMsg, setToastMsg] = React.useState('');
  const navigate = useNavigate();

  const handleSignAgreement = () => {
    setHasSignedAgreement(true);
    setShowAuthModal(false);
  };

  return (
    <div className="max-w-md mx-auto h-screen overflow-y-auto bg-slate-50 font-sans relative shadow-2xl">
      {/* 柔和的全局背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-slate-50/50 to-slate-50 pointer-events-none"></div>
      
      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-5 pt-12 pb-4">
        <button 
          onClick={() => navigate('/')}
          className="relative z-50 w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} className="pointer-events-none" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">智能设备管理</h1>
        {connectedDevices.length > 0 ? (
          <button 
            onClick={() => {
              connectedDevices.forEach(d => disconnectDevice(d.id));
              setToastMsg('设备已断开');
              setTimeout(() => setToastMsg(''), 2000);
            }}
            className="relative z-50 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-2 py-1"
          >
            断开全部
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </header>

      <main className="relative z-10 px-5 pb-10">
        {/* 身份双轨制切换器 */}
        <div className="mb-6">
          <IdentitySwitcher />
        </div>

        {/* 设备状态横幅 */}
        {connectedDevices.map(device => (
          <DeviceBanner key={device.id} device={device} />
        ))}

        {/* 脑健康仪表盘网格 */}
        {connectedDevices.length > 0 && <DashboardGrid />}

        {/* 添加新设备入口 */}
        <div className="mt-8 mb-4">
          <button 
            onClick={() => navigate('/device-connect')}
            className="w-full py-4 rounded-3xl bg-white border border-dashed border-slate-300 text-slate-500 font-medium flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
          >
            <span className="text-xl leading-none">+</span>
            连接新设备
          </button>
        </div>
      </main>

      {/* JIT 授权拦截弹窗 (简易实现) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">数据授权协议</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              为了提供精准的脑健康分析服务，我们需要获取您的设备监测数据。请阅读并同意《三方电子联合数据授权协议》。
            </p>
            <div className="flex space-x-3">
              <CapsuleButton variant="secondary" className="flex-1" onClick={() => setShowAuthModal(false)}>
                暂不授权
              </CapsuleButton>
              <CapsuleButton variant="primary" className="flex-1" onClick={handleSignAgreement}>
                同意并继续
              </CapsuleButton>
            </div>
          </div>
        </div>
      )}

      {/* 简易 Toast 提示 */}
      {toastMsg && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-800/90 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-sm shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 whitespace-nowrap">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
