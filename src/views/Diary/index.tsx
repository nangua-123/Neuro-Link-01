import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Activity, Zap, Plus, CalendarDays, AlertCircle, Pill } from 'lucide-react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { MigraineDiarySheet } from '../../components/MigraineDiarySheet';
import { SeizureDiarySheet } from '../../components/SeizureDiarySheet';
import { ClinicSummaryCard } from '../../components/ClinicSummaryCard';

export default function DiaryView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDiseaseTag, seizureRecords, migraineRecords, getAIInsights, missedMedicationDates } = useAppStore();
  
  // 如果是 NONE，允许用户切换 tab，默认显示癫痫
  const [activeTab, setActiveTab] = useState<DiseaseTag>(
    location.state?.defaultTab || (selectedDiseaseTag !== DiseaseTag.NONE ? selectedDiseaseTag : DiseaseTag.EPILEPSY)
  );

  const [isMigraineVisible, setIsMigraineVisible] = useState(false);
  const [isSeizureVisible, setIsSeizureVisible] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // 根据 activeTab 判断当前显示的日记类型
  const isMigraine = activeTab === DiseaseTag.MIGRAINE;
  const isEpilepsy = activeTab === DiseaseTag.EPILEPSY;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - ts;
    const days = Math.floor(diff / (1000 * 3600 * 24));
    const timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (days === 0) return `今天 ${timeStr}`;
    if (days === 1) return `昨天 ${timeStr}`;
    return `${days}天前 ${timeStr}`;
  };

  const formattedMigraine = migraineRecords.map(r => ({
    date: formatTime(r.timestamp),
    timestamp: r.timestamp,
    desc: `${r.severity === 'severe' ? '重度' : r.severity === 'moderate' ? '中度' : '轻度'}疼痛 (VAS ${r.vas}) ${r.symptoms.length > 0 ? '· ' + r.symptoms.join(' ') : ''}`,
    type: r.meds.includes('acute') ? 'acute' : 'preventive',
    category: 'migraine'
  }));

  const formattedSeizure = seizureRecords.map(r => ({
    date: formatTime(r.timestamp),
    timestamp: r.timestamp,
    desc: `${r.type === 'generalized' ? '全面性强直阵挛' : '局灶性发作'} · 持续 ${r.duration}`,
    type: r.type,
    category: 'seizure'
  }));

  const formattedMissedMeds = missedMedicationDates.map(dateStr => {
    const ts = new Date(dateStr).getTime();
    return {
      date: formatTime(ts),
      timestamp: ts,
      desc: '漏服抗癫痫药物',
      type: 'missed_med',
      category: 'medication'
    };
  });

  // Causal Stream Timeline: Combine seizures and missed meds, sort by time descending
  const epilepsyTimeline = [...formattedSeizure, ...formattedMissedMeds].sort((a, b) => b.timestamp - a.timestamp);

  const aiInsights = getAIInsights();
  const currentInsight = isMigraine ? aiInsights.find(i => i.includes('头痛') || i.includes('MOH')) : aiInsights.find(i => i.includes('发作') || i.includes('癫痫'));

  // 统一主题配置 (Tech Blue & Indigo)
  const theme = isMigraine ? {
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-500',
    gradient: 'from-blue-50/80 via-blue-50/40',
    blob1: 'bg-blue-400/10',
    blob2: 'bg-blue-300/10',
    alertBg: 'bg-blue-50/50',
    alertBorder: 'border-blue-100',
    btnBg: 'bg-gradient-to-r from-blue-500 to-blue-500',
    icon: Activity,
    title: '头痛发作日记',
    btnText: '记录一次头痛',
    mockData: formattedMigraine.length > 0 ? formattedMigraine : [
      { date: '今天 14:30', desc: '中度疼痛 (VAS 5) · 畏光', type: 'acute', category: 'migraine' },
      { date: '3天前 09:00', desc: '轻度疼痛 (VAS 3) · 恶心', type: 'preventive', category: 'migraine' },
      { date: '上周 18:45', desc: '重度疼痛 (VAS 8) · 视觉先兆', type: 'acute', category: 'migraine' },
    ]
  } : {
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-500',
    gradient: 'from-blue-50/80 via-blue-50/40',
    blob1: 'bg-blue-400/10',
    blob2: 'bg-blue-300/10',
    alertBg: 'bg-blue-50/50',
    alertBorder: 'border-blue-100',
    btnBg: 'bg-gradient-to-r from-blue-500 to-blue-500',
    icon: Zap,
    title: '癫痫发作日记',
    btnText: '记录一次发作',
    mockData: epilepsyTimeline.length > 0 ? epilepsyTimeline : [
      { date: '昨天 10:15', desc: '局灶性发作 · 持续 2 分钟', type: 'focal', category: 'seizure' },
      { date: '5天前 22:30', desc: '全面性强直阵挛 · 持续 4 分钟', type: 'generalized', category: 'seizure' },
      { date: '2周前 08:00', desc: '失神发作 · 持续 30 秒', type: 'absence', category: 'seizure' },
    ]
  };

  const Icon = theme.icon;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative overflow-y-auto hide-scrollbar">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[50%] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-5 pb-4 flex items-center justify-between shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900">{theme.title}</h1>
        <button 
          onClick={() => setIsSummaryVisible(true)}
          className="px-3 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-transform"
        >
          复诊报告
        </button>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 px-4 space-y-5 hide-scrollbar">
        {/* 核心状态舱 */}
        <motion.div 
          key={activeTab} // 切换 tab 时重新触发动画
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${theme.color}-50 to-white rounded-bl-full opacity-50`} />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-bold text-slate-900">本月发作统计</h2>
              <p className="text-[12px] text-slate-500 mt-1">较上月 <span className="text-emerald-500 font-bold">减少 2 次</span></p>
            </div>
            <div className={`w-12 h-12 rounded-full ${theme.bg} flex items-center justify-center border-4 border-white shadow-sm`}>
              <Icon className={`w-6 h-6 ${theme.text}`} />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-50 rounded-[16px] p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium mb-1">总次数</div>
              <div className="text-[24px] font-black text-slate-900 leading-none">
                {isMigraine ? migraineRecords.length : seizureRecords.length} <span className="text-[12px] font-medium text-slate-400">次</span>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-[16px] p-3 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium mb-1">平均间隔</div>
              <div className="text-[24px] font-black text-slate-900 leading-none">12 <span className="text-[12px] font-medium text-slate-400">天</span></div>
            </div>
          </div>
        </motion.div>

        {/* AI 洞察提示 */}
        {currentInsight && (
          <motion.div 
            key={`insight-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.alertBg} rounded-[20px] p-4 border ${theme.alertBorder} flex items-start gap-3 shadow-sm`}
          >
            <AlertCircle className={`w-5 h-5 ${theme.text} shrink-0 mt-0.5`} />
            <div>
              <h4 className={`text-[13px] font-bold text-slate-900 mb-1`}>AI 洞察分析</h4>
              <p className="text-[12px] text-slate-700 leading-relaxed font-medium">
                {currentInsight}
              </p>
            </div>
          </motion.div>
        )}

        {/* 历史记录列表 (Causal Stream Timeline) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[15px] font-bold text-slate-900">近期记录</h3>
            <span className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              全部
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {theme.mockData.map((record, index) => {
              const isMissedMed = record.category === 'medication';
              const ItemIcon = isMissedMed ? Pill : Icon;
              const itemBg = isMissedMed ? 'bg-amber-50' : theme.bg;
              const itemText = isMissedMed ? 'text-amber-500' : theme.text;
              const itemBorder = isMissedMed ? 'border-amber-100' : 'border-slate-100';

              return (
                <div key={index} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${itemBg} text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                    <ItemIcon className={`w-5 h-5 ${itemText}`} />
                  </div>
                  {/* Card */}
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border ${itemBorder}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-slate-900">{record.date}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        record.type === 'acute' || record.type === 'generalized' 
                          ? 'bg-rose-50 text-rose-600' 
                          : isMissedMed ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {record.type === 'acute' ? '急性发作' : record.type === 'generalized' ? '全面性' : isMissedMed ? '漏服' : '常规'}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{record.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 底部悬浮按钮占位 */}
        <div className="h-[calc(env(safe-area-inset-bottom)+120px)] shrink-0 pointer-events-none" />
      </div>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pt-12 pb-[calc(env(safe-area-inset-bottom)+24px)] px-6 z-50 pointer-events-none">
        <button 
          onClick={() => isMigraine ? setIsMigraineVisible(true) : setIsSeizureVisible(true)}
          className={`w-full text-white rounded-[20px] h-14 flex items-center justify-center gap-2 text-[15px] font-bold shadow-[0_8px_24px_rgba(59,130,246,0.25)] active:scale-95 transition-all duration-300 pointer-events-auto ${theme.btnBg}`}
        >
          <Plus className="w-5 h-5" />
          {theme.btnText}
        </button>
      </div>

      {/* 弹窗组件 */}
      <MigraineDiarySheet visible={isMigraineVisible} onClose={() => setIsMigraineVisible(false)} />
      <SeizureDiarySheet visible={isSeizureVisible} onClose={() => setIsSeizureVisible(false)} />
      <ClinicSummaryCard visible={isSummaryVisible} onClose={() => setIsSummaryVisible(false)} diseaseTag={activeTab} />
    </div>
  );
}
