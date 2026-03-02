// File: src/components/RecallOverlay/index.tsx
import React, { useState } from 'react';
import { Button, Input, Toast } from 'antd-mobile';
import { useRecallStore, DangerLevel } from '../../store/recall';

export const RecallOverlay: React.FC = () => {
  const { isTriggered, dangerLevel, message, dismissRecall } = useRecallStore();
  const [authCode, setAuthCode] = useState('');

  // 仅在触发且为最高级别熔断时渲染
  if (!isTriggered || dangerLevel !== DangerLevel.CRITICAL) return null;

  const handleDismiss = () => {
    const success = dismissRecall(authCode);
    if (!success) {
      Toast.show({ content: '授权码错误，无法解除熔断！', icon: 'fail' });
    } else {
      setAuthCode('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#FF3141] flex flex-col items-center justify-center p-6 text-white" 
      style={{ touchAction: 'none' }} // 彻底锁死底层交互
    >
      <div className="text-7xl mb-4">⚠️</div>
      <h1 className="text-3xl font-black mb-4 text-center tracking-widest">系统级熔断报警</h1>
      
      <div className="bg-white/20 p-5 rounded-xl w-full mb-10">
        <p className="text-xl font-bold text-center leading-relaxed">
          {message || '检测到极危生命体征，已触发最高级别警报！'}
        </p>
      </div>
      
      <div className="w-full space-y-5 mb-12">
        <Button 
          block 
          size="large" 
          className="bg-white text-[#FF3141] font-black text-2xl h-16 rounded-2xl shadow-xl border-0" 
          onClick={() => window.location.href = 'tel:120'}
        >
          立即拨打 120
        </Button>
        <Button 
          block 
          size="large" 
          className="bg-transparent border-2 border-white text-white font-bold text-xl h-14 rounded-2xl" 
          onClick={() => Toast.show({ content: '已向家属发送紧急定位' })}
        >
          已联系家属
        </Button>
      </div>

      <div className="mt-auto w-full pt-6 border-t border-white/30">
        <p className="text-xs text-white/80 mb-3 text-center">仅限医生或高级授权解除 (测试码: EMERGENCY_OVERRIDE_120)</p>
        <div className="flex gap-3">
          <Input 
            placeholder="输入授权码" 
            value={authCode}
            onChange={setAuthCode}
            className="bg-white/20 px-4 py-3 rounded-xl text-white placeholder:text-white/60 flex-1 font-mono"
          />
          <Button 
            color="default" 
            onClick={handleDismiss} 
            className="rounded-xl font-bold px-6 border-0 text-[#FF3141]"
          >
            解除
          </Button>
        </div>
      </div>
    </div>
  );
};
