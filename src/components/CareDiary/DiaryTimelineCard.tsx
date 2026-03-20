import React from 'react';
import { CareDiaryRecord } from '../../interfaces/careDiary';
import { BPSD_SYMPTOMS_DICT, BASIC_STATUS_DICT, ADL_ITEMS } from '../../configs/careDiary';
import { AlertTriangle, Moon, Coffee, Smile, Activity } from 'lucide-react';

interface DiaryTimelineCardProps {
  record: CareDiaryRecord;
  subjectLabel: string;
}

export const DiaryTimelineCard: React.FC<DiaryTimelineCardProps> = ({ record, subjectLabel }) => {
  const { basicStatus, bpsdSymptoms, adlStatus, notes, hasSevereIncident } = record;

  const getStatusLabel = (type: 'sleep' | 'appetite' | 'mood', val: string) => {
    return BASIC_STATUS_DICT[type].find(i => i.value === val)?.label || val;
  };

  const getStatusColor = (type: 'sleep' | 'appetite' | 'mood', val: string) => {
    return BASIC_STATUS_DICT[type].find(i => i.value === val)?.color || 'text-slate-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 relative overflow-hidden">
      {/* 严重事件高亮背景 */}
      {hasSevereIncident && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 to-rose-500" />
      )}

      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${hasSevereIncident ? 'bg-rose-50 border-rose-100/50 text-rose-500' : 'bg-blue-50 border-blue-100/50 text-blue-500'}`}>
            {hasSevereIncident ? <AlertTriangle size={18} /> : <Activity size={18} />}
          </div>
          <div>
            <span className="font-bold text-[16px] text-slate-800 tracking-tight">{record.date}</span>
            <div className="text-[12px] text-slate-500 font-medium mt-0.5">日常照护记录</div>
          </div>
        </div>
        {hasSevereIncident && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100/50 shadow-sm">
            <AlertTriangle size={12} /> 严重事件
          </span>
        )}
      </div>

      {/* 基础生理状态 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50/80 rounded-[16px] p-3 flex flex-col items-center justify-center gap-1.5 border border-slate-100/50 shadow-sm">
          <Moon size={18} className="text-slate-400" />
          <span className="text-[11px] text-slate-500 font-medium">睡眠</span>
          <span className={`text-[13px] font-bold ${getStatusColor('sleep', basicStatus.sleepQuality)}`}>
            {getStatusLabel('sleep', basicStatus.sleepQuality)}
          </span>
        </div>
        <div className="bg-slate-50/80 rounded-[16px] p-3 flex flex-col items-center justify-center gap-1.5 border border-slate-100/50 shadow-sm">
          <Coffee size={18} className="text-slate-400" />
          <span className="text-[11px] text-slate-500 font-medium">饮食</span>
          <span className={`text-[13px] font-bold ${getStatusColor('appetite', basicStatus.appetite)}`}>
            {getStatusLabel('appetite', basicStatus.appetite)}
          </span>
        </div>
        <div className="bg-slate-50/80 rounded-[16px] p-3 flex flex-col items-center justify-center gap-1.5 border border-slate-100/50 shadow-sm">
          <Smile size={18} className="text-slate-400" />
          <span className="text-[11px] text-slate-500 font-medium">情绪</span>
          <span className={`text-[13px] font-bold ${getStatusColor('mood', basicStatus.mood)}`}>
            {getStatusLabel('mood', basicStatus.mood)}
          </span>
        </div>
      </div>

      {/* BPSD 症状 */}
      {bpsdSymptoms.length > 0 && (
        <div className="mb-5">
          <h4 className="text-[12px] font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
            <div className="w-1 h-3 rounded-full bg-blue-400" />
            精神行为症状 (BPSD)
          </h4>
          <div className="flex flex-wrap gap-2">
            {bpsdSymptoms.map(id => {
              const symptom = BPSD_SYMPTOMS_DICT.find(s => s.id === id);
              if (!symptom) return null;
              return (
                <span 
                  key={id} 
                  className={`text-[12px] px-3 py-1.5 rounded-full font-bold border shadow-sm ${
                    symptom.isHighRisk ? 'bg-rose-50 text-rose-600 border-rose-100/50' : 'bg-blue-50 text-blue-600 border-blue-100/50'
                  }`}
                >
                  {symptom.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ADL 状态 */}
      {adlStatus.length > 0 && (
        <div className="mb-5">
          <h4 className="text-[12px] font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
            <div className="w-1 h-3 rounded-full bg-emerald-400" />
            需协助的日常活动 (ADL)
          </h4>
          <div className="flex flex-wrap gap-2">
            {adlStatus.map(id => {
              const item = ADL_ITEMS.find(i => i.id === id);
              if (!item) return null;
              return (
                <span key={id} className="text-[12px] px-3 py-1.5 rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm">
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 补充记录 */}
      {notes && (
        <div className="mt-2 pt-4 border-t border-slate-100/80">
          <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap font-medium bg-slate-50/50 p-3 rounded-[16px] border border-slate-100/50">
            {notes}
          </p>
        </div>
      )}
    </div>
  );
};
