import React from 'react';
import { Popup } from 'antd-mobile';
import { FileText, X, Activity, AlertTriangle, Pill } from 'lucide-react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  diseaseTag: DiseaseTag;
}

export function ClinicSummaryCard({ visible, onClose, diseaseTag }: Props) {
  const { seizureRecords, migraineRecords, getMonthlyPainkillerCount, medicationPlans } = useAppStore();

  // 计算近 30 天数据
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  const recentSeizures = seizureRecords.filter(r => r.timestamp >= thirtyDaysAgo);
  const recentMigraines = migraineRecords.filter(r => r.timestamp >= thirtyDaysAgo);

  const isEpilepsy = diseaseTag === DiseaseTag.EPILEPSY;
  
  const totalAttacks = isEpilepsy ? recentSeizures.length : recentMigraines.length;
  
  let maxDuration = '-';
  if (isEpilepsy && recentSeizures.length > 0) {
    const durations = recentSeizures.map(r => r.duration);
    if (durations.includes('>30min')) maxDuration = '>30分钟';
    else if (durations.includes('15-30min')) maxDuration = '15-30分钟';
    else if (durations.includes('5-15min')) maxDuration = '5-15分钟';
    else if (durations.includes('<5min')) maxDuration = '<5分钟';
    else maxDuration = '<1分钟';
  }

  const mohCount = getMonthlyPainkillerCount();

  return (
    <Popup 
      visible={visible} 
      onMaskClick={onClose}
      bodyStyle={{ 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px', 
        backgroundColor: '#18181b', // zinc-900
        padding: 0,
        maxHeight: '90vh', 
        overflowY: 'auto' 
      }}
    >
      <div className="p-5 pb-[calc(24px+env(safe-area-inset-bottom))] font-sans text-zinc-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-bold tracking-widest uppercase text-zinc-400">Clinic Summary</span>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full active:scale-95">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* 登机牌式卡片 */}
        <div className="bg-white text-zinc-900 rounded-[16px] overflow-hidden shadow-2xl relative">
          {/* 顶部条码装饰 */}
          <div className="h-2 w-full bg-repeating-linear-gradient-to-r from-zinc-900 to-zinc-900 bg-[length:4px_100%] bg-no-repeat" style={{ backgroundImage: 'repeating-linear-gradient(to right, #18181b, #18181b 2px, transparent 2px, transparent 4px)' }} />
          
          <div className="p-5">
            <div className="flex justify-between items-end mb-6 border-b-2 border-zinc-900 pb-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">{isEpilepsy ? '癫痫' : '偏头痛'}</h2>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">近30天复诊摘要</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black leading-none">{totalAttacks}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">发作总数</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {isEpilepsy ? (
                <div className="bg-zinc-100 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">最长持续时间</span>
                  </div>
                  <div className="text-lg font-black">{maxDuration}</div>
                </div>
              ) : (
                <div className="bg-zinc-100 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">MOH 预警</span>
                  </div>
                  <div className="text-lg font-black">{mohCount >= 9 ? '高风险' : mohCount >= 6 ? '中风险' : '安全'}</div>
                  <div className="text-[10px] text-zinc-500 font-medium">本月急性药 {mohCount} 天</div>
                </div>
              )}
              
              <div className="bg-zinc-100 p-3 rounded-lg">
                <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                  <Pill className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">当前用药</span>
                </div>
                <div className="text-sm font-bold truncate">
                  {medicationPlans.length > 0 ? medicationPlans[0].name : '未设置用药方案'}
                </div>
                {medicationPlans.length > 1 && (
                  <div className="text-[10px] text-zinc-500 font-medium">等 {medicationPlans.length} 种药物</div>
                )}
              </div>
            </div>

            {/* 底部条码 */}
            <div className="mt-4 pt-4 border-t-2 border-dashed border-zinc-300 flex justify-between items-center">
              <div className="text-[10px] font-mono text-zinc-400">ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
