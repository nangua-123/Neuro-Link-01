import React from 'react';
import { Toast } from 'antd-mobile';
import { useRecallStore, DangerLevel } from '../../store/recall';
import { AlertTriangle, Phone, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const RecallOverlay: React.FC = () => {
  const { isTriggered, dangerLevel, message, dismissRecall } = useRecallStore();

  // 仅在触发且为最高级别熔断时渲染
  if (!isTriggered || dangerLevel !== DangerLevel.CRITICAL) return null;

  return (
    <div 
      className="fixed inset-0 max-w-md mx-auto right-0 left-0 z-[9999] bg-gradient-to-b from-red-900 via-red-800 to-red-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden" 
      style={{ touchAction: 'none' }} // 彻底锁死底层交互
    >
      {/* 闪烁的背景光晕 */}
      <motion.div 
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-red-600/30 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50"
        >
          <AlertTriangle className="w-12 h-12 text-red-500" strokeWidth={2.5} />
        </motion.div>

        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight text-white drop-shadow-lg">
          警告！检测到危及生命的体征异常
        </h1>
        
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl w-full mb-12 border border-red-500/30 shadow-2xl">
          <p className="text-lg font-medium text-center leading-relaxed text-red-100">
            {message || '系统已拦截到极危生命体征信号，请立即采取行动！'}
          </p>
        </div>
        
        <div className="w-full space-y-4 mb-8">
          <button 
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-400/50 flex items-center justify-center gap-3 transition-transform active:scale-95" 
            onClick={() => { window.location.href = 'tel:120'; }}
          >
            <Phone className="w-6 h-6" />
            一键呼叫 120
          </button>
          
          <button 
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95" 
            onClick={() => { Toast.show({ content: '已向紧急联系人发送包含定位的求救短信' }); }}
          >
            <Users className="w-5 h-5" />
            紧急联系家属
          </button>
        </div>

        <button 
          onClick={dismissRecall} 
          className="text-sm text-white/50 hover:text-white/80 underline underline-offset-4 transition-colors p-4"
        >
          我已安全 / 解除警报
        </button>
      </div>
    </div>
  );
};
