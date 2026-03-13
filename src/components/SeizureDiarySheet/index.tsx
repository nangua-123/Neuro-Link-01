import React, { useState } from 'react';
import { Popup, Button, Switch, Toast } from 'antd-mobile';
import { Activity, AlertTriangle } from 'lucide-react';
import { useRecallStore, DangerLevel, RecallReason } from '../../store/recall';
import { useAppStore } from '../../store';
import { UserIdentity } from '../../interfaces/user';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SeizureDiarySheet({ visible, onClose }: Props) {
  const [type, setType] = useState<'generalized' | 'focal' | null>(null);
  const [impaired, setImpaired] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  
  const { triggerRecall } = useRecallStore();
  const { identity, recordSeizureAttack } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  const durationOptions = [
    { label: '< 1分钟', value: '<1min' },
    { label: '< 5分钟', value: '<5min' },
    { label: '5-15分钟', value: '5-15min', danger: true },
    { label: '15-30分钟', value: '15-30min', danger: true },
    { label: '> 30分钟', value: '>30min', danger: true },
  ];

  const triggerOptions = ['漏服药', '熬夜', '情绪波动', '光声刺激', '发热', '饮酒'];

  const toggleTrigger = (t: string) => {
    setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleSubmit = () => {
    if (!type || !duration) {
      Toast.show('请完善发作类型和持续时间');
      return;
    }
    
    onClose();
    
    // 极端事件熔断逻辑
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
    
    // Record the seizure attack
    recordSeizureAttack();
    
    // Reset state
    setTimeout(() => {
      setType(null);
      setImpaired(false);
      setDuration(null);
      setTriggers([]);
    }, 300);
  };

  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '16px', backgroundColor: '#FAFAFA', maxHeight: '85vh', overflowY: 'auto' }}>
      <div className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-500" />
            记录发作日记
          </h3>
          <div className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            今日 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>

        {/* 发作类型 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700">发作类型 <span className="text-rose-500">*</span></label>
          <div className="grid grid-cols-2 gap-2">
            <div 
              onClick={() => setType('generalized')}
              className={`p-2.5 rounded-[12px] transition-all cursor-pointer ${type === 'generalized' ? 'bg-indigo-50 shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'bg-slate-50/80 hover:bg-slate-100'}`}
            >
              <div className="text-[12px] font-bold text-slate-900 mb-0.5">全面强直阵挛</div>
              <div className="text-[8px] text-slate-500 leading-tight">全身僵硬、大抽搐、意识丧失</div>
            </div>
            <div 
              onClick={() => setType('focal')}
              className={`p-2.5 rounded-[12px] transition-all cursor-pointer ${type === 'focal' ? 'bg-indigo-50 shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'bg-slate-50/80 hover:bg-slate-100'}`}
            >
              <div className="text-[12px] font-bold text-slate-900 mb-0.5">局灶性发作</div>
              <div className="text-[8px] text-slate-500 leading-tight">局部抽搐、发呆走神、感觉异常</div>
            </div>
          </div>
        </div>

        {/* 意识障碍联动 */}
        {type === 'focal' && (
          <div className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-[12px] shadow-sm">
            <div>
              <div className="text-[12px] font-bold text-slate-900">是否伴有意识障碍？</div>
              <div className="text-[9px] text-slate-500 mt-0.5">呼之不应、事后遗忘</div>
            </div>
            <Switch checked={impaired} onChange={setImpaired} style={{ '--checked-color': '#6366f1', '--width': '36px', '--height': '20px' }} />
          </div>
        )}

        {/* 持续时间 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700">持续时间 <span className="text-rose-500">*</span></label>
          <div className="flex flex-wrap gap-1.5">
            {durationOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  duration === opt.value 
                    ? (opt.danger ? 'bg-rose-500 text-white shadow-sm' : 'bg-indigo-600 text-white shadow-sm')
                    : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {duration && durationOptions.find(o => o.value === duration)?.danger && (
            <div className="flex items-start gap-1.5 mt-1.5 bg-rose-50 p-2 rounded-[10px]">
              <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
              <span className="text-[9px] text-rose-600 font-medium leading-relaxed">
                发作超过5分钟属于医疗紧急情况，保存后系统将立即启动紧急熔断预警！
              </span>
            </div>
          )}
        </div>

        {/* 诱因追踪 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700">发作诱因 (多选)</label>
          <div className="flex flex-wrap gap-1.5">
            {triggerOptions.map(t => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`px-2.5 py-1 rounded-full text-[9px] font-medium transition-all ${
                  triggers.includes(t) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50/80 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Button 
          block 
          className="bg-slate-900 text-white border-none rounded-full h-10 font-bold text-[14px] shadow-[0_4px_12px_rgba(15,23,42,0.1)] mt-2"
          onClick={handleSubmit}
        >
          保存日记
        </Button>
      </div>
    </Popup>
  );
}
