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
      key: '/mall',
      title: '商城',
      icon: ShoppingBag,
    },
    {
      key: '/profile',
      title: '档案',
      icon: User,
    },
  ];

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#FAFAFA] relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)]">
      {/* 沉浸式内容区，底部留出 TabBar 的高度与安全区 */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-grow shrink-0 flex flex-col min-h-full pb-[calc(env(safe-area-inset-bottom)+80px)]"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 高级毛玻璃导航栏 */}
      <div className="absolute bottom-0 left-0 w-full z-50 pb-[env(safe-area-inset-bottom)] bg-white/80 backdrop-blur-xl border-t border-slate-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-around items-center h-[64px] px-2">
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
                className="flex flex-col items-center justify-center w-16 h-full cursor-pointer transition-transform duration-300 active:scale-95"
              >
                <div className={`relative flex items-center justify-center transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {/* 选中态微弱发光点缀 */}
                  {isActive && (
                    <div className="absolute -top-1.5 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </div>
                <span
                  className={`text-[11px] mt-1 font-semibold tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
