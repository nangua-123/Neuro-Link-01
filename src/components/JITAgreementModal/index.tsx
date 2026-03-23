import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, FileText, X } from 'lucide-react';

interface JITAgreementModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const JITAgreementModal: React.FC<JITAgreementModalProps> = ({ visible, onClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 max-h-[90vh] flex flex-col max-w-md mx-auto"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-6 pb-6 pt-2 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-blue-600" />
                </div>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 active:bg-slate-50 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-[22px] font-bold text-slate-900 mb-3 leading-tight">
                激活专属硬件与服务
              </h2>
              <p className="text-[15px] text-slate-600 mb-6 leading-relaxed">
                为激活您的专属硬件并生成精准的临床分析报告，请授权 Neuro-Link 处理您的体征与量表数据。
              </p>

              <div className="bg-slate-50 rounded-[20px] p-4 mb-6 border border-slate-100">
                <h3 className="text-[14px] font-bold text-slate-800 mb-3">授权内容包含：</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-600 leading-relaxed">
                      允许同步硬件采集的体征数据（心率、脑电、睡眠等）
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-600 leading-relaxed">
                      允许基于真实世界数据 (RWE) 生成临床级分析报告
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-600 leading-relaxed">
                      允许在紧急情况下向您的紧急联系人发送预警信息
                    </span>
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 mb-8 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 transition-colors"
                  />
                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[13px] text-slate-500 leading-relaxed">
                  我已阅读并同意
                  <span className="text-blue-600 font-medium">《三方电子联合数据授权协议》</span>
                  与
                  <span className="text-blue-600 font-medium">《知情同意书》</span>
                </span>
              </label>

              <button
                onClick={() => {
                  if (agreed) onConfirm();
                }}
                disabled={!agreed}
                className={`w-full py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                  agreed
                    ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                同意授权并激活
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
