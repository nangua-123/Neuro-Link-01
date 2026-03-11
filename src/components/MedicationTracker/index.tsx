import React from 'react';
import { CheckCircle2, Pill, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { Toast } from 'antd-mobile';

export function MedicationTracker() {
  const { medicationStatus, checkInMedication } = useAppStore();

  const medications = [
    { id: 'morning', time: '早上', name: '左乙拉西坦片', dose: 500, taken: medicationStatus.morning },
    { id: 'noon', time: '中午', name: '丙戊酸钠缓释片', dose: 500, taken: medicationStatus.noon },
    { id: 'evening', time: '晚上', name: '左乙拉西坦片', dose: 500, taken: medicationStatus.evening },
  ] as const;

  const totalDose = 1500;
  const takenDose = medications.reduce((acc, curr) => curr.taken ? acc + curr.dose : acc, 0);
  const progress = (takenDose / totalDose) * 100;

  const handleTake = (id: 'morning' | 'noon' | 'evening') => {
    checkInMedication(id);
    Toast.show({ content: '打卡成功', icon: 'success' });
  };

  // 漏服补救提示逻辑: 如果现在是下午/晚上，但早上的药没吃
  const currentHour = new Date().getHours();
  const showMissedWarning = currentHour >= 14 && !medicationStatus.morning;

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <Pill className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-[15px] font-bold text-slate-900">用药打卡</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-medium mb-0.5">今日已服 / 总剂量</div>
          <div className="text-[14px] font-bold text-indigo-600 tracking-tight">
            {takenDose} <span className="text-[10px] text-slate-400 font-medium">/ {totalDose} mg</span>
          </div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {showMissedWarning && (
        <div className="mb-4 bg-amber-50 border border-amber-100/50 rounded-[12px] p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700/90 leading-relaxed font-medium">
            检测到您可能漏服了早上的药物。请勿将早晚剂量叠加服用，如不确定请遵医嘱或咨询医生。
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {medications.map(med => (
          <div key={med.id} className="flex items-center justify-between p-3 rounded-[16px] bg-slate-50 border border-slate-100/50">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[11px] font-semibold text-slate-500">{med.time}</span>
                <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">{med.dose}mg</span>
              </div>
              <p className={`text-[13px] font-bold ${med.taken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {med.name}
              </p>
            </div>
            {med.taken ? (
              <div className="flex items-center gap-1 text-emerald-500 text-[12px] font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                已服药
              </div>
            ) : (
              <button 
                onClick={() => handleTake(med.id)}
                className="bg-slate-900 text-white text-[12px] font-semibold px-5 py-2 rounded-full active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              >
                打卡
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
