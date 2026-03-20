import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, ShoppingCart, Pill, Apple, CheckCircle2 } from 'lucide-react';

interface DailyExecTaskProps {
  onComplete: () => void;
  onExit: () => void;
}

interface Item {
  id: string;
  name: string;
  type: 'food' | 'med';
  icon: React.ElementType;
  color: string;
  bg: string;
}

const ITEMS: Item[] = [
  { id: 'i1', name: '苹果', type: 'food', icon: Apple, color: 'text-rose-500', bg: 'bg-rose-100' },
  { id: 'i2', name: '降压药', type: 'med', icon: Pill, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'i3', name: '香蕉', type: 'food', icon: Apple, color: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 'i4', name: '感冒胶囊', type: 'med', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-100' },
];

export default function DailyExecTask({ onComplete, onExit }: DailyExecTaskProps) {
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentItem = items[currentItemIndex];

  const handleDragEnd = (event: any, info: any) => {
    const dropY = info.point.y;
    const dropX = info.point.x;
    
    // Simple hit detection based on screen regions
    const isLeftHalf = dropX < window.innerWidth / 2;
    const isRightHalf = dropX >= window.innerWidth / 2;
    const isBottomHalf = dropY > window.innerHeight / 2;

    if (isBottomHalf) {
      if (isLeftHalf && currentItem.type === 'food') {
        handleCorrect();
      } else if (isRightHalf && currentItem.type === 'med') {
        handleCorrect();
      } else {
        handleWrong();
      }
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setTimeout(() => {
      setFeedback(null);
      if (currentItemIndex < items.length - 1) {
        setCurrentItemIndex(i => i + 1);
      } else {
        setShowSuccess(true);
        setTimeout(onComplete, 2000);
      }
    }, 800);
  };

  const handleWrong = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setFeedback('wrong');
    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2 relative z-10">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            进度 {Math.min(currentItemIndex + 1, items.length)} / {items.length}
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
      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Top Area: Draggable Item */}
              <div className="flex-1 flex flex-col items-center justify-center relative z-20">
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
                  请将物品拖入正确的分类
                </h2>
                
                <AnimatePresence mode="wait">
                  {currentItem && !feedback && (
                    <motion.div
                      key={currentItem.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={1}
                      onDragEnd={handleDragEnd}
                      className={`
                        w-32 h-32 rounded-3xl ${currentItem.bg} flex flex-col items-center justify-center
                        shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-4 border-white cursor-grab active:cursor-grabbing
                      `}
                    >
                      <currentItem.icon className={`w-12 h-12 ${currentItem.color} mb-2`} />
                      <span className={`font-bold ${currentItem.color}`}>{currentItem.name}</span>
                    </motion.div>
                  )}
                  {feedback === 'correct' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    </motion.div>
                  )}
                  {feedback === 'wrong' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, x: [-10, 10, -10, 10, 0] }}
                      className="w-32 h-32 rounded-full bg-rose-100 flex items-center justify-center"
                    >
                      <X className="w-16 h-16 text-rose-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Area: Drop Zones */}
              <div className="h-64 flex border-t-2 border-dashed border-slate-200 bg-white relative z-10">
                <div className="flex-1 border-r-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-amber-50/30">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-3">
                    <ShoppingCart className="w-8 h-8 text-amber-600" />
                  </div>
                  <span className="text-xl font-bold text-amber-700">购物车</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-blue-50/30">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-3">
                    <Pill className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-xl font-bold text-blue-700">药盒</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-600">分类完成！</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
