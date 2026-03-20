import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StroopTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

const COLORS = [
  { name: '红', value: '#ef4444', id: 'red' },
  { name: '绿', value: '#10b981', id: 'green' },
  { name: '蓝', value: '#3b82f6', id: 'blue' },
  { name: '黄', value: '#eab308', id: 'yellow' },
];

export default function StroopTask({ onComplete, onExit }: StroopTaskProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(COLORS[0]);
  const [currentColor, setCurrentColor] = useState(COLORS[1]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const generateNext = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let colorIdx = Math.floor(Math.random() * COLORS.length);
    
    // 70% chance of conflict (word != color)
    if (Math.random() < 0.7) {
      while (colorIdx === wordIdx) {
        colorIdx = Math.floor(Math.random() * COLORS.length);
      }
    } else {
      colorIdx = wordIdx;
    }

    setCurrentWord(COLORS[wordIdx]);
    setCurrentColor(COLORS[colorIdx]);
  }, []);

  useEffect(() => {
    generateNext();
  }, [generateNext]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      setTimeout(onComplete, 2000);
      return;
    }
    const timer = window.setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const handleColorSelect = (selectedColorId: string) => {
    if (isFinished || feedback) return;

    if (selectedColorId === currentColor.id) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      if (navigator.vibrate) navigator.vibrate(50);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      generateNext();
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-medium bg-white/10 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{timeLeft}s</span>
          </div>
          <div className="text-slate-300 font-medium bg-white/10 px-3 py-1.5 rounded-full">
            得分: <span className="font-mono text-white">{score}</span>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white/70" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 px-6">
        <p className="text-slate-400 text-sm">请选择文字的<span className="text-white font-bold mx-1">颜色</span>，而不是字义</p>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={`${currentWord.id}-${currentColor.id}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[120px] font-bold tracking-widest"
              style={{ color: currentColor.value }}
            >
              {currentWord.name}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-emerald-400 mb-4 font-mono">{score}</div>
              <div className="text-slate-400">最终得分</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-[20%] flex items-center justify-center"
            >
              {feedback === 'correct' ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              ) : (
                <XCircle className="w-16 h-16 text-rose-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-6 pb-12 grid grid-cols-2 gap-4">
        {COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => handleColorSelect(c.id)}
            disabled={isFinished || feedback !== null}
            className="h-16 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-transform"
            style={{ backgroundColor: c.value, color: '#fff' }}
          >
            {c.name}色
          </button>
        ))}
      </div>
    </div>
  );
}
