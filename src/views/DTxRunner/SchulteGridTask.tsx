import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, AlertCircle } from 'lucide-react';

interface SchulteGridTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

export default function SchulteGridTask({ onComplete, onExit }: SchulteGridTaskProps) {
  const gridSize = 4;
  const totalNumbers = gridSize * gridSize;
  
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize grid
  useEffect(() => {
    const nums = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setNumbers(nums);
    setStartTime(Date.now());
  }, [totalNumbers]);

  // Timer
  useEffect(() => {
    let timer: number;
    if (startTime && !isFinished) {
      timer = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  const handleNumberClick = useCallback((num: number, index: number) => {
    if (isFinished) return;

    if (num === currentNumber) {
      if (num === totalNumbers) {
        setIsFinished(true);
        setTimeout(onComplete, 1500);
      } else {
        setCurrentNumber(prev => prev + 1);
      }
    } else {
      // Error feedback
      if (navigator.vibrate) navigator.vibrate(50);
      setErrorIndex(index);
      setTimeout(() => setErrorIndex(null), 300);
    }
  }, [currentNumber, totalNumbers, isFinished, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Clock className="w-5 h-5" />
          <span className="text-lg font-mono w-16">{formatTime(elapsedTime)}</span>
        </div>
        <button 
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center active:bg-slate-300 transition-colors"
        >
          <X className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Target Indicator */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-sm text-slate-500 font-medium mb-2">请寻找并点击数字</div>
        <div className="text-5xl font-bold text-blue-600 font-mono">
          {isFinished ? '完成!' : currentNumber}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div 
          className="w-full max-w-sm aspect-square grid gap-2"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {numbers.map((num, index) => {
            const isClicked = num < currentNumber;
            const isError = errorIndex === index;
            
            return (
              <motion.button
                key={num}
                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleNumberClick(num, index)}
                disabled={isClicked || isFinished}
                className={`
                  relative rounded-2xl text-2xl font-bold font-mono flex items-center justify-center shadow-sm transition-all
                  ${isClicked 
                    ? 'bg-slate-100 text-slate-300 shadow-none border border-slate-200/50' 
                    : isError
                      ? 'bg-rose-100 text-rose-600 border-2 border-rose-400'
                      : 'bg-white text-slate-700 border border-slate-200 active:bg-blue-50 active:text-blue-600 active:scale-95'
                  }
                `}
              >
                {num}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
