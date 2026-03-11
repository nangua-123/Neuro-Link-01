import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, HeartHandshake, Moon, Pill, FileText, ChevronRight } from 'lucide-react';
import { SeizureDiarySheet } from '../SeizureDiarySheet';
import { MigraineDiarySheet } from '../MigraineDiarySheet';
import { CDRDiarySheet } from '../CDRDiarySheet';
import { showComingSoon } from '../../utils/ui';

export function MedicalToolbox() {
  const [showSeizure, setShowSeizure] = useState(false);
  const [showMigraine, setShowMigraine] = useState(false);
  const [showCDR, setShowCDR] = useState(false);

  const tools = [
    { id: 'seizure', title: '发作日记', desc: '癫痫发作记录', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', onClick: () => setShowSeizure(true) },
    { id: 'migraine', title: '头痛日记', desc: '偏头痛发作记录', icon: Zap, color: 'text-violet-500', bg: 'bg-violet-50', onClick: () => setShowMigraine(true) },
    { id: 'bpsd', title: '照护日记', desc: 'BPSD 行为追踪', icon: HeartHandshake, color: 'text-blue-500', bg: 'bg-blue-50', onClick: () => setShowCDR(true) },
    { id: 'sleep', title: '睡眠日志', desc: '睡眠质量与周期', icon: Moon, color: 'text-amber-500', bg: 'bg-amber-50', onClick: () => showComingSoon('睡眠日志', '更详细的睡眠日志功能即将上线。') },
    { id: 'meds', title: '用药记录', desc: '长期用药与调整', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-50', onClick: () => showComingSoon('用药记录', '完整的用药记录与调整历史即将上线。') },
    { id: 'report', title: '体检报告', desc: '历史报告与解读', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50', onClick: () => showComingSoon('体检报告', '历史体检报告与 AI 深度解读即将上线。') },
  ];

  return (
    <div className="space-y-3 mt-8">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">全量工具箱</h3>
        <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">Zone C</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileTap={{ scale: 0.96 }}
            onClick={tool.onClick}
            className="bg-white p-3.5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-start space-y-2 text-left group hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center justify-between w-full">
              <div className={`w-8 h-8 rounded-xl ${tool.bg} flex items-center justify-center ${tool.color}`}>
                <tool.icon className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-900 leading-tight">{tool.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{tool.desc}</p>
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
