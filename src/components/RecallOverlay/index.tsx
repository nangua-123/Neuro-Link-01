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
      className="fixed inset-0 max-w-md mx-auto right-0 left-0 z-[9999] bg-gradient-to-b from-rose-50/95 via-red-50/95 to-white backdrop-blur-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-slate-900 overflow-hidden" 
      style={{ touchAction: 'none' }} // 彻底锁死底层交互
    >
      {/* 闪烁的背景光晕 */}
      <motion.div 
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-red-400/20 blur-[80px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-red-100/50 rounded-full flex items-center justify-center mb-6 border-2 border-red-200/50 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
        >
          <AlertTriangle className="w-12 h-12 text-red-500" strokeWidth={2.5} />
        </motion.div>

        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight text-slate-900 drop-shadow-sm">
          警告！检测到危及生命的体征异常
        </h1>
        
        <div className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-[32px] w-full mb-12 border border-red-100/50 shadow-[0_8px_30px_rgba(225,29,72,0.08)]">
          <p className="text-lg font-medium text-center leading-relaxed text-rose-600">
            {message || '系统已拦截到极危生命体征信号，请立即采取行动！'}
          </p>
        </div>
        
        <div className="w-full space-y-4 mb-8">
          <button 
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-bold text-xl py-5 rounded-full shadow-[0_8px_24px_rgba(225,29,72,0.25)] border-none flex items-center justify-center gap-3 transition-transform active:scale-95" 
            onClick={() => { window.location.href = 'tel:120'; }}
          >
            <Phone className="w-6 h-6" />
            一键呼叫 120
          </button>
          
          <button 
            className="w-full bg-white hover:bg-slate-50 text-rose-600 font-semibold text-lg py-4 rounded-full flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-rose-100" 
            onClick={() => { Toast.show({ content: '已向紧急联系人发送包含定位的求救短信' }); }}
          >
            <Users className="w-5 h-5" />
            紧急联系家属
          </button>
        </div>

        <button 
          onClick={dismissRecall} 
          className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors p-4"
        >
          我已安全 / 解除警报
        </button>
      </div>
    </div>
  );
};
