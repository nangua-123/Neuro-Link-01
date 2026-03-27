import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, HeartHandshake, Pill, CalendarDays, ChevronRight } from 'lucide-react';
import { DiseaseTag } from '../../configs/constants';

export function DiaryTimeline() {
  const { seizureRecords, migraineRecords, careDiaryRecords, missedMedicationDates, selectedDiseaseTag, identity } = useAppStore();
  const navigate = useNavigate();
  const isFamily = identity === 'FAMILY';

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - ts;
    const days = Math.floor(diff / (1000 * 3600 * 24));
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 0) return `今天 ${timeStr}`;
    if (days === 1) return `昨天 ${timeStr}`;
    return `${days}天前 ${timeStr}`;
  };

  // 1. Process Care Diary Records
  const formattedCareDiary = Object.values(careDiaryRecords).map(r => ({
    id: r.id,
    timestamp: r.timestamp,
    date: formatTime(r.timestamp),
    title: '照护日记',
    desc: r.hasSevereIncident ? '记录了严重事件' : `睡眠${r.basicStatus.sleepQuality} · 饮食${r.basicStatus.appetite} · 情绪${r.basicStatus.mood}`,
    type: r.hasSevereIncident ? 'severe' : 'normal',
    category: 'care',
    icon: HeartHandshake,
    color: r.hasSevereIncident ? 'rose' : 'blue'
  }));

  // 2. Process Seizure Records
  const formattedSeizure = seizureRecords.map(r => ({
    id: r.id,
    timestamp: r.timestamp,
    date: formatTime(r.timestamp),
    title: '癫痫发作',
    desc: `${r.type === 'generalized' ? '全面性强直阵挛' : '局灶性发作'} · 持续 ${r.duration}`,
    type: 'seizure',
    category: 'disease',
    icon: Activity,
    color: 'rose'
  }));

  // 3. Process Migraine Records
  const formattedMigraine = migraineRecords.map(r => ({
    id: r.id,
    timestamp: r.timestamp,
    date: formatTime(r.timestamp),
    title: '偏头痛发作',
    desc: `${r.severity === 'severe' ? '重度' : r.severity === 'moderate' ? '中度' : '轻度'}疼痛 (VAS ${r.vas})`,
    type: 'migraine',
    category: 'disease',
    icon: Zap,
    color: 'rose'
  }));

  // 4. Process Missed Medications
  const formattedMissedMeds = missedMedicationDates.map(dateStr => {
    const ts = new Date(dateStr).getTime();
    return {
      id: `missed_${ts}`,
      timestamp: ts,
      date: formatTime(ts),
      title: '漏服药物',
      desc: '未按时完成用药打卡',
      type: 'missed_med',
      category: 'medication',
      icon: Pill,
      color: 'amber'
    };
  });

  // Combine and sort all records
  let allRecords = [...formattedCareDiary, ...formattedMissedMeds];
  if (selectedDiseaseTag === DiseaseTag.EPILEPSY) {
    allRecords = [...allRecords, ...formattedSeizure];
  } else if (selectedDiseaseTag === DiseaseTag.MIGRAINE) {
    allRecords = [...allRecords, ...formattedMigraine];
  } else if (selectedDiseaseTag === DiseaseTag.NONE) {
    // If no specific disease, show all
    allRecords = [...allRecords, ...formattedSeizure, ...formattedMigraine];
  }

  allRecords.sort((a, b) => b.timestamp - a.timestamp);

  // Take top 5 for the home page
  const displayRecords = allRecords.slice(0, 5);

  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100', badge: 'bg-rose-100 text-rose-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-600' },
  };

  if (displayRecords.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
          <CalendarDays className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-[15px] font-bold text-slate-800 mb-1">暂无记录</h4>
        <p className="text-[13px] text-slate-500 mb-4">开始记录{isFamily ? '长辈' : '您'}的日常状态</p>
        <button 
          onClick={() => navigate('/diary')}
          className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[13px] font-bold active:scale-95 transition-transform"
        >
          去记录
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-500" />
          <span className="text-[15px] font-bold text-slate-800">近期记录</span>
        </div>
        <button 
          onClick={() => navigate('/diary')}
          className="text-[13px] text-slate-500 font-medium flex items-center gap-0.5 active:opacity-70"
        >
          查看全部 <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-slate-100 before:via-slate-200 before:to-transparent">
        {displayRecords.map((record, index) => {
          const Icon = record.icon;
          const colors = colorMap[record.color];

          return (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Timeline Node */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10 ${colors.bg}`}>
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>

              {/* Content Card */}
              <div className={`flex-1 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/80 shadow-sm`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-slate-800">{record.title}</span>
                  <span className="text-[11px] font-medium text-slate-500">{record.date}</span>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed">{record.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
