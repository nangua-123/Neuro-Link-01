import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, CheckCircle2 } from 'lucide-react';

interface FaceMatchTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

const FACES = [
  { id: 'f1', name: '李阿姨', relation: '女儿', image: 'https://picsum.photos/seed/daughter/200/200' },
  { id: 'f2', name: '王叔叔', relation: '老伴', image: 'https://picsum.photos/seed/spouse/200/200' },
  { id: 'f3', name: '小明', relation: '孙子', image: 'https://picsum.photos/seed/grandson/200/200' },
];

export default function FaceMatchTask({ onComplete, onExit }: FaceMatchTaskProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentFace = FACES[currentStep];

  // Generate options (1 correct, 2 random wrong)
  const options = FACES.map(f => ({ id: f.id, relation: f.relation }));
  // Shuffle options
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

  const handleSelect = (optionId: string) => {
    if (optionId === currentFace.id) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setWrongAttempts([]);
        if (currentStep < FACES.length - 1) {
          setCurrentStep(s => s + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
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
            进度 {currentStep + 1} / {FACES.length}
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
              key={`face-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
                照片里的人是您的？
              </h2>

              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mb-10 bg-slate-200">
                <img 
                  src={currentFace.image} 
                  alt="Family member" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full space-y-4">
                {shuffledOptions.map((opt) => {
                  const isWrong = wrongAttempts.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      animate={{ opacity: isWrong ? 0 : 1, x: isWrong ? 20 : 0 }}
                      disabled={isWrong}
                      onClick={() => handleSelect(opt.id)}
                      className={`
                        w-full h-16 rounded-2xl flex items-center justify-center
                        bg-white shadow-sm border border-slate-200
                        active:scale-95 transition-transform text-xl font-bold text-slate-700
                        ${isWrong ? 'pointer-events-none' : ''}
                      `}
                    >
                      {opt.relation}
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
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-blue-500" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-blue-600">认对啦！</h2>
              <p className="text-blue-500 mt-2 text-lg">这是您的{currentFace.relation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
