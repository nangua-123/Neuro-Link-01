import React, { useState } from 'react';
import { Popup, Button, Toast } from 'antd-mobile';
import { Brain, AlertTriangle, HeartHandshake } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CDRDiarySheet({ visible, onClose }: Props) {
  const [bpsd, setBpsd] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | null>(null);

  const bpsdOptions = [
    '幻觉/妄想', '激越/攻击', '抑郁/焦虑', '情感淡漠', '脱抑制', '易激惹', '异常运动', '睡眠障碍', '饮食改变'
  ];

  const toggleBpsd = (s: string) => {
    setBpsd(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = () => {
    if (bpsd.length > 0 && !severity) {
      Toast.show('请选择症状严重程度');
      return;
    }
    Toast.show({ content: '照护日记已保存', icon: 'success' });
    onClose();
    setTimeout(() => {
      setBpsd([]);
      setSeverity(null);
    }, 300);
  };

  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', backgroundColor: '#FAFAFA', maxHeight: '85vh', overflowY: 'auto' }}>
      <div className="space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-blue-500" />
            日常观察者日记
          </h3>
          <div className="text-[12px] text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
            今日
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-[16px] p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-800/80 leading-relaxed font-medium">
            记录长辈的精神行为症状 (BPSD) 有助于医生调整用药方案。请客观记录今日发生的异常行为。
          </p>
        </div>

        {/* BPSD 症状多选 */}
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-slate-700">今日出现的精神行为症状 (多选)</label>
          <div className="flex flex-wrap gap-2">
            {bpsdOptions.map(s => (
              <button
                key={s}
                onClick={() => toggleBpsd(s)}
                className={`px-3 py-1.5 rounded-[10px] text-[12px] font-medium transition-all ${
                  bpsd.includes(s) ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 严重程度 */}
        {bpsd.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[13px] font-semibold text-slate-700">症状严重程度 <span className="text-rose-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSeverity('mild')}
                className={`py-2.5 rounded-[12px] text-[12px] font-semibold transition-all ${
                  severity === 'mild' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                轻度 (易安抚)
              </button>
              <button
                onClick={() => setSeverity('moderate')}
                className={`py-2.5 rounded-[12px] text-[12px] font-semibold transition-all ${
                  severity === 'moderate' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                中度 (难安抚)
              </button>
              <button
                onClick={() => setSeverity('severe')}
                className={`py-2.5 rounded-[12px] text-[12px] font-semibold transition-all ${
                  severity === 'severe' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                重度 (有危险)
              </button>
            </div>
            {severity === 'severe' && (
              <div className="flex items-start gap-2 mt-2 bg-rose-50 p-2.5 rounded-[12px]">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-[11px] text-rose-600 font-medium leading-relaxed">
                  重度症状可能对长辈或照护者造成伤害，建议立即联系主治医生或前往医院就诊。
                </span>
              </div>
            )}
          </div>
        )}

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
