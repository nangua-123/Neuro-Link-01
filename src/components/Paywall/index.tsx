import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Button, Toast } from 'antd-mobile';
import { useAppStore } from '../../store';

interface PaywallProps {
  title?: string;
  description?: string;
  features?: string[];
  price?: string;
  onUnlock?: () => void;
  onClose?: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({
  title = '解锁高级 AI 洞察',
  description = '获取基于华西专病知识库的深度分析报告与个性化干预方案。',
  features = [
    '多维度诱因图谱分析',
    '疾病进展预测模型',
    '个性化用药与生活方式建议',
    '专属医疗管家 1v1 咨询'
  ],
  price = '¥19.9/月',
  onUnlock,
  onClose
}) => {
  const { unlockPremium } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = () => {
    setIsProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      unlockPremium();
      Toast.show({
        icon: 'success',
        content: '解锁成功',
      });
      if (onUnlock) onUnlock();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
        >
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full z-10 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Header */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10" />
            
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 shadow-inner">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">{title}</h2>
            <p className="text-[13px] text-blue-100 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[14px] text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[32px] font-bold text-slate-900 leading-none">{price}</span>
              <span className="text-[12px] text-slate-400 line-through mt-2">¥99/月</span>
            </div>

            <Button
              block
              loading={isProcessing}
              onClick={handlePurchase}
              className="h-14 rounded-full text-[16px] font-bold text-white border-none shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {isProcessing ? '处理中...' : '立即解锁'}
            </Button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>华西专病知识库提供医学支持</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
