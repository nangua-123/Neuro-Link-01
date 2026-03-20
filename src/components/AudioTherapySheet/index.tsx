import React, { useState, useEffect, useRef } from 'react';
import { Popup, Button, Toast } from 'antd-mobile';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, Volume2, Moon } from 'lucide-react';

interface AudioTherapySheetProps {
  visible: boolean;
  onClose: () => void;
  activeTaskId?: string;
  onTaskCompleted: (taskId: string) => void;
}

export const AudioTherapySheet: React.FC<AudioTherapySheetProps> = ({
  visible,
  onClose,
  activeTaskId,
  onTaskCompleted,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes default
  const duration = 15 * 60;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      setIsPlaying(false);
      setProgress(0);
      setTimeLeft(duration);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [visible, duration]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
        setProgress((prev) => {
          const newProgress = prev + (100 / duration);
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    if (activeTaskId) {
      onTaskCompleted(activeTaskId);
      Toast.show({ content: '舒缓完成', icon: 'success' });
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{ height: '90vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', backgroundColor: '#0f172a' }}
    >
      <div className="h-full flex flex-col items-center justify-between py-10 px-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="w-full flex justify-between items-center z-10">
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 text-blue-200">
            <Moon className="w-5 h-5" />
            <span className="font-medium text-[15px] tracking-wide">暗室舒缓模式</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Visual */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
          <div className="relative w-64 h-64 flex items-center justify-center mb-12">
            <AnimatePresence>
              {isPlaying && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-blue-400/30"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
                    className="absolute inset-0 rounded-full border border-blue-400/20"
                  />
                </>
              )}
            </AnimatePresence>
            
            <motion.div 
              animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)]"
            >
              <Volume2 className={`w-16 h-16 ${isPlaying ? 'text-blue-300' : 'text-slate-500'} transition-colors duration-500`} />
            </motion.div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">深海白噪音</h2>
            <p className="text-blue-200/70 text-[15px]">跟随呼吸节律，放松神经</p>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full z-10 space-y-10">
          {/* Progress */}
          <div className="space-y-3">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-400 rounded-full"
                style={{ width: `${progress}%` }}
                layout
              />
            </div>
            <div className="flex justify-between text-[13px] text-white/50 font-mono">
              <span>{formatTime(duration - timeLeft)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-8">
            <button 
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white text-blue-900 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>
          </div>

          <Button 
            block 
            shape="rounded" 
            className="bg-white/10 border-none text-white/80 h-12 text-[16px] font-medium hover:bg-white/20"
            onClick={handleComplete}
          >
            提前结束并打卡
          </Button>
        </div>
      </div>
    </Popup>
  );
};
