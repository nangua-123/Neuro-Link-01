import React, { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { motion } from 'motion/react';
import { Shield, QrCode, RefreshCw, Download } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NeuroPassModal({ visible, onClose }: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshQR = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        minHeight: '60vh',
        backgroundColor: '#FAFAFA',
      }}
    >
      <div className="p-8 flex flex-col items-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-8" />
        
        <h2 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Neuro-Pass 专属就诊码</h2>
        <p className="text-[13px] text-slate-500 mb-8 text-center px-4 leading-relaxed">
          凭此码前往协作医院，医生扫码即可读取华西 AI 评估报告，免去您反复口述病史的烦恼。
        </p>

        <div className="relative bg-white p-8 rounded-[40px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-blue-100 mb-8">
          {/* Scanning animation overlay */}
          <motion.div 
            animate={{ y: [0, 200, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
            style={{ top: '24px' }}
          />
          
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0, scale: isRefreshing ? 0.9 : 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-48 h-48 flex items-center justify-center bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200"
          >
            <QrCode className="w-32 h-32 text-slate-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-[16px] shadow-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
        </div>

        <div className="flex items-center gap-3 w-full max-w-xs">
          <button 
            onClick={handleRefreshQR}
            className="flex-1 py-3.5 bg-blue-50 text-blue-600 rounded-[20px] text-[15px] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新动态码
          </button>
          <button 
            onClick={() => Toast.show('已保存到相册')}
            className="flex-1 py-3.5 bg-slate-900 text-white rounded-[20px] text-[15px] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-900/20"
          >
            <Download className="w-4 h-4" />
            保存到相册
          </button>
        </div>
      </div>
    </Popup>
  );
}
