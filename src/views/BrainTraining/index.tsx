import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar, SafeArea, Toast } from 'antd-mobile';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Sparkles, Brain, Target, Zap, Play, 
  CheckCircle2, Trophy, Clock, Grid, Image as ImageIcon, 
  ListChecks, Wind, Headphones, HeartPulse, Activity, Calendar,
  Flame, Award, TrendingUp, Star
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { useAppStore } from '../../store';

// --- Types & Data ---

export interface DTxTask {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  tags: string[];
  duration: string;
  color: string;
  bg: string;
}

export interface DTxZone {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  tasks: DTxTask[];
}

export const dtxZones: DTxZone[] = [
  {
    id: 'zone-a',
    title: '脑力极客',
    subtitle: '认知强化区',
    theme: 'blue',
    tasks: [
      {
        id: 'schulte',
        title: '舒尔特方格',
        desc: '动态追踪，提升视觉与空间注意力',
        icon: Grid,
        tags: ['高阶', '专注力'],
        duration: '3 分钟',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
      },
      {
        id: 'n-back',
        title: 'N-Back 工作记忆',
        desc: '高难度记忆挑战，锻炼短时记忆容量',
        icon: Brain,
        tags: ['高阶', '记忆力'],
        duration: '5 分钟',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
      },
      {
        id: 'stroop',
        title: '斯特鲁普挑战',
        desc: '颜色与词汇冲突判断，锻炼抗干扰能力',
        icon: Zap,
        tags: ['高阶', '反应力'],
        duration: '4 分钟',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
      }
    ]
  },
  {
    id: 'zone-b',
    title: '生活康复',
    subtitle: '适老与认知干预区',
    theme: 'emerald',
    tasks: [
      {
        id: 'orientation',
        title: '时空定向训练',
        desc: '大字号认表、认日历、认季节交互',
        icon: Clock,
        tags: ['适老', '定向力'],
        duration: '3 分钟',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
      },
      {
        id: 'face-match',
        title: '面孔与称呼连线',
        desc: '家庭成员照片匹配，强化亲属认知',
        icon: ImageIcon,
        tags: ['适老', '防衰退'],
        duration: '5 分钟',
        color: 'text-teal-500',
        bg: 'bg-teal-50',
      },
      {
        id: 'daily-exec',
        title: '日常执行力模拟',
        desc: '模拟超市购物清单分类、吃药分类',
        icon: ListChecks,
        tags: ['适老', '执行力'],
        duration: '4 分钟',
        color: 'text-cyan-500',
        bg: 'bg-cyan-50',
      }
    ]
  },
  {
    id: 'zone-c',
    title: '神经舒缓',
    subtitle: '节律与放松区',
    theme: 'amber',
    tasks: [
      {
        id: 'breathing',
        title: '4-7-8 呼吸节律',
        desc: '极简光晕膨胀收缩，配合震动闭眼可用',
        icon: Wind,
        tags: ['低刺激', '防发作'],
        duration: '5 分钟',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
      },
      {
        id: 'white-noise',
        title: '特定频段白噪音',
        desc: '双耳节拍、粉红噪音，缓解神经疲劳',
        icon: Headphones,
        tags: ['低刺激', '助眠'],
        duration: '10 分钟',
        color: 'text-orange-500',
        bg: 'bg-orange-50',
      },
      {
        id: 'body-scan',
        title: '正念身体扫描',
        desc: '引导式音频，全身肌肉渐进式放松',
        icon: HeartPulse,
        tags: ['低刺激', '助眠'],
        duration: '15 分钟',
        color: 'text-rose-500',
        bg: 'bg-rose-50',
      }
    ]
  }
];

export default function BrainTrainingView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'today' | 'data'>('today');
  const [greeting, setGreeting] = useState('开启今日脑力唤醒');
  
  const dtxProgress = useAppStore(state => state.dtxProgress);
  const radarData = useAppStore(state => state.dtxRadarData);
  const completedDTxTasks = useAppStore(state => state.completedDTxTasks);
  const dtxStreak = useAppStore(state => state.dtxStreak);
  const dtxTotalDuration = useAppStore(state => state.dtxTotalDuration);
  const dtxOverallScore = useAppStore(state => state.dtxOverallScore);
  const dtxWeeklyData = useAppStore(state => state.dtxWeeklyData);
  const userToken = useAppStore(state => state.userToken);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 9) setGreeting('早安，开启今日脑力唤醒');
    else if (hour < 12) setGreeting('上午好，保持专注力');
    else if (hour < 14) setGreeting('午后小憩，来组神经舒缓');
    else if (hour < 18) setGreeting('下午好，继续脑力挑战');
    else setGreeting('晚安，睡前放松训练');
  }, []);

  const handleStart = (taskId: string) => {
    navigate(`/dtx/runner/${taskId}`, { state: { dailyTaskId: location.state?.taskId } });
  };

  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.round((dtxProgress.completed / dtxProgress.total) * 100));

  return (
    <div className="bg-[#FAFAFA] flex flex-col relative overflow-hidden h-full">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[50%] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full">
        <SafeArea position="top" />
        <NavBar 
          backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
          onBack={() => navigate(-1)}
          className="bg-transparent shrink-0"
        >
          <span className="font-bold text-slate-800">数字疗法大厅</span>
        </NavBar>

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-6 hide-scrollbar">
          
          {/* AI Greeting */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center shadow-sm border border-blue-200/50">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">{greeting}</span>
          </motion.div>

          {/* Header Card: Daily Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-[32px] p-6 text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)] relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10 mb-6">
              <div>
                <h1 className="text-[24px] font-bold mb-1.5 tracking-tight flex items-center gap-2">
                  今日专属看板
                  {progressPercent >= 100 && (
                    <span className="bg-emerald-400/20 text-emerald-100 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 已达标
                    </span>
                  )}
                </h1>
                <p className="text-blue-100/80 text-[13px] font-medium">每日 {dtxProgress.total} 分钟，延缓脑衰退</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <Brain className="w-6 h-6 text-blue-100" />
              </div>
            </div>
            
            <div className="flex items-center gap-5 relative z-10">
              {/* Circular Progress */}
              <div className="relative w-[88px] h-[88px] shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="8" 
                  />
                  <motion.circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progressPercent / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[26px] font-bold leading-none tracking-tighter">{progressPercent}</span>
                  <span className="text-[10px] text-blue-100/80 font-medium mt-0.5">%</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 gap-3 bg-black/10 rounded-[24px] p-4 backdrop-blur-md border border-white/10">
                <div className="flex flex-col justify-center pl-1">
                  <div className="text-[11px] text-blue-100/70 mb-1 font-medium flex items-center gap-1">
                    <Activity className="w-3 h-3" /> 今日进度
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[24px] font-bold leading-none tracking-tighter">{dtxProgress.completed}</span>
                    <span className="text-[12px] text-blue-100/80 font-medium">/ {dtxProgress.total} 分钟</span>
                  </div>
                </div>
                <div className="w-[1px] h-12 bg-white/10 absolute left-1/2 top-1/2 -translate-y-1/2" />
                <div className="flex flex-col justify-center pl-3">
                  <div className="text-[11px] text-blue-100/70 mb-1 font-medium flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-300" /> 连续打卡
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[24px] font-bold leading-none tracking-tighter">{dtxStreak}</span>
                    <span className="text-[12px] text-blue-100/80 font-medium">天</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-[20px] backdrop-blur-sm border border-slate-200/50">
            <button 
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-2.5 text-[15px] font-bold rounded-[16px] transition-all relative z-10 ${activeTab === 'today' ? 'text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              疗法矩阵
            </button>
            <button 
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-2.5 text-[15px] font-bold rounded-[16px] transition-all relative z-10 ${activeTab === 'data' ? 'text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              数据洞察
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'today' ? (
              <motion.div 
                key="today"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {dtxZones.map((zone, zIndex) => (
                  <motion.div 
                    key={zone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: zIndex * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-baseline gap-2 px-1">
                      <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">{zone.title}</h2>
                      <span className="text-[12px] font-medium text-slate-500">{zone.subtitle}</span>
                    </div>
                    
                    <div className="space-y-3">
                      {zone.tasks.map((task) => {
                        const isCompleted = completedDTxTasks.includes(task.id);
                        return (
                        <div 
                          key={task.id}
                          className={`bg-white/80 backdrop-blur-md rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border transition-all cursor-pointer flex items-center gap-4 ${
                            isCompleted ? 'border-emerald-100/50 opacity-80' : 'border-slate-100/80 active:scale-[0.98]'
                          }`}
                          onClick={() => !isCompleted && handleStart(task.id)}
                        >
                          <div className={`w-14 h-14 rounded-[18px] ${task.bg} ${task.color} flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                            <task.icon className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`text-[16px] font-bold truncate ${isCompleted ? 'text-slate-500' : 'text-slate-800'}`}>{task.title}</h3>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                <span>{task.duration}</span>
                              </div>
                            </div>
                            <p className="text-[12px] text-slate-500 line-clamp-1 mb-2.5">{task.desc}</p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {task.tags.map(tag => (
                                <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                                  tag === '适老' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                  tag === '高阶' ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                                  tag === '低刺激' ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                                  'bg-slate-50 text-slate-500 border-slate-200/50'
                                }`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 pl-2">
                            {isCompleted ? (
                              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/50 shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </div>
                            ) : (
                              <button 
                                className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center active:scale-95 transition-transform shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                              >
                                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                              </button>
                            )}
                          </div>
                        </div>
                      )})}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="data"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-50 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100/50">
                        <Activity className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-medium">累计训练时长</span>
                    </div>
                    <div className="flex items-end gap-1 relative z-10">
                      <span className="text-[32px] font-bold text-slate-800 leading-none tracking-tighter">{dtxTotalDuration}</span>
                      <span className="text-[13px] text-slate-500 leading-none mb-1.5 font-medium">分钟</span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                        <Target className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-medium">综合认知评分</span>
                    </div>
                    <div className="flex items-end gap-1 relative z-10">
                      <span className="text-[32px] font-bold text-slate-800 leading-none tracking-tighter">{dtxOverallScore}</span>
                      <span className="text-[13px] text-emerald-500 leading-none mb-1.5 font-bold flex items-center"><TrendingUp className="w-3 h-3 mr-0.5"/>+2</span>
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-[24px] p-5 border border-blue-100/50 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-800 mb-1.5 tracking-tight">AI 训练建议</h4>
                      <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                        您近期在<span className="text-amber-600 font-bold mx-1">神经舒缓</span>区停留较长，情绪稳定性显著提升。建议本周可适当增加<span className="text-blue-600 font-bold mx-1">脑力极客</span>区的反应力挑战，以维持神经突触的活跃度。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weekly Bar Chart */}
                <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                        本周训练趋势
                      </h3>
                      <p className="text-[12px] text-slate-500 mt-0.5 font-medium">每日训练时长 (分钟)</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100/50">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="h-[200px] w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dtxWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 11 }} 
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        />
                        <Bar 
                          dataKey="minutes" 
                          fill="url(#colorMinutes)" 
                          radius={[6, 6, 0, 0]} 
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-800">全景脑力雷达</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5 font-medium">基于近 30 天训练数据生成</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100/50">
                      <Trophy className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="h-[260px] w-full -ml-2 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="能力值" dataKey="A" stroke="#4f46e5" strokeWidth={3} fill="#6366f1" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                    {/* Center decorative dot */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/80">
                  <h3 className="text-[16px] font-bold text-slate-800 mb-4">近期成就</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-[16px] bg-amber-50/50 border border-amber-100/50">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-slate-800">专注力达人</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">连续 3 天完成舒尔特方格</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-[16px] bg-emerald-50/50 border border-emerald-100/50">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-slate-800">情绪稳定者</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">完成 5 次正念身体扫描</div>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


