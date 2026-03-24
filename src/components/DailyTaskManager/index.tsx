import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Brain, Pill, Activity, HeartHandshake, FileText, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store';
import { Task } from '../../interfaces/task';
import { UserIdentity } from '../../interfaces/user';

const iconMap: Record<string, any> = {
  Brain, Pill, Activity, HeartHandshake, FileText
};

export const DailyTaskManager = ({ onTaskAction }: { onTaskAction: (task: Task) => void }) => {
  const { tasks, generateDailyTasks, identity } = useAppStore();
  const isFamily = identity === UserIdentity.FAMILY;

  useEffect(() => {
    generateDailyTasks();
  }, [generateDailyTasks]);

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-slate-300" />
        </div>
        <h4 className="text-[16px] font-bold text-slate-800 mb-1.5">暂无专属任务</h4>
        <p className="text-[13px] text-slate-500 max-w-[220px] leading-relaxed">
          完成专业量表测评后，AI 将为{isFamily ? '长辈' : '您'}生成每日康复与打卡任务。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-bold text-slate-800 tracking-tight px-1">
          {isFamily ? '长辈今日专属任务' : '今日专属任务'}
        </h3>
        <div className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          已完成 {completedTasks.length}/{tasks.length}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {pendingTasks.map(task => {
            const Icon = iconMap[task.iconName] || FileText;
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTaskAction(task)}
                className="bg-white rounded-[20px] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-50/80 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-bold text-slate-800 truncate">{task.title}</h4>
                    <p className="text-[13px] text-slate-500 mt-0.5 truncate">{task.description}</p>
                  </div>
                </div>
                {task.type === 'MEDICATION' ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onTaskAction(task); }}
                    className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[13px] font-bold active:scale-95 transition-transform shrink-0 ml-2"
                  >
                    {task.actionLabel || '打卡'}
                  </button>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0 ml-2">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {completedTasks.length > 0 && (
          <div className="pt-2 space-y-1">
            <h4 className="text-[13px] font-bold text-slate-400 px-1 mb-1">已完成</h4>
            {completedTasks.map(task => {
              const Icon = iconMap[task.iconName] || FileText;
              return (
                <motion.div
                  key={task.id}
                  layout
                  className="bg-slate-50/60 rounded-[10px] py-1.5 px-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-[8px] bg-slate-100/80 text-slate-400 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[12px] font-medium text-slate-400 line-through decoration-slate-300 truncate">{task.title}</h4>
                    </div>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
