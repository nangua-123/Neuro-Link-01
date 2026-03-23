import React from 'react';
import { useOutlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquareText,
  HeartPulse,
  ShoppingBag,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();

  const tabs = [
    {
      key: '/',
      title: '预问诊',
      icon: MessageSquareText,
    },
    {
      key: '/manager',
      title: '居家管家',
      icon: HeartPulse,
    },
    {
      key: '/equipments',
      title: '装备',
      icon: ShoppingBag,
    },
    {
      key: '/profile',
      title: '档案',
      icon: User,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-[#FAFAFA] relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)]">
      {/* 沉浸式内容区，底部留出 TabBar 的高度与安全区 */}
      <div className="flex-1 overflow-y-auto relative hide-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.22, 1, 0.36, 1] // Custom easing for smooth C-end feel
            }}
            className="min-h-full pb-[calc(env(safe-area-inset-bottom)+80px)] w-full"
          >
            <React.Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>}>
              {outlet}
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 高级毛玻璃导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-[env(safe-area-inset-bottom)] bg-white/80 backdrop-blur-2xl border-t border-slate-100/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-[68px] px-2 relative">
          {tabs.map((item) => {
            // 精确匹配首页，其他路由支持前缀匹配
            const isActive = item.key === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.key);
            
            const Icon = item.icon;
            
            return (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                className="relative flex flex-col items-center justify-center w-16 h-full cursor-pointer group"
              >
                {/* 激活态背景胶囊 (Shared Layout Animation) */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 my-1.5 mx-1 bg-blue-50/80 rounded-2xl z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                
                <motion.div 
                  className={`relative z-10 flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <div className="relative flex items-center justify-center mb-1">
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    {/* 选中态微弱发光点缀 */}
                    {isActive && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] border-2 border-white" 
                      />
                    )}
                  </div>
                  <span
                    className={`text-[12px] font-bold tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.title}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
