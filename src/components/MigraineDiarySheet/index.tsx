import React, { useState } from 'react';
import { Popup, Slider, Toast, Dialog } from 'antd-mobile';
import { Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';

interface Props {
  visible: boolean;
  onClose: () => void;
  activeTaskId?: string;
  onTaskCompleted?: (taskId: string) => void;
}

export function MigraineDiarySheet({ visible, onClose, activeTaskId, onTaskCompleted }: Props) {
  const [vas, setVas] = useState<number>(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [meds, setMeds] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  
  const { recordMigraineAttack, recordPainkiller, getMonthlyPainkillerCount } = useAppStore();

  const symptomOptions = [
    '恶心呕吐', '畏光', '畏声', '视觉先兆', '单侧搏动'
  ];
  const medOptions = [
    { label: '急性止痛药 (如布洛芬)', value: 'acute', danger: true },
    { label: '预防性药物 (如氟桂利嗪)', value: 'preventive' }
  ];

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleMed = (m: string) => {
    if (m === 'acute' && !meds.includes('acute')) {
      const count = getMonthlyPainkillerCount();
      if (count >= 9) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        Dialog.confirm({
          content: `本月急性止痛药已达 ${count} 天，存在 MOH 风险！确定要继续记录吗？`,
          confirmText: '强行记录',
          cancelText: '取消',
          onConfirm: () => {
            setMeds(prev => [...prev, m]);
          }
        });
        return;
      }
    }
    setMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const getVasEmoji = (val: number) => {
    if (val === 0) return '🙂';
    if (val <= 3) return '🙁';
    if (val <= 6) return '😣';
    if (val <= 8) return '😫';
    return '😭';
  };

  const getVasColor = (val: number) => {
    return '#4f46e5'; // Unified blue-600
  };

  const getVasText = (val: number) => {
    if (val === 0) return '无痛';
    if (val <= 3) return '轻度疼痛';
    if (val <= 6) return '中度疼痛';
    if (val <= 8) return '重度疼痛';
    return '剧烈疼痛';
  };

  const getGlowClass = (val: number) => {
    return 'from-blue-500/15 via-blue-500/5 to-transparent';
  };

  const handleSubmit = () => {
    let severity = 'moderate';
    if (vas <= 3) severity = 'mild';
    else if (vas >= 7) severity = 'severe';

    recordMigraineAttack({
      severity,
      symptoms,
      meds,
      vas
    });
    
    if (meds.includes('acute')) {
      recordPainkiller();
    }

    if (activeTaskId && onTaskCompleted) {
      onTaskCompleted(activeTaskId);
    }

    Toast.show({ content: '头痛日记已保存', icon: 'success' });
    onClose();
    
    setTimeout(() => {
      setVas(5);
      setSymptoms([]);
      setMeds([]);
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
      <div className={`relative w-full h-full bg-gradient-to-b ${getGlowClass(vas)} transition-colors duration-500 px-5 py-6 pb-[calc(24px+env(safe-area-inset-bottom))]`}>
        <div className="space-y-8 font-sans relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-700 transition-colors duration-300" style={{ color: getVasColor(vas) }}>
                <Zap strokeWidth={2.5} size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">头痛闪记</h3>
                <p className="text-xs text-slate-400 font-medium">今日 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          </div>

          {/* VAS 疼痛评分 */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-800 ml-1">疼痛程度 (VAS) <span className="text-rose-500">*</span></label>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] shadow-sm border border-white flex flex-col items-center transition-colors duration-300">
              <div className="flex flex-col items-center mb-6">
                <span className="text-5xl mb-2 transition-transform duration-300 hover:scale-110">{getVasEmoji(vas)}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tighter transition-colors duration-300" style={{ color: getVasColor(vas) }}>{vas}</span>
                  <span className="text-sm text-slate-400 font-medium">分</span>
                </div>
                <span className="text-sm font-bold mt-1 transition-colors duration-300" style={{ color: getVasColor(vas) }}>{getVasText(vas)}</span>
              </div>
              <div className="w-full px-2">
                <Slider 
                  value={vas} 
                  onChange={(v) => setVas(v as number)} 
                  min={0} 
                  max={10} 
                  step={1} 
                  style={{ '--fill-color': getVasColor(vas), '--slider-size': '24px' } as any}
                />
              </div>
              <div className="w-full flex justify-between text-xs text-slate-400 font-medium mt-3 px-1">
                <span>0 无痛</span>
                <span>10 剧痛</span>
              </div>
            </div>
          </div>

          {/* 伴随症状 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 ml-1">先兆与症状 <span className="text-slate-400 font-normal text-xs ml-1">(多选)</span></label>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map(s => {
                const isSelected = symptoms.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-105' 
                        : 'bg-white/60 text-slate-600 border border-white shadow-sm hover:bg-white'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 用药记录 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 ml-1">本次用药 <span className="text-slate-400 font-normal text-xs ml-1">(多选)</span></label>
            <div className="flex flex-col gap-3">
              {medOptions.map(m => {
                const isSelected = meds.includes(m.value);
                const isAcute = m.value === 'acute';
                const count = getMonthlyPainkillerCount();
                const showWarning = isAcute && count >= 9;
                
                return (
                  <motion.div 
                    key={m.value}
                    onClick={() => toggleMed(m.value)}
                    animate={isAcute && shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`relative p-4 rounded-[20px] transition-all duration-300 cursor-pointer border-2 flex flex-col justify-center ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : (showWarning ? 'bg-slate-50 border-slate-200 opacity-80 grayscale' : 'bg-white/80 backdrop-blur-md border-white shadow-sm hover:bg-white')
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                        {m.label}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-slate-300 bg-transparent'
                      }`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                    {showWarning && !isSelected && (
                      <div className="mt-2 text-xs text-rose-500 font-medium flex items-center gap-1">
                        <Zap size={12} />
                        本月急性药已达 {count} 天，存在 MOH 风险
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              className="w-full h-14 rounded-full text-white font-bold text-lg shadow-lg active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              style={{ backgroundColor: getVasColor(vas), boxShadow: `0 8px 20px ${getVasColor(vas)}40` }}
            >
              <Check size={20} strokeWidth={3} />
              保存闪记
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
