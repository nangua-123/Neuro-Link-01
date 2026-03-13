import React from 'react';
import { DeviceManagement } from './views/DeviceManagement';
import { useDeviceStore } from './store/useDeviceStore';
import { CapsuleButton } from './components/common/CapsuleButton';
import { Activity } from 'lucide-react';

const HomePlaceholder = () => {
  const { setCurrentView } = useDeviceStore();
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-slate-50/50 to-slate-50 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6 text-indigo-500">
          <Activity size={40} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">华西脑健康</h1>
        <p className="text-slate-500 mb-10 text-center text-sm">个人中心 / 首页占位</p>
        
        <CapsuleButton size="lg" onClick={() => setCurrentView('device')}>
          进入智能设备管理
        </CapsuleButton>
      </div>
    </div>
  );
};

function App() {
  const { currentView } = useDeviceStore();

  return (
    <div className="max-w-md mx-auto h-screen overflow-y-auto bg-white shadow-2xl relative">
      {currentView === 'home' ? <HomePlaceholder /> : <DeviceManagement />}
    </div>
  );
}

export default App;
