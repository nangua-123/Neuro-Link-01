import React, { useState } from 'react';
import { Popup, Switch, Toast } from 'antd-mobile';
import { Activity, AlertTriangle, Check, Video, Sparkles } from 'lucide-react';
import { useRecallStore, DangerLevel, RecallReason } from '../../store/recall';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';

interface Props {
  visible: boolean;
  onClose: () => void;
  activeTaskId?: string;
  onTaskCompleted?: (taskId: string) => void;
}

export function SeizureDiarySheet({ visible, onClose, activeTaskId, onTaskCompleted }: Props) {
  const [type, setType] = useState<'generalized' | 'focal' | null>(null);
  const [impaired, setImpaired] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  
  const { triggerRecall } = useRecallStore();
  const { identity, recordSeizureAttack, recordMissedMedication } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  const durationOptions = [
    { label: '< 1分钟', value: '<1min' },
    { label: '< 5分钟', value: '<5min' },
    { label: '5-15分钟', value: '5-15min', danger: true },
    { label: '15-30分钟', value: '15-30min', danger: true },
    { label: '> 30分钟', value: '>30min', danger: true },
  ];

  const triggerOptions = [
    '漏服药', '熬夜', '情绪波动', '光声刺激', '发热', '饮酒'
  ];

  const toggleTrigger = (t: string) => {
    setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleEmergencyVideo = () => {
    onClose();
    Toast.show({
      content: '正在启动紧急录像...',
      icon: 'loading',
      duration: 1000
    });
    // In a real app, this would open the camera
  };

  const handleSubmit = () => {
    if (!type || !duration) {
      Toast.show('请完善发作类型和持续时间');
      return;
    }
    
    onClose();
    
    if (duration === '5-15min' || duration === '15-30min' || duration === '>30min') {
      triggerRecall({
        level: DangerLevel.CRITICAL,
        reason: RecallReason.EPILEPSY_STATUS,
        message: isFamily ? '长辈癫痫发作持续时间过长，极可能进入癫痫持续状态！' : '您癫痫发作持续时间过长，极可能进入癫痫持续状态！',
        patientId: 'current_user',
        timestamp: Date.now()
      });
    } else {
      Toast.show({ content: '日记已保存', icon: 'success' });
    }
    
    recordSeizureAttack({
      type: type as 'generalized' | 'focal',
      impaired,
      duration,
      triggers
    });

    if (triggers.includes('漏服药')) {
      recordMissedMedication();
    }

    if (activeTaskId && onTaskCompleted) {
      onTaskCompleted(activeTaskId);
    }
    
    setTimeout(() => {
      setType(null);
      setImpaired(false);
      setDuration(null);
      setTriggers([]);
    }, 300);
  };

  const isCriticalDuration = duration === '5-15min' || duration === '15-30min' || duration === '>30min';

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
      <div className={`relative w-full h-full px-5 py-6 pb-[calc(24px+env(safe-area-inset-bottom))] transition-colors duration-500 ${
        isCriticalDuration 
          ? 'bg-rose-500/20 animate-pulse' 
          : 'bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent'
      }`}>
        <div className="space-y-8 font-sans relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                <Activity strokeWidth={2.5} size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">发作日记</h3>
                <p className="text-xs text-slate-400 font-medium">今日 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <button 
              onClick={handleEmergencyVideo}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-bold shadow-md shadow-rose-500/30 active:scale-95 transition-transform"
            >
              <Video size={16} />
              紧急录像
            </button>
          </div>

          {/* 发作类型 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 ml-1">发作类型 <span className="text-rose-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setType('generalized')}
                className={`relative p-4 rounded-[20px] transition-all duration-300 cursor-pointer border-2 ${
                  type === 'generalized' 
                    ? 'bg-blue-50 border-blue-500 shadow-[0_4px_20px_rgba(37,99,235,0.15)]' 
                    : 'bg-white/80 backdrop-blur-md border-white shadow-sm hover:bg-white'
                }`}
              >
                {type === 'generalized' && <div className="absolute top-3 right-3 text-blue-600"><Check size={16} strokeWidth={3} /></div>}
                <div className={`text-base font-bold mb-1 ${type === 'generalized' ? 'text-blue-700' : 'text-slate-700'}`}>全面性发作</div>
                <div className={`text-xs leading-relaxed ${type === 'generalized' ? 'text-blue-500/80' : 'text-slate-400'}`}>全身僵硬、大抽搐、意识丧失</div>
              </div>
              <div 
                onClick={() => setType('focal')}
                className={`relative p-4 rounded-[20px] transition-all duration-300 cursor-pointer border-2 ${
                  type === 'focal' 
                    ? 'bg-blue-50 border-blue-500 shadow-[0_4px_20px_rgba(37,99,235,0.15)]' 
                    : 'bg-white/80 backdrop-blur-md border-white shadow-sm hover:bg-white'
                }`}
              >
                {type === 'focal' && <div className="absolute top-3 right-3 text-blue-600"><Check size={16} strokeWidth={3} /></div>}
                <div className={`text-base font-bold mb-1 ${type === 'focal' ? 'text-blue-700' : 'text-slate-700'}`}>局灶性发作</div>
                <div className={`text-xs leading-relaxed ${type === 'focal' ? 'text-blue-500/80' : 'text-slate-400'}`}>局部抽搐、发呆走神、感觉异常</div>
              </div>
            </div>
          </div>

          {/* 意识障碍联动 */}
          {type === 'focal' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-white/80 backdrop-blur-md rounded-[20px] p-4 shadow-sm border border-white flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-800">是否伴有意识障碍？</div>
                <div className="text-xs text-slate-400 mt-1">呼之不应、事后遗忘</div>
              </div>
              <Switch checked={impaired} onChange={setImpaired} style={{ '--checked-color': '#4f46e5', '--width': '44px', '--height': '24px' }} />
            </div>
          )}

          {/* 持续时间 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 ml-1">持续时间 <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-2.5">
              {durationOptions.map(opt => {
                const isSelected = duration === opt.value;
                const isDanger = opt.danger;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isSelected 
                        ? (isDanger 
                            ? 'bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.3)] scale-105' 
                            : 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-105')
                        : 'bg-white/80 backdrop-blur-md border border-white text-slate-600 shadow-sm hover:bg-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            
            {/* 危险预警 */}
            {duration && durationOptions.find(o => o.value === duration)?.danger && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-start gap-2.5 mt-3 bg-rose-50 p-3.5 rounded-[16px] border border-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-600 font-medium leading-relaxed">
                  发作超过5分钟属于医疗紧急情况，保存后系统将立即启动紧急熔断预警！
                </span>
              </div>
            )}
          </div>

          {/* 诱因追踪 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 ml-1">发作诱因 <span className="text-slate-400 font-normal text-xs ml-1">(多选)</span></label>
            <div className="flex flex-wrap gap-2.5">
              {triggerOptions.map(t => {
                const isSelected = triggers.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTrigger(t)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                        : 'bg-white/60 text-slate-600 border border-white shadow-sm hover:bg-white'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* AI 漏服药分析卡片 */}
            {(triggers.includes('漏服药') || triggers.includes('经常漏服')) && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-4 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-[20px] border border-indigo-100/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-indigo-500">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 mb-1.5">AI 漏服药风险提示</h4>
                    <p className="text-xs text-indigo-700/80 leading-relaxed mb-2">
                      漏服抗癫痫药物会导致血液中药物浓度骤降，是诱发癫痫发作最危险的因素之一，极易打破原本稳定的控制状态。
                    </p>
                    <div className="bg-white/60 rounded-lg p-2.5">
                      <div className="text-xs font-bold text-indigo-900 mb-1">💡 改善建议</div>
                      <ul className="text-[11px] text-indigo-700/80 space-y-1 pl-3 list-disc marker:text-indigo-400">
                        <li>请勿在下次服药时擅自加倍剂量，以免引起药物中毒。</li>
                        <li>建议开启系统的「用药提醒」功能，或使用带有闹钟的智能分药盒。</li>
                        <li>若近期频繁漏服，建议{isFamily ? '您加强监督' : '邀请家属协助监督'}。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              className="w-full h-14 rounded-full bg-blue-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
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
