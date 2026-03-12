import React, { useState } from 'react';
import { Popup, Input, Button, Selector, Toast } from 'antd-mobile';
import { Plus, Trash2, X } from 'lucide-react';
import { useAppStore } from '../../store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const timeOptions = [
  { label: '晨起', value: 'morning' },
  { label: '中午', value: 'noon' },
  { label: '晚间', value: 'evening' },
  { label: '睡前', value: 'bedtime' },
];

export function MedicationSetupModal({ visible, onClose }: Props) {
  const { medicationPlans, addMedicationPlan, removeMedicationPlan } = useAppStore();
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState<string[]>(['morning']);

  const handleAdd = () => {
    if (!name.trim() || !dose.trim() || time.length === 0) {
      Toast.show({ content: '请完整填写药物信息' });
      return;
    }
    addMedicationPlan({
      name: name.trim(),
      dose: dose.trim(),
      time: time[0] as any,
    });
    setName('');
    setDose('');
    Toast.show({ content: '添加成功', icon: 'success' });
  };

  const getTimeLabel = (t: string) => timeOptions.find(o => o.value === t)?.label || t;

  return (
    <Popup 
      visible={visible} 
      onMaskClick={onClose} 
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px', 
        minHeight: '60vh', 
        padding: '24px', 
        backgroundColor: '#FAFAFA' 
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-slate-900">用药计划配置</h3>
        <div onClick={onClose} className="p-2 bg-slate-100 rounded-full active:scale-95 cursor-pointer">
          <X className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Plans */}
        <div>
          <h4 className="text-[14px] font-semibold text-slate-700 mb-3">当前服药清单</h4>
          {medicationPlans.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-[13px] bg-white rounded-[16px] border border-slate-100 border-dashed">
              暂无服药计划，请在下方添加
            </div>
          ) : (
            <div className="space-y-3">
              {medicationPlans.map(plan => (
                <div key={plan.id} className="flex items-center justify-between bg-white p-3 rounded-[16px] border border-slate-100 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {getTimeLabel(plan.time)}
                      </span>
                      <span className="text-[12px] text-slate-500 font-medium">{plan.dose}</span>
                    </div>
                    <div className="text-[14px] font-bold text-slate-800">{plan.name}</div>
                  </div>
                  <button 
                    onClick={() => removeMedicationPlan(plan.id)} 
                    className="p-2 text-rose-400 active:bg-rose-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-[1px] bg-slate-200/60" />

        {/* Add New Plan */}
        <div>
          <h4 className="text-[14px] font-semibold text-slate-700 mb-3">添加新药物</h4>
          <div className="space-y-4 bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 rounded-[12px] px-3 py-1 border border-slate-100">
              <Input 
                placeholder="药物名称 (如: 左乙拉西坦片)" 
                value={name} 
                onChange={setName} 
                className="text-[14px]" 
                clearable 
              />
            </div>
            <div className="bg-slate-50 rounded-[12px] px-3 py-1 border border-slate-100">
              <Input 
                placeholder="单次剂量 (如: 500mg 或 1片)" 
                value={dose} 
                onChange={setDose} 
                className="text-[14px]" 
                clearable 
              />
            </div>
            <div>
              <div className="text-[12px] text-slate-500 mb-2 font-medium">服药时段</div>
              <Selector
                options={timeOptions}
                value={time}
                onChange={v => setTime(v)}
                style={{ '--border-radius': '12px', '--padding': '8px 12px', fontSize: '13px' } as any}
              />
            </div>
            <Button 
              block 
              color="primary" 
              onClick={handleAdd} 
              className="rounded-[16px] h-11 font-bold text-[14px] bg-indigo-600 border-none shadow-[0_4px_12px_rgba(79,70,229,0.2)]"
            >
              <Plus className="w-4 h-4 inline-block mr-1 -mt-0.5" /> 添加到计划
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
