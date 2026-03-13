import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, HeartHandshake, Moon, Pill, FileText, ChevronRight } from 'lucide-react';
import { SeizureDiarySheet } from '../SeizureDiarySheet';
import { MigraineDiarySheet } from '../MigraineDiarySheet';
import { CDRDiarySheet } from '../CDRDiarySheet';
import { showComingSoon } from '../../utils/ui';
import { useAppStore } from '../../store';

export function MedicalToolbox() {
  const [showSeizure, setShowSeizure] = useState(false);
  const [showMigraine, setShowMigraine] = useState(false);
  const [showCDR, setShowCDR] = useState(false);

  // 引入全局状态，让工具箱具备动态数据感知能力
  const { migraineFrequencyData, todayTakenIds, sleepRating, seizureFrequencyData, todayCdrRecorded } = useAppStore();

  const todayMigraine = migraineFrequencyData.find(d => d.date === '今日')?.value || 0;
  const todaySeizure = seizureFrequencyData.find(d => d.date === '今日')?.value || 0;
  const medsTaken = todayTakenIds.length > 0;

  const tools = [
    { 
      id: 'seizure', title: '发作日记', desc: '癫痫发作记录', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', 
      onClick: () => setShowSeizure(true),
      status: todaySeizure > 0 ? `今日 ${todaySeizure} 次` : '开启记录', 
      statusType: todaySeizure > 0 ? 'danger' : 'default'
    },
    { 
      id: 'migraine', title: '头痛日记', desc: '偏头痛发作记录', icon: Zap, color: 'text-violet-500', bg: 'bg-violet-50', 
      onClick: () => setShowMigraine(true),
      status: todayMigraine > 0 ? `今日 ${todayMigraine} 次` : '开启记录', 
      statusType: todayMigraine > 0 ? 'danger' : 'default'
    },
    { 
      id: 'bpsd', title: '照护日记', desc: 'BPSD 行为追踪', icon: HeartHandshake, color: 'text-blue-500', bg: 'bg-blue-50', 
      onClick: () => setShowCDR(true),
      status: todayCdrRecorded ? '今日已记' : '今日待记', 
      statusType: todayCdrRecorded ? 'success' : 'warning'
    },
    { 
      id: 'sleep', title: '睡眠日志', desc: '睡眠质量与周期', icon: Moon, color: 'text-amber-500', bg: 'bg-amber-50', 
      onClick: () => showComingSoon('睡眠日志', '更详细的睡眠日志功能即将上线。'),
      status: sleepRating ? '昨晚已评' : '暂无数据', statusType: sleepRating ? 'success' : 'default'
    },
    { 
      id: 'meds', title: '用药记录', desc: '长期用药与调整', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-50', 
      onClick: () => showComingSoon('用药记录', '完整的用药记录与调整历史即将上线。'),
      status: medsTaken ? '今日已服' : '设置方案', statusType: medsTaken ? 'success' : 'default'
    },
    { 
      id: 'report', title: '体检报告', desc: '历史报告与解读', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50', 
      onClick: () => showComingSoon('体检报告', '历史体检报告与 AI 深度解读即将上线。'),
      status: '暂无报告', statusType: 'default'
    },
  ];

  const getStatusStyles = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'danger': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'primary': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200'; // 默认置灰状态（无数据）
    }
  };

  return (
    <div className="space-y-3 mt-8">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">全量工具箱</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2.5">
        {tools.map((tool, index) => (
          <motion.button
            key={tool.id}
            whileTap={{ scale: 0.96 }}
            onClick={tool.onClick}
            className="bg-white rounded-[16px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start text-left group hover:border-blue-200 transition-colors relative overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className={`w-7 h-7 rounded-[10px] ${tool.bg} flex items-center justify-center ${tool.color} shrink-0 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-3.5 h-3.5" />
              </div>
              {tool.status && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusStyles(tool.statusType)}`}>
                  {tool.status}
                </span>
              )}
            </div>
            
            <div className="w-full">
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">{tool.title}</h4>
              <p className="text-[9px] text-slate-500 mt-0.5 font-medium truncate">{tool.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <SeizureDiarySheet visible={showSeizure} onClose={() => setShowSeizure(false)} />
      <MigraineDiarySheet visible={showMigraine} onClose={() => setShowMigraine(false)} />
      <CDRDiarySheet visible={showCDR} onClose={() => setShowCDR(false)} />
    </div>
  );
}
