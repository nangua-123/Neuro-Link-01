import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, SafeArea } from 'antd-mobile';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, X, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { dtxZones, DTxTask } from '../BrainTraining';
import BreathingTask from './BreathingTask';
import AudioTherapyTask from './AudioTherapyTask';
import SchulteGridTask from './SchulteGridTask';
import StroopTask from './StroopTask';
import NBackTask from './NBackTask';
import OrientationTask from './OrientationTask';
import FaceMatchTask from './FaceMatchTask';
import DailyExecTask from './DailyExecTask';

export default function DTxRunnerView() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const completeDTxTask = useAppStore(state => state.completeDTxTask);
  
  const [task, setTask] = useState<DTxTask | null>(null);
  const [stage, setStage] = useState<'intro' | 'running' | 'outro'>('intro');

  useEffect(() => {
    if (taskId) {
      // Find task in zones
      for (const zone of dtxZones) {
        const found = zone.tasks.find(t => t.id === taskId);
        if (found) {
          setTask(found);
          break;
        }
      }
    }
  }, [taskId]);

  if (!task) return null;

  const handleStart = () => setStage('running');
  const handleComplete = () => {
    completeDTxTask(task.id);
    setStage('outro');
  };
  const handleExit = () => navigate(-1);

  return (
    <div className="bg-slate-900 flex flex-col h-[100dvh] overflow-hidden relative text-white">
      <SafeArea position="top" />
      
      {/* Top Bar - Only show in intro/outro or when paused (simplified here) */}
      <AnimatePresence>
        {stage !== 'running' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="shrink-0 relative z-50"
          >
            <NavBar 
              backArrow={<X className="w-6 h-6 text-white/70" />}
              onBack={handleExit}
              className="bg-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <div className={`w-24 h-24 rounded-full ${task.bg} ${task.color} flex items-center justify-center mb-8 shadow-lg border border-white/10`}>
                <task.icon className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
              <p className="text-slate-300 text-lg mb-12 max-w-[280px] leading-relaxed">
                {task.desc}
              </p>
              
              <div className="flex items-center gap-2 text-slate-400 mb-12">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>预计耗时 {task.duration}</span>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              </div>

              <button 
                onClick={handleStart}
                className="w-full max-w-[280px] h-14 rounded-full bg-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-transform"
              >
                开始训练
              </button>
            </motion.div>
          )}

          {stage === 'running' && (
            <motion.div 
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {task.id === 'breathing' && <BreathingTask onComplete={handleComplete} onExit={handleExit} />}
              {(task.id === 'white-noise' || task.id === 'body-scan') && <AudioTherapyTask task={task} onComplete={handleComplete} onExit={handleExit} />}
              {task.id === 'schulte' && <SchulteGridTask onComplete={handleComplete} onExit={handleExit} />}
              {task.id === 'stroop' && <StroopTask onComplete={handleComplete} onExit={handleExit} />}
              {task.id === 'n-back' && <NBackTask onComplete={handleComplete} onExit={handleExit} />}
              {task.id === 'orientation' && <OrientationTask onComplete={handleComplete} onExit={handleExit} />}
              {task.id === 'face-match' && <FaceMatchTask onComplete={handleComplete} onExit={handleExit} />}
              {task.id === 'daily-exec' && <DailyExecTask onComplete={handleComplete} onExit={handleExit} />}
              {/* Fallback for unimplemented tasks */}
              {task.id !== 'breathing' && task.id !== 'white-noise' && task.id !== 'body-scan' && task.id !== 'schulte' && task.id !== 'stroop' && task.id !== 'n-back' && task.id !== 'orientation' && task.id !== 'face-match' && task.id !== 'daily-exec' && (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-slate-400 mb-8">此训练模块正在开发中...</p>
                  <button onClick={handleComplete} className="px-6 py-3 bg-white/10 rounded-full">模拟完成</button>
                </div>
              )}
            </motion.div>
          )}

          {stage === 'outro' && (
            <motion.div 
              key="outro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">训练完成</h1>
              <p className="text-slate-300 text-lg mb-12">
                太棒了！您已完成 {task.title}，今日进度 +5 分钟。
              </p>
              
              <button 
                onClick={handleExit}
                className="w-full max-w-[280px] h-14 rounded-full bg-white text-slate-900 font-bold text-lg active:scale-95 transition-transform"
              >
                返回大厅
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
