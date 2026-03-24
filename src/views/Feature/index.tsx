import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { NavBar, SafeArea, Button, Toast } from 'antd-mobile';
import { ChevronLeft, Moon, FileText, ShieldAlert, Brain, PhoneCall, CalendarCheck, Users, MapPin, Activity, Sparkles, Lock, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';
import { TrendBarChart } from '../../components/Charts/TrendBarChart';
import { WaveChart } from '../../components/common/charts/WaveChart';
import { useAppStore } from '../../store';

const featureConfig: Record<string, any> = {
  'brain-training': {
    title: '每日脑力唤醒',
    icon: Brain,
    theme: 'blue',
    desc: '15分钟画钟与词汇回忆训练',
    content: 'chart',
    chartType: 'wave',
    actionText: '开始训练',
    mockData: Array.from({ length: 7 }, () => ({ value: 40 + Math.random() * 40 }))
  },
  'audio-therapy': {
    title: '暗室舒缓音频',
    icon: Moon,
    theme: 'blue',
    desc: '发作期白噪音与呼吸节律引导',
    content: 'list',
    actionText: '开始播放',
    items: [
      { label: '深海白噪音', status: '15分钟', color: 'text-blue-500' },
      { label: '4-7-8 呼吸法', status: '10分钟', color: 'text-emerald-500' },
      { label: '渐进式肌肉放松', status: '20分钟', color: 'text-rose-500' }
    ]
  },
  'sleep-log': {
    title: '睡眠日志',
    icon: Moon,
    theme: 'blue',
    desc: '基于多维度体征数据的深度睡眠分析',
    content: 'chart',
    chartType: 'wave',
    actionText: '同步昨夜睡眠数据',
    mockData: Array.from({ length: 7 }, () => ({ value: 60 + Math.random() * 30 }))
  },
  'targeted-drug': {
    title: '靶向药评估',
    icon: ShieldAlert,
    theme: 'rose',
    desc: '曲普坦类药物效能与耐受性综合评估',
    content: 'chart',
    chartType: 'bar',
    actionText: '记录今日用药',
    mockData: [
      { date: '周一', value: 80 }, { date: '周二', value: 85 }, { date: '周三', value: 90 },
      { date: '周四', value: 75 }, { date: '周五', value: 88 }, { date: '周六', value: 92 }, { date: '周日', value: 95 }
    ]
  },
  'trigger-analysis': {
    title: '诱因图谱分析',
    icon: Brain,
    theme: 'blue',
    desc: 'AI 结合 IoT 睡眠数据与日记，深度分析发作诱因',
    content: 'tags',
    actionText: '导出详细图谱报告',
    tags: ['深度睡眠不足 (85%)', '气压突变 (62%)', '咖啡因戒断 (45%)', '强光刺激 (30%)']
  },
  'visit-summary': {
    title: '就诊一页纸报表',
    icon: FileText,
    theme: 'blue',
    desc: '汇总发作录像与漏服次数，复诊直接给医生看',
    content: 'list',
    actionText: '生成 PDF 报表',
    items: [
      { label: '近 30 天发作次数', status: '2 次', color: 'text-rose-500' },
      { label: '最长持续时间', status: '3 分钟', color: 'text-amber-500' },
      { label: '用药依从率', status: '95%', color: 'text-emerald-500' },
      { label: '发作录像归档', status: '已整理 2 份', color: 'text-blue-500' }
    ]
  },
  'progression-analysis': {
    title: '衰退延缓评估报告',
    icon: BrainCircuit,
    theme: 'blue',
    desc: '综合脑力游戏通关率与睡眠质量，评估干预效果',
    content: 'chart',
    chartType: 'wave',
    actionText: '获取最新评估结果',
    mockData: Array.from({ length: 7 }, () => ({ value: 70 + Math.random() * 20 }))
  },
  'sos': {
    title: 'SOS 紧急呼救',
    icon: PhoneCall,
    theme: 'red',
    desc: '一键触发多端联动报警，守护生命安全',
    content: 'sos',
    actionText: '添加紧急联系人'
  },
  'seizure-calendar': {
    title: '无发作日历',
    icon: CalendarCheck,
    theme: 'blue',
    desc: 'Seizure-free 连续打卡，见证每一步好转',
    content: 'calendar',
    actionText: '今日打卡'
  },
  'caregiver-support': {
    title: '照护者心理支持',
    icon: Users,
    theme: 'amber',
    desc: '专业的心理疏导与照护技能培训',
    content: 'list',
    actionText: '预约心理咨询',
    items: [
      { label: '照护压力评估', status: '已完成', color: 'text-emerald-500' },
      { label: '情绪调节课程', status: '学习中', color: 'text-blue-500' },
      { label: '互助交流群', status: '去加入', color: 'text-blue-500' }
    ]
  },
  'attack-frequency': {
    title: '发作频次分析',
    icon: Activity,
    theme: 'blue',
    desc: '多维度发作频次与趋势深度洞察',
    content: 'chart',
    chartType: 'bar',
    actionText: '导出分析报告',
    mockData: [
      { date: '1月', value: 5 }, { date: '2月', value: 3 }, { date: '3月', value: 4 },
      { date: '4月', value: 2 }, { date: '5月', value: 1 }, { date: '6月', value: 2 }
    ]
  },
  'adherence-report': {
    title: '用药依从率分析',
    icon: Activity,
    theme: 'blue',
    desc: '多维度用药依从性与趋势深度洞察',
    content: 'chart',
    chartType: 'bar',
    actionText: '导出分析报告',
    mockData: [
      { date: '周一', value: 100 }, { date: '周二', value: 100 }, { date: '周三', value: 50 },
      { date: '周四', value: 100 }, { date: '周五', value: 100 }, { date: '周六', value: 100 }, { date: '周日', value: 100 }
    ]
  }
};

const themeColors = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', gradient: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-200' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', gradient: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', gradient: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-200' }
};

export default function FeatureView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSimulating, setIsSimulating] = useState(false);
  const { completeTask } = useAppStore();

  const config = featureConfig[id || ''] || featureConfig['sleep-log'];
  const Icon = config.icon;
  const colors = themeColors[config.theme as keyof typeof themeColors];

  const handleAction = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const taskId = location.state?.taskId;
      if (taskId) {
        completeTask(taskId);
        Toast.show({ content: '任务已完成', icon: 'success' });
        setTimeout(() => navigate(-1), 1000);
      } else {
        Toast.show({ content: '操作成功', icon: 'success' });
      }
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto h-screen overflow-y-auto bg-[#FAFAFA] flex flex-col relative">
      <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b ${colors.bg} to-transparent opacity-50 pointer-events-none`} />
      
      <NavBar 
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        className="bg-transparent relative z-10"
      >
        <span className="font-medium text-slate-900">{config.title}</span>
      </NavBar>

      <div className="flex-1 p-5 flex flex-col relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 mb-6 relative overflow-hidden"
        >
          <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${colors.bg}`} />
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className={`w-14 h-14 rounded-[20px] ${colors.bg} flex items-center justify-center shadow-inner`}>
              <Icon className={`w-7 h-7 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">{config.title}</h1>
              <p className="text-[12px] text-slate-500 mt-1 font-medium">{config.desc}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100/80">
            {config.content === 'chart' && (
              <div className="h-48 w-full flex items-center justify-center bg-slate-50/50 rounded-[16px] border border-slate-100/50 p-4">
                {config.chartType === 'wave' ? (
                  <WaveChart data={config.mockData} dataKey="value" color={colors.text.replace('text-', 'bg-').replace('-600', '-500')} />
                ) : (
                  <TrendBarChart 
                    data={config.mockData} 
                    title="" 
                    subtitle="" 
                    color={colors.text.replace('text-', 'bg-').replace('-600', '-500')}
                    hideHeader
                  />
                )}
              </div>
            )}

            {config.content === 'list' && (
              <div className="space-y-3">
                {config.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-[16px] border border-slate-100/50">
                    <span className="text-[14px] font-bold text-slate-700">{item.label}</span>
                    <span className={`text-[13px] font-bold ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            )}

            {config.content === 'tags' && (
              <div className="flex flex-wrap gap-2">
                {config.tags.map((tag: string, idx: number) => (
                  <div key={idx} className={`px-4 py-2 rounded-full text-[13px] font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {config.content === 'sos' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-50" />
                  <PhoneCall className="w-10 h-10 text-red-500 relative z-10" />
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-2">长按 3 秒触发警报</h3>
                <p className="text-[13px] text-slate-500 text-center px-4">将自动发送定位并拨打紧急联系人电话</p>
              </div>
            )}

            {config.content === 'calendar' && (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const isChecked = Math.random() > 0.3;
                  return (
                    <div key={i} className={`aspect-square rounded-[10px] flex items-center justify-center text-[12px] font-bold ${isChecked ? `${colors.bg} ${colors.text}` : 'bg-slate-50 text-slate-300'}`}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            )}

            {config.content === 'map' && (
              <div className="w-full h-48 bg-slate-100 rounded-[16px] overflow-hidden relative flex items-center justify-center border border-slate-200">
                <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/basic-v2/256/0/0/0.png')] bg-cover bg-center opacity-50" />
                <div className="w-32 h-32 rounded-full border-2 border-blue-400 bg-blue-400/20 relative z-10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Data Privacy Notice */}
        <div className="flex items-start gap-2 px-2 mb-8">
          <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            该功能产生的数据将经过金融级加密，仅用于您的个人健康分析与华西专病团队的医疗参考。
          </p>
        </div>

        <div className="mt-auto pb-8">
          <Button
            block
            loading={isSimulating}
            onClick={handleAction}
            className={`h-14 rounded-full text-[16px] font-bold text-white border-none shadow-lg ${colors.shadow} bg-gradient-to-r ${colors.gradient}`}
          >
            {isSimulating ? '处理中...' : config.actionText}
          </Button>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
