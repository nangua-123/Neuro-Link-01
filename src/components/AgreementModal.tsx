import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, onAgree }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 max-w-md mx-auto right-0 left-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] z-50 overflow-hidden flex flex-col max-h-[85vh] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-blue-600">
                  <ShieldAlert className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">数据授权协议</h3>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="prose prose-sm text-slate-600 space-y-4">
                <p className="font-medium text-slate-800 text-[15px]">《三方电子联合数据授权协议》</p>
                <p className="text-[13px]">尊敬的用户：</p>
                <p className="text-[13px] leading-relaxed">为了给您提供更精准的专病管家服务，并推动神经专病领域的医学研究，我们需要获取您的授权。</p>
                <div className="bg-blue-50/50 p-5 rounded-[24px] border border-blue-100/50">
                  <h4 className="text-[13px] font-semibold text-blue-800 mb-3">核心授权内容：</h4>
                  <ul className="list-disc pl-4 space-y-2 text-[13px] text-blue-700/80 leading-relaxed">
                    <li>您的评估数据将经过严格的<strong>脱敏处理</strong>（隐去姓名、联系方式等直接身份标识）。</li>
                    <li>脱敏后的数据将仅用于<strong>华西医院及合作药企</strong>的科研分析与模型训练。</li>
                    <li>我们承诺采用最高级别的加密技术保障您的数据安全，绝不向任何无关第三方泄露。</li>
                  </ul>
                </div>
                <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                  点击“同意并签署”即表示您已阅读并同意上述条款。如您拒绝，将无法使用专属管家服务，但不影响您使用基础评估功能。
                </p>
              </div>
            </div>
            
            <div className="p-5 sm:p-6 bg-white border-t border-slate-50 flex space-x-3 pb-8">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-full font-medium text-[15px] text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                暂不授权
              </button>
              <button
                onClick={onAgree}
                className="flex-[2] py-4 rounded-full font-medium text-[15px] text-white bg-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.15)] active:scale-95 transition-all"
              >
                同意并签署
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
