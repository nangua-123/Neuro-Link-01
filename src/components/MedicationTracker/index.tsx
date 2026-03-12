import React, { useState } from 'react';
import { CheckCircle2, Pill, AlertCircle, Settings, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store';
import { Toast } from 'antd-mobile';
import { MedicationSetupModal } from '../MedicationSetupModal';

export function MedicationTracker() {
  const { medicationPlans, todayTakenIds, toggleMedication, lastMedicationDate } = useAppStore();
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Check if it's a new day to reset local view (store handles actual reset on toggle)
  const isToday = lastMedicationDate === new Date().toDateString();
  const activeTakenIds = isToday ? todayTakenIds : [];

  const totalCount = medicationPlans.length;
  const takenCount = activeTakenIds.length;
  const progress = totalCount === 0 ? 0 : (takenCount / totalCount) * 100;

  const handleToggle = (id: string, isTaken: boolean) => {
    toggleMedication(id);
    if (!isTaken) {
      Toast.show({ content: '打卡成功', icon: 'success' });
    } else {
      Toast.show({ content: '已撤销打卡' });
    }
  };

  // 漏服补救提示逻辑: 如果现在是下午/晚上，但早上的药没吃
  const currentHour = new Date().getHours();
  const hasMorningPlan = medicationPlans.some(p => p.time === 'morning');
  const morningTaken = medicationPlans.filter(p => p.time === 'morning').every(p => activeTakenIds.includes(p.id));
  const showMissedWarning = currentHour >= 14 && hasMorningPlan && !morningTaken;

  const timeMap: Record<string, string> = {
    morning: '晨起',
    noon: '中午',
    evening: '晚间',
    bedtime: '睡前'
  };

  // Sort plans by time
  const timeOrder = ['morning', 'noon', 'evening', 'bedtime'];
  const sortedPlans = [...medicationPlans].sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time));

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <Pill className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-[15px] font-bold text-slate-900">用药打卡</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium mb-0.5">今日进度</div>
            <div className="text-[14px] font-bold text-indigo-600 tracking-tight">
              {takenCount} <span className="text-[10px] text-slate-400 font-medium">/ {totalCount}</span>
            </div>
          </div>
          <div className="w-[1px] h-6 bg-slate-100" />
          <button 
            onClick={() => setIsSetupOpen(true)} 
            className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {showMissedWarning && (
        <div className="mb-4 bg-amber-50 border border-amber-100/50 rounded-[12px] p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700/90 leading-relaxed font-medium">
            检测到您可能漏服了早上的药物。请勿将早晚剂量叠加服用，如不确定请遵医嘱或咨询医生。
          </p>
        </div>
      )}

      {sortedPlans.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-[16px] border border-slate-100 border-dashed">
          <p className="text-[13px] text-slate-500 font-medium mb-2">尚未配置用药计划</p>
          <button 
            onClick={() => setIsSetupOpen(true)} 
            className="text-[12px] text-indigo-600 font-semibold bg-indigo-50 px-4 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            立即配置
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedPlans.map(plan => {
            const isTaken = activeTakenIds.includes(plan.id);
            return (
              <div 
                key={plan.id} 
                className={`flex items-center justify-between p-3 rounded-[16px] border transition-colors ${
                  isTaken ? 'bg-slate-50/50 border-transparent' : 'bg-slate-50 border-slate-100/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-semibold text-slate-500">{timeMap[plan.time]}</span>
                    <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                      {plan.dose}
                    </span>
                  </div>
                  <p className={`text-[13px] font-bold transition-colors ${isTaken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {plan.name}
                  </p>
                </div>
                {isTaken ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-emerald-500 text-[12px] font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      已服药
                    </div>
                    <button 
                      onClick={() => handleToggle(plan.id, isTaken)} 
                      className="p-1.5 text-slate-300 hover:text-slate-500 active:bg-slate-100 rounded-full transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleToggle(plan.id, isTaken)}
                    className="bg-slate-900 text-white text-[12px] font-semibold px-5 py-2 rounded-full active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                  >
                    打卡
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <MedicationSetupModal visible={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
    </div>
  );
}
