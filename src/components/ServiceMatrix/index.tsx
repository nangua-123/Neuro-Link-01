import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Brain, Activity, Pill, HeartHandshake, MapPin, Sparkles, Lock, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store';
import { DiseaseTag } from '../../configs/constants';
import { Modal } from 'antd-mobile';

const services = [
  {
    id: 'seizure-diary',
    title: '发作日记',
    desc: '记录癫痫发作',
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    tags: [DiseaseTag.EPILEPSY],
    route: '/diary',
    state: { defaultTab: 'EPILEPSY' }
  },
  {
    id: 'migraine-diary',
    title: '头痛闪记',
    desc: '记录偏头痛发作',
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    tags: [DiseaseTag.MIGRAINE],
    route: '/diary',
    state: { defaultTab: 'MIGRAINE' }
  },
  {
    id: 'medications',
    title: '智能用药',
    desc: '服药提醒与依从性',
    icon: Pill,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    tags: [DiseaseTag.EPILEPSY, DiseaseTag.MIGRAINE, DiseaseTag.AD],
    route: '/medications'
  },
  {
    id: 'brain-training',
    title: '脑力训练',
    desc: '延缓认知衰退',
    icon: Sparkles,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    tags: [DiseaseTag.AD],
    route: '/feature/brain-training'
  },
  {
    id: 'lbs-fence',
    title: '安全围栏',
    desc: '防走失高精度定位',
    icon: MapPin,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    tags: [DiseaseTag.AD],
    route: '/feature/lbs-fence'
  },
  {
    id: 'caregiver',
    title: '照护专区',
    desc: '家属压力评估与支持',
    icon: HeartHandshake,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    tags: [DiseaseTag.AD],
    route: '/cdr'
  }
];

export default function ServiceMatrix() {
  const navigate = useNavigate();
  const { selectedDiseaseTag } = useAppStore();

  const handleServiceClick = (service: any) => {
    // 允许用户在未激活状态下点击，以体验功能
    navigate(service.route, { state: service.state });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[16px] font-bold text-slate-800">全量脑健康服务</h3>
        <span className="text-[12px] text-slate-400">探索更多可能</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => {
          // 移除置灰逻辑，始终保持激活态的 UI
          const isActive = true; 
          const isLarge = index === 0;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleServiceClick(service)}
              className={`relative overflow-hidden rounded-[20px] p-4 border transition-all active:scale-95 bg-white border-slate-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] ${isLarge ? 'col-span-2 flex items-center gap-4' : ''}`}
            >
              <div className={`flex items-start justify-between ${isLarge ? 'mb-0 shrink-0' : 'mb-3'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${service.bg}`}>
                  <service.icon className={`w-5 h-5 ${service.color}`} />
                </div>
              </div>
              
              <div className={isLarge ? 'flex-1 flex items-center justify-between' : ''}>
                <div>
                  <h4 className="text-[14px] font-bold mb-0.5 text-slate-800">
                    {service.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {service.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
