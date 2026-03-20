import React, { useState, useEffect } from 'react';
import { Popup, Button, TextArea, Switch, Dialog } from 'antd-mobile';
import { X, AlertTriangle } from 'lucide-react';
import { StatusCapsuleGroup } from './StatusCapsuleGroup';
import { BASIC_STATUS_DICT, BPSD_SYMPTOMS_DICT, ADL_ITEMS, ADL_LEVELS } from '../../configs/careDiary';
import { useAppStore } from '../../store';

interface RecordSheetProps {
  visible: boolean;
  onClose: () => void;
  date: string;
}

export const RecordSheet: React.FC<RecordSheetProps> = ({ visible, onClose, date }) => {
  const { hasSignedAgreement, signAgreement, addCareDiaryRecord, identity } = useAppStore();
  
  const [sleepQuality, setSleepQuality] = useState('normal');
  const [appetite, setAppetite] = useState('good');
  const [mood, setMood] = useState('calm');
  const [bpsdSymptoms, setBpsdSymptoms] = useState<string[]>([]);
  const [adlStatus, setAdlStatus] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [hasSevereIncident, setHasSevereIncident] = useState(false);

  // Reset form when visible changes
  useEffect(() => {
    if (visible) {
      setSleepQuality('normal');
      setAppetite('good');
      setMood('calm');
      setBpsdSymptoms([]);
      setAdlStatus([]);
      setNotes('');
      setHasSevereIncident(false);
    }
  }, [visible]);

  const handleSave = () => {
    // JIT Route Guard: 检查是否签署协议
    if (!hasSignedAgreement) {
      Dialog.confirm({
        title: '数据授权协议',
        content: '为了给您提供更精准的AI分析与疾病管理服务，我们需要收集并分析您的照护记录数据。请确认您已阅读并同意《三方电子联合数据授权协议》。',
        confirmText: '同意并继续',
        cancelText: '暂不记录',
        onConfirm: () => {
          signAgreement();
          saveRecord();
        }
      });
      return;
    }
    
    saveRecord();
  };

  const saveRecord = () => {
    addCareDiaryRecord({
      basicStatus: { sleepQuality, appetite, mood },
      bpsdSymptoms,
      adlStatus,
      notes,
      hasSevereIncident
    });
    onClose();
  };

  const isPatient = identity === 'PATIENT';
  const subjectLabel = isPatient ? '您' : '长辈';

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: '90vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}
    >
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white rounded-t-3xl sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">照护日记</h2>
            <p className="text-xs text-slate-400 mt-1">{date}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-8">
          
          {/* 基础生理状态 */}
          <section className="space-y-6 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-800 flex items-center">
              <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
              基础生理状态
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-2">{subjectLabel}昨晚睡得好吗？</p>
                <StatusCapsuleGroup 
                  options={BASIC_STATUS_DICT.sleep} 
                  value={sleepQuality} 
                  onChange={setSleepQuality} 
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">{subjectLabel}今天胃口如何？</p>
                <StatusCapsuleGroup 
                  options={BASIC_STATUS_DICT.appetite} 
                  value={appetite} 
                  onChange={setAppetite} 
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">{subjectLabel}今天情绪状态？</p>
                <StatusCapsuleGroup 
                  options={BASIC_STATUS_DICT.mood} 
                  value={mood} 
                  onChange={setMood} 
                />
              </div>
            </div>
          </section>

          {/* 精神行为症状 (BPSD) */}
          <section className="space-y-4 bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                精神行为症状 (BPSD)
              </h3>
              <span className="text-xs text-slate-400">可多选</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              请记录{subjectLabel}今天是否出现以下异常行为。带 <AlertTriangle size={12} className="inline text-rose-500 mx-0.5" /> 标记的为高危症状。
            </p>
            
            <StatusCapsuleGroup 
              multiple
              options={BPSD_SYMPTOMS_DICT.map(s => ({
                value: s.id,
                label: s.label + (s.isHighRisk ? ' ⚠️' : ''),
                bg: s.isHighRisk && bpsdSymptoms.includes(s.id) ? 'bg-rose-50' : undefined,
                color: s.isHighRisk && bpsdSymptoms.includes(s.id) ? 'text-rose-600' : undefined
              }))} 
              value={bpsdSymptoms} 
              onChange={setBpsdSymptoms} 
            />
          </section>

          {/* 日常生活能力 (ADL) 简记 */}
          <section className="space-y-4 bg-white p-5 rounded-2xl shadow-sm">
             <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <span className="w-1 h-4 bg-emerald-500 rounded-full mr-2"></span>
                日常生活能力 (ADL)
              </h3>
              <span className="text-xs text-slate-400">需要协助的项目</span>
            </div>
            <StatusCapsuleGroup 
              multiple
              options={ADL_ITEMS.map(item => ({ value: item.id, label: item.label }))} 
              value={adlStatus} 
              onChange={setAdlStatus} 
            />
          </section>

          {/* 严重事件与备注 */}
          <section className="space-y-4 bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-700">发生严重意外</p>
                  <p className="text-xs text-rose-500/80">如走失、跌倒、严重伤人等</p>
                </div>
              </div>
              <Switch 
                checked={hasSevereIncident} 
                onChange={setHasSevereIncident} 
                style={{ '--checked-color': '#ef4444' }}
              />
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-800 mb-2">补充记录</h3>
              <div className="bg-slate-50 rounded-xl p-1">
                <TextArea
                  placeholder={`记录${subjectLabel}今天的特殊情况、用药反应或您的照护心得...`}
                  value={notes}
                  onChange={setNotes}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  className="bg-transparent text-sm"
                  style={{ '--font-size': '14px' }}
                />
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full h-12 font-bold shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-95 transition-transform"
            onClick={handleSave}
          >
            保存记录
          </button>
        </div>
      </div>
    </Popup>
  );
};
