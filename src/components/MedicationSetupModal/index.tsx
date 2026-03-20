import React, { useState, useEffect } from 'react';
import { Popup, Input, Button, DatePicker, Picker, TextArea, Toast, Switch } from 'antd-mobile';
import { X, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const durationOptions = [
  [{ label: '长期', value: '长期' }, { label: '1天', value: '1天' }, { label: '2天', value: '2天' }, { label: '3天', value: '3天' }, { label: '1周', value: '1周' }, { label: '2周', value: '2周' }, { label: '1个月', value: '1个月' }]
];

const usageOptions = [
  [{ label: '口服', value: '口服' }, { label: '外用', value: '外用' }, { label: '注射', value: '注射' }, { label: '吸入', value: '吸入' }, { label: '含服', value: '含服' }]
];

const frequencyOptions = [
  [{ label: '每天1次', value: '1' }, { label: '每天2次', value: '2' }, { label: '每天3次', value: '3' }, { label: '每天4次', value: '4' }, { label: '每天5次', value: '5' }]
];

const instructionOptions = ['餐前', '餐后', '空腹', '随餐服用', '睡前'];
const unitOptions = ['片', '克', '毫克', '毫升', 'IU', '杯', '揿', '粒', '颗', '袋', '支', '瓶', '滴', '匙', '喷', '吸', '包', '微克'];

export function MedicationSetupModal({ visible, onClose }: Props) {
  const { addMedicationPlan } = useAppStore();
  
  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState<string[]>(['长期']);
  const [usage, setUsage] = useState<string[]>(['口服']);
  const [planType, setPlanType] = useState<'daily' | 'interval'>('daily');
  const [frequency, setFrequency] = useState<string[]>(['1']);
  const [intervalDays, setIntervalDays] = useState<string[]>(['1']);
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [doseAmount, setDoseAmount] = useState('');
  const [doseUnit, setDoseUnit] = useState('片');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // UI State
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showUsagePicker, setShowUsagePicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDoseModal, setShowDoseModal] = useState(false);
  
  // Time Picker State
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);

  // Generate interval options (1 to 30 days)
  const intervalOptions = [
    Array.from({ length: 30 }, (_, i) => ({ label: `${i + 1}天一次`, value: String(i + 1) }))
  ];

  // Update times array when frequency changes (only for daily plan)
  useEffect(() => {
    if (planType === 'daily') {
      const freq = parseInt(frequency[0] || '1', 10);
      setTimes(prev => {
        const newTimes = [...prev];
        if (newTimes.length < freq) {
          const defaultTimes = ['08:00', '12:00', '18:00', '22:00', '00:00'];
          for (let i = newTimes.length; i < freq; i++) {
            newTimes.push(defaultTimes[i % defaultTimes.length]);
          }
        } else if (newTimes.length > freq) {
          newTimes.splice(freq);
        }
        return newTimes;
      });
    } else {
      // For interval plan, default to 1 time per day
      setTimes(prev => prev.slice(0, 1));
    }
  }, [frequency, planType]);

  const handleSave = () => {
    if (!name.trim()) {
      Toast.show({ content: '请输入药品名称' });
      return;
    }
    if (!doseAmount.trim()) {
      Toast.show({ content: '请选择用药剂量' });
      return;
    }

    // Map to existing time format for backward compatibility
    let mappedTime: 'morning' | 'noon' | 'evening' | 'bedtime' = 'morning';
    const firstTime = times[0];
    const hour = parseInt(firstTime.split(':')[0], 10);
    if (hour >= 5 && hour < 11) mappedTime = 'morning';
    else if (hour >= 11 && hour < 16) mappedTime = 'noon';
    else if (hour >= 16 && hour < 21) mappedTime = 'evening';
    else mappedTime = 'bedtime';

    addMedicationPlan({
      name: name.trim(),
      dose: `${doseAmount}${doseUnit}`,
      time: mappedTime,
      reminderEnabled,
      reminderTime: times[0], // Use first time as primary reminder for now
      startDate: startDate.toISOString().split('T')[0],
      duration: duration[0],
      usage: usage[0],
      planType,
      frequency: planType === 'daily' ? parseInt(frequency[0], 10) : 1,
      times,
      doseAmount,
      doseUnit,
      instructions: instructions.join(','),
      notes: notes.trim()
    });

    Toast.show({ content: '添加成功', icon: 'success' });
    onClose();
    
    // Reset form
    setName('');
    setStartDate(new Date());
    setDuration(['长期']);
    setUsage(['口服']);
    setPlanType('daily');
    setFrequency(['1']);
    setIntervalDays(['1']);
    setTimes(['08:00']);
    setDoseAmount('');
    setDoseUnit('片');
    setInstructions([]);
    setNotes('');
    setReminderEnabled(true);
  };

  const toggleInstruction = (inst: string) => {
    setInstructions(prev => 
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    );
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Generate time options for Picker (00:00 to 23:59)
  const timePickerColumns = [
    Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, '0'), value: String(i).padStart(2, '0') })),
    Array.from({ length: 60 }, (_, i) => ({ label: String(i).padStart(2, '0'), value: String(i).padStart(2, '0') }))
  ];

  return (
    <Popup 
      visible={visible} 
      onMaskClick={onClose} 
      bodyStyle={{ 
        height: '90vh', 
        borderTopLeftRadius: '20px', 
        borderTopRightRadius: '20px', 
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 shrink-0">
        <div className="w-8" /> {/* Spacer for centering */}
        <h3 className="text-[17px] font-bold text-slate-900">添加用药计划</h3>
        <div onClick={onClose} className="w-8 h-8 flex items-center justify-end cursor-pointer">
          <X className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50/50 px-4 py-2.5 flex items-center shrink-0">
        <span className="text-[13px] text-amber-600 font-medium">温馨提示：用药请遵循医嘱</span>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* 药品 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div className="text-[15px] text-slate-800 font-medium shrink-0">
            药品 <span className="text-red-500">*</span>
          </div>
          <div className="flex-1 ml-4">
            <Input 
              placeholder="输入药品名称" 
              value={name} 
              onChange={setName} 
              className="text-right text-[15px] font-bold text-slate-800"
              style={{ '--placeholder-color': '#94a3b8' }}
            />
          </div>
        </div>

        {/* 用药开始日期 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100" onClick={() => setShowStartDatePicker(true)}>
          <div className="text-[15px] text-slate-800 font-medium shrink-0">用药开始日期</div>
          <div className="flex items-center gap-1 text-[15px] font-bold text-slate-800">
            {formatDate(startDate)}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 用药持续时间 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100" onClick={() => setShowDurationPicker(true)}>
          <div className="text-[15px] text-slate-800 font-medium shrink-0">用药持续时间</div>
          <div className="flex items-center gap-1 text-[15px] font-bold text-slate-800">
            {duration[0]}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 用法 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100" onClick={() => setShowUsagePicker(true)}>
          <div className="text-[15px] text-slate-800 font-medium shrink-0">用法</div>
          <div className="flex items-center gap-1 text-[15px] font-bold text-slate-800">
            {usage[0]}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 用药方案 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div className="text-[15px] text-slate-800 font-medium shrink-0">
            用药方案 <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-2 bg-slate-100/80 p-1 rounded-full">
            <div 
              onClick={() => setPlanType('daily')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${planType === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              每天几次
            </div>
            <div 
              onClick={() => setPlanType('interval')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${planType === 'interval' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              几天一次
            </div>
          </div>
        </div>

        {/* 用药次数 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100" onClick={() => setShowFrequencyPicker(true)}>
          <div className="text-[15px] text-slate-800 font-medium shrink-0">
            用药次数 <span className="text-red-500">*</span>
          </div>
          <div className="flex items-center gap-1 text-[15px] font-bold text-slate-800">
            {planType === 'daily' ? `每天${frequency[0]}次` : `${intervalDays[0]}天1次`}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 用药时间 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div className="text-[15px] text-slate-800 font-medium shrink-0">用药时间</div>
          <div className="flex flex-wrap justify-end gap-2 ml-4">
            {times.map((t, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setCurrentTimeIndex(idx);
                  setShowTimePicker(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full text-[14px] text-blue-600 font-bold active:scale-95 transition-transform"
              >
                {t} <ChevronRight className="w-3 h-3 text-blue-400" />
              </div>
            ))}
          </div>
        </div>

        {/* 开启提醒 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div className="text-[15px] text-slate-800 font-medium shrink-0">开启提醒</div>
          <Switch
            checked={reminderEnabled}
            onChange={setReminderEnabled}
            style={{
              '--checked-color': '#3b82f6',
              '--height': '24px',
              '--width': '42px',
            }}
          />
        </div>

        {/* 用药剂量 */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100" onClick={() => setShowDoseModal(true)}>
          <div className="text-[15px] text-slate-800 font-medium shrink-0">用药剂量</div>
          <div className="flex items-center gap-1 text-[15px] font-bold text-slate-800">
            {doseAmount ? `${doseAmount}${doseUnit}` : <span className="text-slate-400 font-medium">请选择</span>}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 用药指导 */}
        <div className="py-4 border-b border-slate-100">
          <div className="text-[15px] text-slate-800 font-medium mb-3">用药指导</div>
          <div className="flex flex-wrap gap-2">
            {instructionOptions.map(inst => (
              <div 
                key={inst}
                onClick={() => toggleInstruction(inst)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${instructions.includes(inst) ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-500 border border-transparent'}`}
              >
                {inst}
              </div>
            ))}
          </div>
        </div>

        {/* 备注 */}
        <div className="py-4">
          <div className="text-[15px] text-slate-800 font-medium mb-3">备注</div>
          <div className="bg-slate-50 rounded-[20px] p-4 relative border border-slate-100/60">
            <TextArea
              placeholder="请填写"
              value={notes}
              onChange={setNotes}
              maxLength={100}
              rows={3}
              className="bg-transparent text-[15px] font-medium text-slate-800"
              style={{ '--placeholder-color': '#94a3b8' }}
            />
            <div className="absolute bottom-3 right-4 text-[12px] font-bold text-slate-400">
              {notes.length}/100
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="shrink-0 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+24px)] bg-white border-t border-slate-100 z-50">
        <button 
          onClick={handleSave} 
          className="w-full bg-[#1677FF] text-white rounded-[20px] h-14 flex items-center justify-center text-[16px] font-bold shadow-[0_8px_24px_rgba(22,119,255,0.25)] active:scale-95 transition-all duration-300"
        >
          确定
        </button>
      </div>

      {/* Pickers */}
      <DatePicker
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        value={startDate}
        onConfirm={setStartDate}
        title="选择开始日期"
      />
      
      <Picker
        columns={durationOptions}
        visible={showDurationPicker}
        onClose={() => setShowDurationPicker(false)}
        value={duration}
        onConfirm={(val) => setDuration([String(val[0])])}
        title="用药持续时间"
      />

      <Picker
        columns={usageOptions}
        visible={showUsagePicker}
        onClose={() => setShowUsagePicker(false)}
        value={usage}
        onConfirm={(val) => setUsage([String(val[0])])}
        title="用法"
      />

      <Picker
        columns={planType === 'daily' ? frequencyOptions : intervalOptions}
        visible={showFrequencyPicker}
        onClose={() => setShowFrequencyPicker(false)}
        value={planType === 'daily' ? frequency : intervalDays}
        onConfirm={(val) => {
          if (planType === 'daily') {
            setFrequency([String(val[0])]);
          } else {
            setIntervalDays([String(val[0])]);
          }
        }}
        title="用药次数"
      />

      <Picker
        columns={timePickerColumns}
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        value={times[currentTimeIndex] ? times[currentTimeIndex].split(':') : ['08', '00']}
        onConfirm={(val) => {
          setTimes(prev => {
            const newTimes = [...prev];
            newTimes[currentTimeIndex] = `${val[0]}:${val[1]}`;
            return newTimes;
          });
        }}
        title="选择时间"
      />

      {/* Dose Sub-Modal */}
      <Popup 
        visible={showDoseModal} 
        onMaskClick={() => setShowDoseModal(false)} 
        bodyStyle={{ 
          borderTopLeftRadius: '20px', 
          borderTopRightRadius: '20px', 
          padding: '20px',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-slate-900">药品使用剂量</h3>
          <div onClick={() => setShowDoseModal(false)} className="p-1">
            <X className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-[14px] font-medium text-slate-700 mb-3">每次用量</div>
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <Input 
              placeholder="请输入内容" 
              value={doseAmount} 
              onChange={setDoseAmount} 
              type="number"
              className="text-[16px] font-medium text-slate-800"
              style={{ '--placeholder-color': '#94a3b8' }}
            />
          </div>
        </div>
        
        <div className="mb-8">
          <div className="text-[14px] font-medium text-slate-700 mb-3">用药类型</div>
          <div className="grid grid-cols-5 gap-2.5">
            {unitOptions.map(unit => (
              <div 
                key={unit}
                onClick={() => setDoseUnit(unit)}
                className={`text-center py-2 rounded-lg text-[13px] font-medium transition-colors ${doseUnit === unit ? 'bg-[#1677FF] text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {unit}
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => setShowDoseModal(false)} 
          className="w-full bg-[#1677FF] text-white rounded-[20px] h-14 flex items-center justify-center text-[16px] font-bold shadow-[0_8px_24px_rgba(22,119,255,0.25)] active:scale-95 transition-all duration-300"
        >
          确定
        </button>
      </Popup>
    </Popup>
  );
}
