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
  const { identity } = useAppStore();
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
    
    // Reset state
    setTimeout(() => {
      setType(null);
      setImpaired(false);
      setDuration(null);
      setTriggers([]);
    }, 300);
  };

  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', backgroundColor: '#FAFAFA', maxHeight: '85vh', overflowY: 'auto' }}>
      <div className="space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            记录发作日记
          </h3>
          <div className="text-[12px] text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
            今日 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>

        {/* 发作类型 */}
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-700">发作类型 <span className="text-rose-500">*</span></label>
          <div className="grid grid-cols-1 gap-2">
            <div 
              onClick={() => setType('generalized')}
              className={`p-4 sm:p-5 rounded-[24px] transition-all ${type === 'generalized' ? 'bg-indigo-50 shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'bg-slate-50/80 hover:bg-slate-100'}`}
            >
              <div className="text-[14px] font-bold text-slate-900">全面强直阵挛</div>
              <div className="text-[11px] text-slate-500 mt-0.5">全身僵硬、大抽搐、意识丧失</div>
            </div>
            <div 
              onClick={() => setType('focal')}
              className={`p-4 sm:p-5 rounded-[24px] transition-all ${type === 'focal' ? 'bg-indigo-50 shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'bg-slate-50/80 hover:bg-slate-100'}`}
            >
              <div className="text-[14px] font-bold text-slate-900">局灶性发作</div>
              <div className="text-[11px] text-slate-500 mt-0.5">局部抽搐、发呆走神、感觉异常</div>
            </div>
          </div>
        </div>

        {/* 意识障碍联动 */}
        {type === 'focal' && (
          <div className="flex items-center justify-between bg-slate-50/80 p-4 sm:p-5 rounded-[24px] shadow-sm">
            <div>
              <div className="text-[14px] font-bold text-slate-900">是否伴有意识障碍？</div>
              <div className="text-[11px] text-slate-500 mt-0.5">呼之不应、事后遗忘</div>
            </div>
            <Switch checked={impaired} onChange={setImpaired} style={{ '--checked-color': '#6366f1' }} />
          </div>
        )}

        {/* 持续时间 */}
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-700">持续时间 <span className="text-rose-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all ${
                  duration === opt.value 
                    ? (opt.danger ? 'bg-rose-500 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md')
                    : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {duration && durationOptions.find(o => o.value === duration)?.danger && (
            <div className="flex items-start gap-2 mt-2 bg-rose-50 p-3 rounded-[16px]">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-rose-600 font-medium leading-relaxed">
                发作超过5分钟属于医疗紧急情况，保存后系统将立即启动紧急熔断预警！
              </span>
            </div>
          )}
        </div>

        {/* 诱因追踪 */}
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-700">发作诱因 (多选)</label>
          <div className="flex flex-wrap gap-2">
            {triggerOptions.map(t => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`px-4 py-2 rounded-full text-[11px] font-medium transition-all ${
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
          className="bg-slate-900 text-white border-none rounded-full h-12 font-bold text-[15px] shadow-[0_8px_20px_rgba(15,23,42,0.15)] mt-4"
          onClick={handleSubmit}
        >
          保存日记
        </Button>
      </div>
    </Popup>
  );
}
