import React, { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { motion } from 'motion/react';
import { Zap, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SeizureDiarySheet({ visible, onClose }: Props) {
  const [seizureType, setSeizureType] = useState<'A' | 'B' | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [hasConsciousnessLoss, setHasConsciousnessLoss] = useState<boolean | null>(null);

  const durationOptions = [
    '<1min或数秒',
    '<5min',
    '5-15min',
    '15-30min',
    '>30min'
  ];

  const handleSubmit = () => {
    if (!seizureType || !duration || (seizureType === 'B' && hasConsciousnessLoss === null)) {
      Toast.show({ content: '请完善发作信息' });
      return;
    }
    Toast.show({ icon: 'success', content: '记录已保存' });
    // Reset state
    setSeizureType(null);
    setDuration(null);
    setHasConsciousnessLoss(null);
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        minHeight: '65vh',
        backgroundColor: '#FAFAFA',
        padding: '24px'
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">发作日记</h2>
              <p className="text-[11px] text-slate-400 font-medium">{new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pb-20">
          {/* 发作类型 */}
          <section>
            <h3 className="text-[13px] font-semibold text-slate-800 mb-3 flex items-center">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full mr-2" />
              发作类型
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setSeizureType('A')}
                className={`p-3.5 rounded-[20px] border-2 transition-colors flex items-center justify-between cursor-pointer ${
                  seizureType === 'A' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100/50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                }`}
              >
                <div>
                  <p className={`font-semibold text-[14px] ${seizureType === 'A' ? 'text-indigo-700' : 'text-slate-700'}`}>全身僵硬 / 大抽搐</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">全面强直阵挛发作</p>
                </div>
                {seizureType === 'A' && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setSeizureType('B')}
                className={`p-3.5 rounded-[20px] border-2 transition-colors flex items-center justify-between cursor-pointer ${
                  seizureType === 'B' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100/50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                }`}
              >
                <div>
                  <p className={`font-semibold text-[14px] ${seizureType === 'B' ? 'text-indigo-700' : 'text-slate-700'}`}>局部抽搐 / 发呆走神</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">非全面强直阵挛发作</p>
                </div>
                {seizureType === 'B' && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
              </motion.div>
            </div>
          </section>

          {/* 意识状态 (条件渲染) */}
          {seizureType === 'B' && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-orange-50/50 border border-orange-100/50 rounded-[20px] p-4"
            >
              <div className="flex items-start space-x-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="text-[13px] font-semibold text-orange-800">是否伴有意识障碍？</h3>
                  <p className="text-[11px] text-orange-600/80 mt-0.5">叫不醒、事后无记忆</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setHasConsciousnessLoss(true)}
                  className={`flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors ${
                    hasConsciousnessLoss === true 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 border-transparent' 
                      : 'bg-white text-slate-600 border border-slate-200/60'
                  }`}
                >
                  是 (有障碍)
                </button>
                <button
                  onClick={() => setHasConsciousnessLoss(false)}
                  className={`flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors ${
                    hasConsciousnessLoss === false 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-transparent' 
                      : 'bg-white text-slate-600 border border-slate-200/60'
                  }`}
                >
                  否 (清醒)
                </button>
              </div>
            </motion.section>
          )}

          {/* 持续时间 */}
          <section>
            <h3 className="text-[13px] font-semibold text-slate-800 mb-3 flex items-center">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full mr-2" />
              最长持续时间
            </h3>
            <div className="flex overflow-x-auto pb-4 -mx-2 px-2 space-x-2 hide-scrollbar">
              {durationOptions.map((opt) => (
                <motion.div
                  key={opt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDuration(opt)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                    duration === opt
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-transparent'
                      : 'bg-white text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {opt}
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-full bg-slate-900 text-white font-medium text-[14px] tracking-wide shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
          >
            保存记录
          </button>
        </div>
      </div>
    </Popup>
  );
}
