import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import { motion } from 'motion/react';
import { ChevronRight, Brain, Activity, FileCheck, ShieldCheck, Clock } from 'lucide-react';
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
      title: `华西 AI ${getDiseaseName(selectedDiseaseTag)}风险评估`,
      desc: '检出中高风险，建议开启居家干预管家并预约线下复诊。',
      icon: Brain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      id: 2,
      date: '3天前 20:15',
      type: 'intervention',
      title: '居家管家日常干预打卡',
      desc: selectedDiseaseTag === DiseaseTag.EPILEPSY 
        ? '记录了一次疑似小发作（失神），持续约 10 秒。'
        : selectedDiseaseTag === DiseaseTag.MIGRAINE
        ? '记录了一次偏头痛发作，服用了布洛芬缓释胶囊。'
        : '完成了一组 15 分钟的认知数字疗法训练。',
      icon: Activity,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      id: 3,
      date: '1个月前 09:00',
      type: 'agreement',
      title: '签署《三方电子联合数据授权协议》',
      desc: '授权脱敏数据用于医疗科研与新药研发，获得 VIP 专属护航权益。',
      icon: ShieldCheck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      id: 4,
      date: '建档日',
      type: 'creation',
      title: 'Neuro-Link 专属健康档案建立',
      desc: '正式成为 Neuro-Link 脑健康守护者。',
      icon: FileCheck,
      color: 'text-slate-500',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100/50">
        <NavBar 
          onBack={() => navigate(-1)}
          backArrow={<ChevronRight className="rotate-180 w-6 h-6 text-slate-600" />}
        >
          <span className="font-medium text-slate-800">健康轨迹</span>
        </NavBar>
      </div>

      <div className="p-6 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">全病程健康轨迹</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            这里记录了您在 Neuro-Link 平台产生的所有高价值医疗事件，为医生的精准诊疗提供可靠依据。
          </p>
        </div>

        <div className="relative pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[23px] top-6 bottom-4 w-[1px] bg-slate-200/80" />

          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Timeline Node */}
                <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center z-10">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">{item.date}</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-[14px] ${item.bgColor} shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1.5">{item.title}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
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
