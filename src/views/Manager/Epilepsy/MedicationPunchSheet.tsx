import React, { useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { motion } from 'motion/react';
import { Pill, CheckCircle2, Circle, Clock } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface Medication {
  id: string;
  name: string;
  doses: {
    morning: { amount: number; taken: boolean };
    noon: { amount: number; taken: boolean };
    evening: { amount: number; taken: boolean };
  };
}

export default function MedicationPunchSheet({ visible, onClose }: Props) {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 'med_1',
      name: '丙戊酸钠',
      doses: {
        morning: { amount: 500, taken: true },
        noon: { amount: 0, taken: false },
        evening: { amount: 500, taken: false }
      }
    },
    {
      id: 'med_2',
      name: '左乙拉西坦',
      doses: {
        morning: { amount: 250, taken: false },
        noon: { amount: 250, taken: false },
        evening: { amount: 500, taken: false }
      }
    }
  ]);

  const toggleDose = (medId: string, time: 'morning' | 'noon' | 'evening') => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        return {
          ...med,
          doses: {
            ...med.doses,
            [time]: {
              ...med.doses[time],
              taken: !med.doses[time].taken
            }
          }
        };
      }
      return med;
    }));
  };

  const calculateTotal = (med: Medication) => {
    let total = 0;
    if (med.doses.morning.taken) total += med.doses.morning.amount;
    if (med.doses.noon.taken) total += med.doses.noon.amount;
    if (med.doses.evening.taken) total += med.doses.evening.amount;
    return total;
  };

  const calculatePrescribedTotal = (med: Medication) => {
    return med.doses.morning.amount + med.doses.noon.amount + med.doses.evening.amount;
  };

  const handleSubmit = () => {
    Toast.show({ icon: 'success', content: '打卡成功' });
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        minHeight: '70vh',
        backgroundColor: '#FAFAFA',
        padding: '24px'
      }}
    >
      <div className="flex flex-col h-full relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">用药打卡</h2>
              <p className="text-[11px] text-slate-400 font-medium">抗癫痫药物 (AEDs) 依从性追踪</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 flex-1 overflow-y-auto pb-24 hide-scrollbar">
          {medications.map(med => {
            const totalTaken = calculateTotal(med);
            const prescribedTotal = calculatePrescribedTotal(med);
            const progress = (totalTaken / prescribedTotal) * 100;

            return (
              <div key={med.id} className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
                {/* 药物头部信息 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100/50">
                      <Pill className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-[16px]">{med.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">今日已服 / 处方总量</div>
                    <div className="flex items-baseline justify-end space-x-1">
                      <span className={`text-xl font-bold tracking-tight ${totalTaken === prescribedTotal ? 'text-emerald-500' : 'text-blue-600'}`}>
                        {totalTaken}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">/ {prescribedTotal} mg</span>
                    </div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${totalTaken === prescribedTotal ? 'bg-emerald-400' : 'bg-blue-500'}`}
                  />
                </div>

                {/* 早中晚打卡区 */}
                <div className="grid grid-cols-3 gap-3">
                  {/* 早上 */}
                  {med.doses.morning.amount > 0 && (
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDose(med.id, 'morning')}
                      className={`relative p-3.5 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        med.doses.morning.taken 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm shadow-emerald-500/10' 
                          : 'border-slate-100/50 bg-slate-50/50'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        {med.doses.morning.taken ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <Clock className={`w-5 h-5 mb-2 ${med.doses.morning.taken ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className={`text-[13px] font-semibold mb-0.5 ${med.doses.morning.taken ? 'text-emerald-700' : 'text-slate-600'}`}>早</span>
                      <span className={`text-[11px] font-medium ${med.doses.morning.taken ? 'text-emerald-600/80' : 'text-slate-400'}`}>{med.doses.morning.amount}mg</span>
                    </motion.div>
                  )}

                  {/* 中午 */}
                  {med.doses.noon.amount > 0 && (
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDose(med.id, 'noon')}
                      className={`relative p-3.5 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        med.doses.noon.taken 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm shadow-emerald-500/10' 
                          : 'border-slate-100/50 bg-slate-50/50'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        {med.doses.noon.taken ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <Clock className={`w-5 h-5 mb-2 ${med.doses.noon.taken ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className={`text-[13px] font-semibold mb-0.5 ${med.doses.noon.taken ? 'text-emerald-700' : 'text-slate-600'}`}>中</span>
                      <span className={`text-[11px] font-medium ${med.doses.noon.taken ? 'text-emerald-600/80' : 'text-slate-400'}`}>{med.doses.noon.amount}mg</span>
                    </motion.div>
                  )}

                  {/* 晚上 */}
                  {med.doses.evening.amount > 0 && (
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDose(med.id, 'evening')}
                      className={`relative p-3.5 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        med.doses.evening.taken 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm shadow-emerald-500/10' 
                          : 'border-slate-100/50 bg-slate-50/50'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        {med.doses.evening.taken ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <Clock className={`w-5 h-5 mb-2 ${med.doses.evening.taken ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className={`text-[13px] font-semibold mb-0.5 ${med.doses.evening.taken ? 'text-emerald-700' : 'text-slate-600'}`}>晚</span>
                      <span className={`text-[11px] font-medium ${med.doses.evening.taken ? 'text-emerald-600/80' : 'text-slate-400'}`}>{med.doses.evening.amount}mg</span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 pt-4 pb-2 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-[24px] bg-slate-900 text-white font-medium text-[15px] tracking-wide shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
          >
            完成今日打卡
          </button>
        </div>
      </div>
    </Popup>
  );
}
