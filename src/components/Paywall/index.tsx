import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, ShieldCheck, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaywallProps {
  title?: string;
  description?: string;
  features?: string[];
  targetPath?: string;
  equipmentId?: string;
  onClose?: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({
  title = '解锁高阶专病管家服务',
  description = '该深度报告需要高精度的临床级体征数据支撑。购买并绑定指定医疗级穿戴设备，即可终身解锁该报告及所有高阶管家服务。',
  features = [
    '多维度诱因图谱分析',
    '华西标准复诊一页纸',
    '疾病进展与衰退延缓评估',
    '家属异地共管与异常预警'
  ],
  targetPath = '/equipments',
  equipmentId,
  onClose
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (onClose) onClose();
    const finalPath = equipmentId ? `/equipments/${equipmentId}` : targetPath;
    navigate(finalPath);
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -ml-10 -mb-10" />
            
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20 shadow-inner">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">{title}</h2>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                购机赠送
              </div>
              <span className="text-[13px] font-bold text-slate-700">专属高阶软件特权</span>
            </div>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-[14px] text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleNavigate}
              className="w-full h-14 rounded-full text-[16px] font-bold text-white border-none shadow-[0_8px_20px_rgba(15,23,42,0.15)] bg-slate-900 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {targetPath === '/equipments' ? '前往专属装备库' : '查看专属装备'}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>软硬一体，华西专病知识库提供医学支持</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
