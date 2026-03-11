import React, { useState } from 'react';
import { Popup, Button, Slider, Toast } from 'antd-mobile';
import { Zap, Pill, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function MigraineDiarySheet({ visible, onClose }: Props) {
  const [vas, setVas] = useState<number>(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [meds, setMeds] = useState<string[]>([]);
  
  const { recordMigraineAttack, recordPainkiller } = useAppStore();

  const symptomOptions = ['恶心呕吐', '畏光', '畏声', '视觉先兆(闪光/暗点)', '单侧搏动'];
  const medOptions = [
    { label: '急性止痛药 (如布洛芬/曲普坦)', value: 'acute', danger: true },
    { label: '预防性药物 (如氟桂利嗪)', value: 'preventive' }
  ];

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleMed = (m: string) => {
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
    if (val <= 3) return '#34d399'; // emerald
    if (val <= 6) return '#fbbf24'; // amber
    if (val <= 8) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const handleSubmit = () => {
    let severity = 'moderate';
    if (vas <= 3) severity = 'mild';
    else if (vas >= 7) severity = 'severe';

    recordMigraineAttack(severity, symptoms.join(', ') || '无明显诱因');
    
    if (meds.includes('acute')) {
      recordPainkiller();
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
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', backgroundColor: '#FAFAFA', maxHeight: '85vh', overflowY: 'auto' }}>
      <div className="space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-500" />
            记录头痛发作
          </h3>
          <div className="text-[12px] text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
            今日
          </div>
        </div>

        {/* VAS 疼痛评分 */}
        <div className="space-y-4 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-bold text-slate-900">疼痛程度 (VAS)</label>
            <div className="flex items-center gap-2">
              <span className="text-[24px]">{getVasEmoji(vas)}</span>
              <span className="text-[20px] font-black" style={{ color: getVasColor(vas) }}>{vas} <span className="text-[12px] text-slate-400 font-medium">分</span></span>
            </div>
          </div>
          <div className="px-2 pt-2 pb-4">
            <Slider 
              min={0} 
              max={10} 
              value={vas} 
              onChange={(v) => typeof v === 'number' && setVas(v)} 
              style={{ '--fill-color': getVasColor(vas) }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
              <span>0 无痛</span>
              <span>10 剧痛</span>
            </div>
          </div>
        </div>

        {/* 伴随症状 */}
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-700">伴随症状与先兆 (多选)</label>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-[10px] text-[12px] font-medium transition-all ${
                  symptoms.includes(s) ? 'bg-violet-100 text-violet-700 border border-violet-200' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 用药情况 */}
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-700">本次发作用药</label>
          <div className="grid grid-cols-1 gap-2">
            {medOptions.map(m => (
              <div 
                key={m.value}
                onClick={() => toggleMed(m.value)}
                className={`p-3 rounded-[16px] border flex items-center justify-between transition-all ${
                  meds.includes(m.value) 
                    ? (m.danger ? 'bg-rose-50 border-rose-200' : 'bg-violet-50 border-violet-200') 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Pill className={`w-4 h-4 ${meds.includes(m.value) ? (m.danger ? 'text-rose-500' : 'text-violet-500') : 'text-slate-400'}`} />
                  <span className={`text-[13px] font-semibold ${meds.includes(m.value) ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  meds.includes(m.value) 
                    ? (m.danger ? 'border-rose-500 bg-rose-500' : 'border-violet-500 bg-violet-500') 
                    : 'border-slate-300'
                }`}>
                  {meds.includes(m.value) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </div>
            ))}
          </div>
          {meds.includes('acute') && (
            <div className="flex items-start gap-2 mt-2 bg-rose-50 p-2.5 rounded-[12px]">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-rose-600 font-medium leading-relaxed">
                已选择急性止痛药，系统将自动计入本月 MOH 防火墙统计。请注意控制频率！
              </span>
            </div>
          )}
        </div>

        <Button 
          block 
          className="bg-slate-900 text-white border-none rounded-[16px] h-12 font-bold text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          onClick={handleSubmit}
        >
          保存日记
        </Button>
      </div>
    </Popup>
  );
}
