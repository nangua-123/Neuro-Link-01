import React, { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { HeartHandshake, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';

interface Props {
  visible: boolean;
  onClose: () => void;
  activeTaskId?: string;
  onTaskCompleted?: (taskId: string) => void;
}

export function CDRDiarySheet({ visible, onClose, activeTaskId, onTaskCompleted }: Props) {
  const [bpsd, setBpsd] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | null>(null);
  const { recordCdrDiary, identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  const bpsdOptions = [
    { label: '幻觉/妄想', emoji: '👻' },
    { label: '激越/攻击', emoji: '😡' },
    { label: '抑郁/焦虑', emoji: '😔' },
    { label: '情感淡漠', emoji: '😐' },
    { label: '脱抑制', emoji: '🎭' },
    { label: '易激惹', emoji: '💢' },
    { label: '异常运动', emoji: '🏃' },
    { label: '睡眠障碍', emoji: '🦉' },
    { label: '饮食改变', emoji: '🍽️' }
  ];

  const toggleBpsd = (s: string) => {
    setBpsd(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = () => {
    if (bpsd.length > 0 && !severity) {
      Toast.show('请选择症状严重程度');
      return;
    }
    
    recordCdrDiary({
      bpsd,
      severity: severity as 'mild' | 'moderate' | 'severe'
    });

    if (activeTaskId && onTaskCompleted) {
      onTaskCompleted(activeTaskId);
    }

    Toast.show({ content: '照护日记已保存', icon: 'success' });
    onClose();
    setTimeout(() => {
      setBpsd([]);
      setSeverity(null);
    }, 300);
  };

  return (
    <Popup 
      visible={visible} 
      onMaskClick={onClose} 
      bodyStyle={{ 
        borderTopLeftRadius: '32px', 
        borderTopRightRadius: '32px', 
        padding: 0,
        backgroundColor: '#f8fafc', 
        maxHeight: '90vh', 
        overflowY: 'auto' 
      }}
    >
      <div className="relative w-full h-full bg-gradient-to-b from-blue-50/80 via-blue-50/40 to-transparent px-5 py-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <div className="space-y-8 font-sans relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-center text-blue-500">
                <HeartHandshake strokeWidth={2.5} size={20} />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">{isFamily ? '长辈今日表现' : '我的今日记录'}</h3>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">今日 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          </div>

          {/* 提示框 */}
          <div className="bg-white rounded-[20px] p-4 flex items-start gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              记录{isFamily ? '长辈' : '您'}的精神行为症状 (BPSD) 有助于医生调整用药方案。请客观记录今日发生的异常行为。
            </p>
          </div>

          {/* BPSD 症状多选 */}
          <div className="space-y-3">
            <label className="text-[15px] font-bold text-slate-900 ml-1">今日出现的异常行为 <span className="text-slate-400 font-normal text-[12px] ml-1">(多选)</span></label>
            <div className="grid grid-cols-3 gap-2">
              {bpsdOptions.map(s => {
                const isSelected = bpsd.includes(s.label);
                return (
                  <motion.button
                    key={s.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBpsd(s.label)}
                    className={`flex flex-col items-center justify-center py-4 rounded-[24px] transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.15)]' 
                        : 'bg-white text-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50'
                    }`}
                  >
                    <span className="text-[28px] mb-1.5">{s.emoji}</span>
                    <span className={`text-[12px] ${isSelected ? 'font-bold' : 'font-medium'}`}>{s.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 严重程度 */}
          {bpsd.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[15px] font-bold text-slate-900 ml-1">症状严重程度 <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSeverity('mild')}
                  className={`py-3.5 rounded-[20px] text-[14px] font-bold transition-all duration-300 ${
                    severity === 'mild' 
                      ? 'bg-blue-50 text-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.15)]' 
                      : 'bg-white text-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50'
                  }`}
                >
                  轻度
                  <div className={`text-[11px] mt-1 font-medium ${severity === 'mild' ? 'text-blue-500/80' : 'text-slate-400'}`}>易安抚</div>
                </button>
                <button
                  onClick={() => setSeverity('moderate')}
                  className={`py-3.5 rounded-[20px] text-[14px] font-bold transition-all duration-300 ${
                    severity === 'moderate' 
                      ? 'bg-blue-50 text-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.15)]' 
                      : 'bg-white text-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50'
                  }`}
                >
                  中度
                  <div className={`text-[11px] mt-1 font-medium ${severity === 'moderate' ? 'text-blue-500/80' : 'text-slate-400'}`}>需干预</div>
                </button>
                <button
                  onClick={() => setSeverity('severe')}
                  className={`py-3.5 rounded-[20px] text-[14px] font-bold transition-all duration-300 ${
                    severity === 'severe' 
                      ? 'bg-rose-50 text-rose-600 shadow-[0_8px_24px_rgba(244,63,94,0.15)]' 
                      : 'bg-white text-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50'
                  }`}
                >
                  重度
                  <div className={`text-[11px] mt-1 font-medium ${severity === 'severe' ? 'text-rose-500/80' : 'text-slate-400'}`}>影响生活</div>
                </button>
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              className="w-full h-14 rounded-[16px] bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold text-[16px] shadow-[0_8px_24px_rgba(59,130,246,0.25)] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Check size={20} strokeWidth={3} />
              保存日记
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
