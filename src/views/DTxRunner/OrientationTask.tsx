import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sun, Snowflake, Leaf, CloudRain, Clock, Calendar } from 'lucide-react';

interface OrientationTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

const QUESTIONS = [
  {
    id: 'time',
    type: 'time',
    question: '现在的季节是？',
    options: [
      { id: 'spring', label: '春季', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { id: 'summer', label: '夏季', icon: Sun, color: 'text-rose-500', bg: 'bg-rose-50' },
      { id: 'autumn', label: '秋季', icon: CloudRain, color: 'text-amber-500', bg: 'bg-amber-50' },
      { id: 'winter', label: '冬季', icon: Snowflake, color: 'text-blue-500', bg: 'bg-blue-50' },
    ],
    correctId: 'spring' // Mock correct answer
  },
  {
    id: 'clock',
    type: 'clock',
    question: '请选择“下午三点”',
    options: [
      { id: '15:00', label: '15:00', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
      { id: '08:00', label: '08:00', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
      { id: '10:30', label: '10:30', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
      { id: '20:00', label: '20:00', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
    ],
    correctId: '15:00'
  },
  {
    id: 'date',
    type: 'date',
    question: '今天是星期几？',
    options: [
      { id: 'mon', label: '星期一', icon: Calendar, color: 'text-slate-500', bg: 'bg-slate-50' },
      { id: 'wed', label: '星期三', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
      { id: 'fri', label: '星期五', icon: Calendar, color: 'text-slate-500', bg: 'bg-slate-50' },
      { id: 'sun', label: '星期日', icon: Calendar, color: 'text-slate-500', bg: 'bg-slate-50' },
    ],
    correctId: 'wed' // Mock correct answer
  }
];

export default function OrientationTask({ onComplete, onExit }: OrientationTaskProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];

  const handleSelect = (optionId: string) => {
    if (optionId === currentQuestion.correctId) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setWrongAttempts([]);
        if (currentStep < QUESTIONS.length - 1) {
          setCurrentStep(s => s + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      // Errorless learning: gently hide the wrong option
      if (!wrongAttempts.includes(optionId)) {
        setWrongAttempts([...wrongAttempts, optionId]);
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            进度 {currentStep + 1} / {QUESTIONS.length}
          </span>
        </div>
        <button 
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center active:bg-slate-50 transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key={`q-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((opt) => {
                  const isWrong = wrongAttempts.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      animate={{ opacity: isWrong ? 0 : 1, scale: isWrong ? 0.9 : 1 }}
                      disabled={isWrong}
                      onClick={() => handleSelect(opt.id)}
                      className={`
                        h-32 rounded-3xl flex flex-col items-center justify-center gap-3
                        bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100
                        active:scale-95 transition-transform
                        ${isWrong ? 'pointer-events-none' : ''}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-full ${opt.bg} flex items-center justify-center`}>
                        <opt.icon className={`w-6 h-6 ${opt.color}`} />
                      </div>
                      <span className="text-xl font-bold text-slate-700">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Sun className="w-16 h-16 text-emerald-500" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-emerald-600">太棒了！</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
