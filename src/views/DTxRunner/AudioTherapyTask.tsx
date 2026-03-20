import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { DTxTask } from '../BrainTraining';

interface AudioTherapyTaskProps {
  task: DTxTask;
  onComplete: () => void;
  onExit: () => void;
}

export default function AudioTherapyTask({ task, onComplete, onExit }: AudioTherapyTaskProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const totalDuration = parseInt(task.duration) * 60; // Convert minutes to seconds

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setProgress(p => {
          if (p >= totalDuration) {
            onComplete();
            return p;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-between py-12 px-6 relative bg-slate-900">
      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-50"
      >
        <X className="w-6 h-6 text-white/70" />
      </button>

      {/* Visualizer Mock */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ 
              scale: isPlaying ? [1, 1.2, 1] : 1,
              opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`w-64 h-64 rounded-full ${task.bg.replace('bg-', 'bg-').replace('50', '500/20')} blur-3xl`}
          />
        </div>
        
        <div className={`w-48 h-48 rounded-full ${task.bg.replace('bg-', 'bg-').replace('50', '900')} border border-white/10 shadow-2xl flex items-center justify-center relative z-10 overflow-hidden`}>
           <task.icon className={`w-16 h-16 ${task.color.replace('text-', 'text-').replace('500', '400')} opacity-50`} />
           
           {/* Mock Waveform */}
           {isPlaying && (
             <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-end justify-center gap-1 px-8 pb-8 opacity-30">
               {[...Array(12)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                   transition={{ duration: Math.random() * 1 + 0.5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-1.5 bg-white rounded-t-full"
                 />
               ))}
             </div>
           )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
          <p className="text-slate-400 text-sm">{task.desc}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(progress / totalDuration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-8">
          <button className="w-12 h-12 flex items-center justify-center text-slate-400 active:text-white transition-colors">
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center text-slate-400 active:text-white transition-colors">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
