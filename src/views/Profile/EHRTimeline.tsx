import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SafeArea } from 'antd-mobile';
import { motion } from 'motion/react';
import { ChevronLeft, Brain, Activity, FileCheck, ShieldCheck, Clock, Fingerprint, Sparkles, Lock } from 'lucide-react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';

export default function EHRTimelineView() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();

  const getDiseaseName = (tag: DiseaseTag) => {
    switch (tag) {
      case DiseaseTag.AD: return '认知障碍';
      case DiseaseTag.EPILEPSY: return '癫痫';
      case DiseaseTag.MIGRAINE: return '偏头痛';
      default: return '脑健康';
    }
  };

  const timelineData = [
    {
      id: 1,
      date: '今天 10:30',
      type: 'assessment',
      tag: 'AI 智能评估',
      title: `华西 AI ${getDiseaseName(selectedDiseaseTag)}风险评估`,
      desc: '检出中高风险，建议开启居家干预管家并预约线下复诊。系统已自动生成结构化报告。',
      icon: Brain,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      id: 2,
      date: '3天前 20:15',
      type: 'intervention',
      tag: '居家干预',
      title: '居家管家日常干预打卡',
      desc: selectedDiseaseTag === DiseaseTag.EPILEPSY 
        ? '记录了一次疑似小发作（失神），持续约 10 秒。已同步至主治医师看板。'
        : selectedDiseaseTag === DiseaseTag.MIGRAINE
        ? '记录了一次偏头痛发作，服用了布洛芬缓释胶囊。疼痛指数 VAS 6。'
        : '完成了一组 15 分钟的认知数字疗法训练。综合脑力评分提升 2 分。',
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      id: 3,
      date: '1个月前 09:00',
      type: 'agreement',
      tag: '隐私与合规',
      title: '签署《三方电子联合数据授权协议》',
      desc: '授权脱敏数据用于医疗科研与新药研发，获得 VIP 专属护航权益及华西绿色通道资格。',
      icon: ShieldCheck,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      id: 4,
      date: '2023-10-01',
      type: 'creation',
      tag: '系统建档',
      title: 'Neuro-Link 专属健康档案建立',
      desc: '正式成为 Neuro-Link 脑健康守护者。您的健康数据已开启金融级加密存储。',
      icon: FileCheck,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      gradient: 'from-slate-400 to-slate-500',
    }
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FAFAFA] relative overflow-hidden">
      {/* 极浅弥散冷暖色渐变背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[70%] h-[40%] bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-[15%] right-[-10%] w-[60%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <SafeArea position="top" />
      <NavBar 
        backArrow={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        onBack={() => navigate(-1)}
        className="bg-transparent relative z-10 shrink-0"
      >
        <span className="font-bold text-slate-800">全景病例</span>
      </NavBar>

      <div className="flex-1 overflow-y-auto relative z-10 px-5 pt-2 pb-12">
        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-[32px] p-6 text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10 mb-6">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span className="text-[12px] font-bold text-blue-100 tracking-wider uppercase">Neuro-Link AI Archive</span>
              </div>
              <h1 className="text-[24px] font-bold tracking-tight leading-tight">全病程健康轨迹</h1>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner shrink-0">
              <Fingerprint className="w-6 h-6 text-blue-100" />
            </div>
          </div>

          <div className="bg-black/10 rounded-[20px] p-4 backdrop-blur-md border border-white/10 relative z-10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-[12px] text-blue-50/90 leading-relaxed font-medium">
              您的所有医疗事件与评估数据均已进行金融级脱敏加密，仅供您与授权的主治医师查阅。
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-8">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-6 bottom-4 w-[2px] bg-gradient-to-b from-blue-200 via-indigo-100 to-transparent rounded-full" />

          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Node */}
                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center z-10">
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${item.gradient} shadow-sm`} />
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white to-transparent opacity-50 pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">{item.date}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.bg} ${item.color} border border-white shadow-sm`}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 relative z-10">
                    <div className={`w-10 h-10 rounded-[14px] ${item.bg} flex items-center justify-center shrink-0 border border-white shadow-sm`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-1.5 tracking-tight">{item.title}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
