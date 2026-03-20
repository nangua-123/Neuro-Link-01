import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BreathingTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

export default function BreathingTask({ onComplete, onExit }: BreathingTaskProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const totalCycles = 4; // 4 cycles for a short session

  useEffect(() => {
    let timer: number;
    
    const tick = () => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Phase transition
          if (phase === 'inhale') {
            setPhase('hold');
            if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            return 8;
          } else {
            // End of cycle
            if (cycles + 1 >= totalCycles) {
              onComplete();
              return 0;
            }
            setCycles(c => c + 1);
            setPhase('inhale');
            if (navigator.vibrate) navigator.vibrate(100);
            return 4;
          }
        }
        return prev - 1;
      });
    };

    timer = window.setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [phase, cycles, onComplete]);

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return '吸气';
      case 'hold': return '屏息';
      case 'exhale': return '呼气';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  const getDuration = () => {
    switch (phase) {
      case 'inhale': return 4;
      case 'hold': return 7;
      case 'exhale': return 8;
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative bg-black">
      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-50"
      >
        <X className="w-6 h-6 text-white/70" />
      </button>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Breathing Halo */}
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: getDuration(), ease: "easeInOut" }}
          className="absolute w-48 h-48 rounded-full bg-amber-500/20 blur-2xl"
        />
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: getDuration(), ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-amber-400/30 blur-xl"
        />
        
        {/* Center Text */}
        <div className="relative z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-3xl font-light tracking-widest text-amber-50 mb-2"
            >
              {getInstruction()}
            </motion.div>
          </AnimatePresence>
          <div className="text-5xl font-extralight text-amber-100/80 font-mono">
            {timeLeft}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-amber-100/40 text-sm tracking-widest">
        循环 {cycles + 1} / {totalCycles}
      </div>
    </div>
  );
}
