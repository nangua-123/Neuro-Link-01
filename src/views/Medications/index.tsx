import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pill, Plus, CheckCircle2, Clock, CalendarDays, ShieldCheck, Bell, Trash2, Sunrise, Sun, Sunset, Moon, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store';
import { MedicationSetupModal } from '../../components/MedicationSetupModal';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SwipeAction, Dialog, Toast, Modal } from 'antd-mobile';

export default function MedicationsView() {
  const navigate = useNavigate();
  const { medicationPlans, todayTakenIds, toggleMedication, medicationHistory, removeMedicationPlan } = useAppStore();
  const [isSetupVisible, setIsSetupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const timeMap: Record<string, { label: string, icon: React.ElementType, color: string, bg: string }> = {
    morning: { label: '晨起', icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-50' },
    noon: { label: '中午', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
    evening: { label: '晚间', icon: Sunset, color: 'text-blue-500', bg: 'bg-blue-50' },
    bedtime: { label: '睡前', icon: Moon, color: 'text-blue-500', bg: 'bg-blue-50' },
  };

  const totalCount = medicationPlans.length;
  const takenCount = todayTakenIds.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((takenCount / totalCount) * 100);

  // Group medications by time
  const groupedPlans = useMemo(() => {
    const groups: Record<string, typeof medicationPlans> = {
      morning: [],
      noon: [],
      evening: [],
      bedtime: []
    };
    medicationPlans.forEach(plan => {
      if (groups[plan.time]) {
        groups[plan.time].push(plan);
      }
    });
    // Filter out empty groups
    return Object.entries(groups).filter(([_, plans]) => plans.length > 0);
  }, [medicationPlans]);

  // Calculate streak dynamically
  const streakDays = useMemo(() => {
    let streak = 0;
    const today = new Date();
    if (totalCount > 0 && takenCount === totalCount) {
      streak = 1;
    }
    for (let i = 1; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const taken = medicationHistory[dateStr]?.length || 0;
      if (taken > 0) {
        if (streak === 0 && i === 1) streak = 1;
        else if (streak > 0) streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [medicationHistory, takenCount, totalCount]);

  // Generate last 7 days chart data
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const taken = medicationHistory[dateStr]?.length || 0;
      const total = medicationPlans.length || 1;
      const rate = Math.round((taken / total) * 100);
      data.push({ name: `${d.getMonth() + 1}/${d.getDate()}`, rate: Math.min(rate, 100) });
    }
    return data;
  }, [medicationHistory, medicationPlans.length]);

  const handleDelete = (id: string) => {
    Dialog.confirm({
      content: '确定要删除该用药计划吗？',
      onConfirm: async () => {
        removeMedicationPlan(id);
        Toast.show({ icon: 'success', content: '已删除' });
      },
    });
  };

  const handleConfirmMedication = () => {
    if (selectedPlan) {
      toggleMedication(selectedPlan.id);
      Toast.show({ content: '打卡成功', icon: 'success' });
      setSelectedPlan(null);
    }
  };

  // Dynamic Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 9) return '早上好，记得吃早饭哦';
    if (hour < 14) return '中午好，按时服药更健康';
    if (hour < 19) return '下午好，喝杯水休息一下';
    return '晚上好，准备休息了吗';
  }, []);

  return (
    <div className="min-h-full w-full max-w-md mx-auto bg-[#FAFAFA] relative pb-[calc(env(safe-area-inset-bottom)+100px)] overflow-x-hidden">
      {/* 柔和背景光晕 */}
      <div className="fixed inset-0 w-full max-w-md mx-auto pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent" />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 pt-5 pb-3 flex items-center justify-between bg-[#FAFAFA]/80 backdrop-blur-xl">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-800 tracking-tight">智能用药管家</h1>
        <div className="w-10" />
      </div>

      {/* Tabs */}
      <div className="sticky top-[72px] z-40 px-4 py-2 bg-[#FAFAFA]/80 backdrop-blur-xl">
        <div className="flex bg-slate-200/50 p-1 rounded-[16px]">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2.5 rounded-[12px] text-[14px] font-bold transition-all ${activeTab === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            今日服药
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-[12px] text-[14px] font-bold transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            历史记录
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 pt-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <motion.div 
              key="today"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* AI Greeting & Progress Card */}
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-[32px] blur-xl opacity-60 pointer-events-none" />
                <div className="bg-white/90 backdrop-blur-2xl rounded-[28px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-start justify-between relative z-10 mb-6">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-[13px] font-bold text-blue-600 tracking-tight">AI 管家</span>
                      </div>
                      <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">{greeting}</h2>
                      <p className="text-[13px] text-slate-500 mt-1">
                        已连续按时服药 <span className="text-blue-600 font-bold text-[15px] mx-0.5">{streakDays}</span> 天，继续保持！
                      </p>
                    </div>
                    <div className="relative w-14 h-14 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                        <motion.circle 
                          cx="50" cy="50" r="40" 
                          fill="transparent" 
                          stroke="url(#blueGradient)" 
                          strokeWidth="8" 
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progressPercent / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[14px] font-bold text-slate-800 leading-none">{takenCount}</span>
                        <span className="text-[9px] text-slate-400 font-medium mt-0.5">/{totalCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task List Grouped by Time */}
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-[17px] font-bold text-slate-800 tracking-tight">今日任务</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-400 font-medium">左滑可删除</span>
                    <span className="text-[12px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
                      {new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {medicationPlans.length === 0 ? (
                  <div className="bg-white rounded-[28px] p-10 text-center border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Pill className="w-8 h-8 text-blue-300" />
                    </div>
                    <h4 className="text-[16px] font-bold text-slate-800 mb-2">暂无用药计划</h4>
                    <p className="text-[14px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">添加日常保健或慢病用药，开启智能提醒</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {groupedPlans.map(([timeKey, plans]) => {
                      const timeInfo = timeMap[timeKey] || timeMap['morning'];
                      const TimeIcon = timeInfo.icon;
                      
                      return (
                        <div key={timeKey} className="space-y-3">
                          <div className="flex items-center gap-2 px-1">
                            <div className={`w-6 h-6 rounded-full ${timeInfo.bg} flex items-center justify-center`}>
                              <TimeIcon className={`w-3.5 h-3.5 ${timeInfo.color}`} />
                            </div>
                            <h4 className="text-[14px] font-bold text-slate-700">{timeInfo.label}</h4>
                            <div className="h-[1px] flex-1 bg-slate-100 ml-2" />
                          </div>
                          
                          <div className="space-y-2">
                            <AnimatePresence>
                              {plans.filter(p => !todayTakenIds.includes(p.id)).map((plan) => (
                                <SwipeAction
                                  key={plan.id}
                                  rightActions={[
                                    {
                                      key: 'delete',
                                      text: '删除',
                                      color: 'danger',
                                      onClick: () => handleDelete(plan.id),
                                    },
                                  ]}
                                  className="rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-50/80"
                                >
                                  <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedPlan(plan)}
                                    className="bg-white p-3.5 flex items-center justify-between group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                                        <Pill className="w-6 h-6" />
                                      </div>
                                      <div className="min-w-0">
                                        <h4 className="text-[16px] font-bold text-slate-800 truncate">{plan.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-[13px] font-medium text-slate-500 shrink-0">{plan.dose}</span>
                                          {plan.reminderEnabled && (
                                            <>
                                              <span className="w-1 h-1 rounded-full bg-slate-200" />
                                              <span className="flex items-center gap-1 text-[12px] text-slate-400 font-medium shrink-0">
                                                <Bell className="w-3 h-3" /> {plan.reminderTime}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0 ml-2">
                                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                  </motion.div>
                                </SwipeAction>
                              ))}
                            </AnimatePresence>

                            {plans.filter(p => todayTakenIds.includes(p.id)).length > 0 && (
                              <div className="pt-2 space-y-1.5">
                                <h4 className="text-[13px] font-bold text-slate-400 px-1 mb-1">已完成</h4>
                                {plans.filter(p => todayTakenIds.includes(p.id)).map((plan) => (
                                  <SwipeAction
                                    key={plan.id}
                                    rightActions={[
                                      {
                                        key: 'delete',
                                        text: '删除',
                                        color: 'danger',
                                        onClick: () => handleDelete(plan.id),
                                      },
                                    ]}
                                    className="rounded-[12px] overflow-hidden"
                                  >
                                    <motion.div
                                      layout
                                      onClick={() => toggleMedication(plan.id)}
                                      className="bg-slate-50/60 py-2 px-3 flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-[10px] bg-slate-100/80 text-slate-400 flex items-center justify-center shrink-0">
                                          <Pill className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                          <h4 className="text-[12px] font-medium text-slate-400 line-through decoration-slate-300 truncate">{plan.name}</h4>
                                        </div>
                                      </div>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                    </motion.div>
                                  </SwipeAction>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* 历史统计卡片 */}
              <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100/80">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-[14px] bg-blue-50 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">近 7 天依从性</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5 font-medium">保持良好的服药习惯</p>
                    </div>
                  </div>
                </div>
                <div className="h-48 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '12px 16px' }}
                        itemStyle={{ color: '#6366f1', fontWeight: 'bold', fontSize: '15px' }}
                        formatter={(value: number) => [`${value}%`, '依从率']}
                        labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 历史记录列表 */}
              <div>
                <h3 className="text-[17px] font-bold text-slate-800 tracking-tight px-1 mb-4">服药记录</h3>
                <div className="space-y-4">
                  {Object.keys(medicationHistory).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-[14px] font-medium bg-white rounded-[24px] border border-slate-100/80 shadow-sm">暂无历史记录</div>
                  ) : (
                    Object.entries(medicationHistory).reverse().map(([dateStr, takenIds]) => {
                      const d = new Date(dateStr);
                      const displayDate = `${d.getMonth() + 1}月${d.getDate()}日`;
                      return (
                        <div key={dateStr} className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[16px] font-bold text-slate-800">{displayDate}</span>
                            <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-[8px]">
                              已服 {takenIds.length} 种
                            </span>
                          </div>
                          <div className="space-y-3">
                            {takenIds.map(id => {
                              const plan = medicationPlans.find(p => p.id === id);
                              if (!plan) return null;
                              return (
                                <div key={id} className="flex items-center gap-3 text-[14px] min-w-0 bg-slate-50 p-3 rounded-[16px]">
                                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  </div>
                                  <span className="text-slate-700 truncate font-bold flex-1">{plan.name}</span>
                                  <span className="text-slate-500 shrink-0 font-medium">{plan.dose}</span>
                                </div>
                              );
                            })}
                            {takenIds.length === 0 && (
                              <div className="text-[13px] text-slate-400 flex items-center gap-2 p-3 bg-slate-50 rounded-[16px]">
                                <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                                当日未服药
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pt-12 pb-[calc(env(safe-area-inset-bottom)+24px)] px-6 z-50 pointer-events-none">
        <button 
          onClick={() => setIsSetupVisible(true)}
          className="w-full bg-[#1677FF] text-white rounded-[20px] h-14 flex items-center justify-center gap-2 text-[16px] font-bold shadow-[0_8px_24px_rgba(22,119,255,0.25)] active:scale-95 transition-all duration-300 pointer-events-auto"
        >
          <Plus className="w-5 h-5 text-white" />
          添加用药计划
        </button>
      </div>

      <MedicationSetupModal visible={isSetupVisible} onClose={() => setIsSetupVisible(false)} />

      {/* Medication Confirmation Modal */}
      <Modal
        visible={!!selectedPlan}
        content={
          <div className="flex flex-col items-center pt-2 pb-1 w-full">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-800 mb-1">用药打卡</h3>
            <p className="text-[14px] text-slate-500 text-center mb-6">请确认您已按时服用以下药物</p>
            
            <div className="w-full bg-slate-50 rounded-[16px] p-4 mb-6 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-slate-500">服药时间</span>
                <span className="text-[14px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedPlan ? timeMap[selectedPlan.time]?.label : ''}
                </span>
              </div>
              <div className="h-[1px] w-full bg-slate-200/60 mb-3" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-500">药物名称与剂量</span>
                <span className="text-[15px] font-bold text-slate-800 text-right max-w-[60%]">
                  {selectedPlan?.name} {selectedPlan?.dose}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handleConfirmMedication}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full py-3.5 text-[16px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95 transition-transform"
              >
                确认已服药
              </button>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="w-full bg-slate-100 text-slate-600 rounded-full py-3.5 text-[16px] font-bold active:scale-95 transition-transform"
              >
                稍后提醒
              </button>
            </div>
          </div>
        }
        closeOnAction
        onClose={() => setSelectedPlan(null)}
        bodyStyle={{ borderRadius: '24px', padding: '24px' }}
      />
    </div>
  );
}