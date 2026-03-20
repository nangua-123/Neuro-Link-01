import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Check, X as XIcon } from 'lucide-react';

interface NBackTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

const SHAPES = ['circle', 'square', 'triangle', 'star'];
const N_BACK = 2;
const TOTAL_TRIALS = 20;
const DISPLAY_TIME = 1500;
const BLANK_TIME = 500;

export default function NBackTask({ onComplete, onExit }: NBackTaskProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'display' | 'blank' | 'finished'>('blank');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  // Generate sequence
  useEffect(() => {
    const seq: string[] = [];
    for (let i = 0; i < TOTAL_TRIALS; i++) {
      // 30% chance to match the N-back item
      if (i >= N_BACK && Math.random() < 0.3) {
        seq.push(seq[i - N_BACK]);
      } else {
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        seq.push(randomShape);
      }
    }
    setSequence(seq);
    setCurrentIndex(0);
    setPhase('display');
  }, []);

  const nextTrial = useCallback(() => {
    setFeedback(null);
    setHasResponded(false);
    
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= TOTAL_TRIALS) {
        setPhase('finished');
        setTimeout(onComplete, 2000);
        return prev;
      }
      return next;
    });
    setPhase('display');
  }, [onComplete]);

  // Game loop
  useEffect(() => {
    if (phase === 'finished' || currentIndex < 0) return;

    if (phase === 'display') {
      timerRef.current = window.setTimeout(() => {
        setPhase('blank');
      }, DISPLAY_TIME);
    } else if (phase === 'blank') {
      timerRef.current = window.setTimeout(() => {
        nextTrial();
      }, BLANK_TIME);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, currentIndex, nextTrial]);

  const handleResponse = (isMatch: boolean) => {
    if (hasResponded || phase === 'finished' || currentIndex < N_BACK) return;

    setHasResponded(true);
    const actualMatch = sequence[currentIndex] === sequence[currentIndex - N_BACK];
    
    if (isMatch === actualMatch) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      if (navigator.vibrate) navigator.vibrate(50);
      setFeedback('wrong');
    }
  };

  const renderShape = (shape: string) => {
    switch (shape) {
      case 'circle':
        return <div className="w-32 h-32 rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]" />;
      case 'square':
        return <div className="w-32 h-32 bg-emerald-500 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)]" />;
      case 'triangle':
        return (
          <div 
            className="w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-b-[110px] border-b-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" 
          />
        );
      case 'star':
        return (
          <div className="relative w-32 h-32 flex items-center justify-center text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="text-slate-300 font-medium bg-white/10 px-3 py-1.5 rounded-full text-sm">
            进度: <span className="font-mono text-white">{Math.min(currentIndex + 1, TOTAL_TRIALS)}/{TOTAL_TRIALS}</span>
          </div>
          <div className="text-slate-300 font-medium bg-white/10 px-3 py-1.5 rounded-full text-sm">
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
        <p className="text-slate-400 text-sm">当前图形与<span className="text-white font-bold mx-1">{N_BACK}步前</span>的图形是否一致？</p>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {phase === 'display' && currentIndex >= 0 && (
            <motion.div
              key={`shape-${currentIndex}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {renderShape(sequence[currentIndex])}
            </motion.div>
          )}
          {phase === 'finished' && (
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
              className="absolute top-[15%] flex items-center justify-center"
            >
              {feedback === 'correct' ? (
                <Check className="w-12 h-12 text-emerald-400" />
              ) : (
                <XIcon className="w-12 h-12 text-rose-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-6 pb-12 flex gap-4">
        <button
          onClick={() => handleResponse(false)}
          disabled={currentIndex < N_BACK || hasResponded || phase === 'finished'}
          className="flex-1 h-16 rounded-2xl font-bold text-lg bg-slate-800 border border-slate-700 text-slate-300 shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          不一致
        </button>
        <button
          onClick={() => handleResponse(true)}
          disabled={currentIndex < N_BACK || hasResponded || phase === 'finished'}
          className="flex-1 h-16 rounded-2xl font-bold text-lg bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          一致
        </button>
      </div>
    </div>
  );
}
